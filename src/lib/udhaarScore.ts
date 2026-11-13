/**
 * UDHAAR SCORE ENGINE
 * 
 * Fully deterministic, rule-based credit scoring (0 - 100).
 * ZERO AI in the calculation. All metrics are derived from append-only ledger entries.
 * 
 * Rules:
 * 1. Due date: each credit entry is due on the 15th of the month after it was given.
 * 2. Payment matching: FIFO (oldest unpaid credit first).
 * 3. Score calculation (0 - 100):
 *    - Starts at 100
 *    - Subtracts points for each late day per overdue amount (weighted by amount share)
 *    - Subtracts extra penalty for credits still unpaid past their due date
 *    - Adds back bonus points for credits paid on time
 *    - Formula documented in ONE clean function with constants at the top.
 */

// =============================================================================
// CONSTANTS
// =============================================================================
export const STARTING_SCORE = 100;
export const MIN_SCORE = 0;
export const MAX_SCORE = 100;

// Deduction & Addition Weights:
export const LATE_DAY_WEIGHT = 2.0;               // Points deducted per day late, scaled by amount share
export const UNPAID_OVERDUE_FLAT_PENALTY = 15.0; // Flat penalty for credit currently past due date and still unpaid
export const UNPAID_OVERDUE_DAY_WEIGHT = 1.0;    // Additional daily penalty per overdue day, scaled by amount share
export const ON_TIME_BONUS = 5.0;                // Bonus points awarded per on-time settled credit

// Score Bands:
export const BAND_GOOD_THRESHOLD = 80;
export const BAND_WATCH_THRESHOLD = 50;

export type ScoreBand = "Good" | "Watch" | "Risky";

// Multipliers for Suggested Credit Limit based on Shop Base Limit:
export const BAND_MULTIPLIERS: Record<ScoreBand, number> = {
  Good: 1.0,   // 100% of base limit
  Watch: 0.5,  // 50% of base limit
  Risky: 0.2,  // 20% of base limit
};

export interface SettlementDetail {
  creditId: string;
  paymentId: string;
  amountPaise: number;
  paidAt: Date;
  dueDate: Date;
  isLate: boolean;
  daysLate: number;
}

export interface CreditStatus {
  id: string;
  amountPaise: number;
  unpaidPaise: number;
  createdAt: Date;
  dueDate: Date;
  isOverdue: boolean;
  daysOverdue: number;
  settlements: SettlementDetail[];
}

export interface UdhaarScoreResult {
  score: number;
  band: ScoreBand;
  reasons: string[];
  suggestedLimitPaise: number;
  baseLimitPaise: number;
  totalCreditGivenPaise: number;
  totalPaidPaise: number;
  currentDuePaise: number;
  credits: CreditStatus[];
}

/**
 * 1. Due Date Rule:
 * "each credit entry is due on the 15th of the month after it was given."
 */
export function getCreditDueDate(givenDate: Date): Date {
  const d = new Date(givenDate);
  const year = d.getFullYear();
  const month = d.getMonth();
  // 15th of next month, 23:59:59.999
  return new Date(year, month + 1, 15, 23, 59, 59, 999);
}

/**
 * 2 & 3. Deterministic Udhaar Score & FIFO Payment Matching
 * 
 * Computes customer score and suggested credit limit entirely on server.
 * Stores nothing that cannot be recomputed.
 */
export function computeUdhaarScore(
  entries: Array<{
    id: string;
    type: string;
    amountPaise: number;
    note: string | null;
    createdAt: Date | string;
  }>,
  shopBaseLimitPaise: number = 500000, // default ₹5,000 base
  referenceDate: Date = new Date()
): UdhaarScoreResult {
  // Separate into chronological credits and payments
  const rawCredits = entries
    .filter((e) => e.type === "CREDIT_GIVEN")
    .map((e) => ({
      id: e.id,
      amountPaise: e.amountPaise,
      createdAt: new Date(e.createdAt),
      dueDate: getCreditDueDate(new Date(e.createdAt)),
      unpaidPaise: e.amountPaise,
      settlements: [] as SettlementDetail[],
    }))
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  const rawPayments = entries
    .filter((e) => e.type === "PAYMENT_RECEIVED")
    .map((e) => ({
      id: e.id,
      amountPaise: e.amountPaise,
      availablePaise: e.amountPaise,
      paidAt: new Date(e.createdAt),
    }))
    .sort((a, b) => a.paidAt.getTime() - b.paidAt.getTime());

  // FIFO Payment Matching: apply each payment to oldest unpaid credit first
  for (const payment of rawPayments) {
    for (const credit of rawCredits) {
      if (payment.availablePaise <= 0) break;
      if (credit.unpaidPaise <= 0) continue;

      const allocatedPaise = Math.min(payment.availablePaise, credit.unpaidPaise);
      const isLate = payment.paidAt.getTime() > credit.dueDate.getTime();
      let daysLate = 0;
      if (isLate) {
        daysLate = Math.ceil(
          (payment.paidAt.getTime() - credit.dueDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      }

      credit.settlements.push({
        creditId: credit.id,
        paymentId: payment.id,
        amountPaise: allocatedPaise,
        paidAt: payment.paidAt,
        dueDate: credit.dueDate,
        isLate,
        daysLate,
      });

      credit.unpaidPaise -= allocatedPaise;
      payment.availablePaise -= allocatedPaise;
    }
  }

  // Summary totals
  let totalCreditGivenPaise = 0;
  for (const c of rawCredits) totalCreditGivenPaise += c.amountPaise;

  let totalPaidPaise = 0;
  for (const p of rawPayments) totalPaidPaise += p.amountPaise;

  const currentDuePaise = Math.max(0, totalCreditGivenPaise - totalPaidPaise);

  // If customer has never taken credit, return perfect score
  if (totalCreditGivenPaise === 0) {
    const band: ScoreBand = "Good";
    const suggestedLimitPaise = Math.round(shopBaseLimitPaise * BAND_MULTIPLIERS[band]);
    return {
      score: 100,
      band,
      reasons: ["No credit history yet (New customer)"],
      suggestedLimitPaise,
      baseLimitPaise: shopBaseLimitPaise,
      totalCreditGivenPaise: 0,
      totalPaidPaise,
      currentDuePaise: 0,
      credits: [],
    };
  }

  // Calculate score starting at 100
  let calculatedScore = STARTING_SCORE;
  const reasons: string[] = [];
  let latePaymentsCount = 0;
  let onTimePaymentsCount = 0;

  // Process historical settlements
  for (const credit of rawCredits) {
    for (const st of credit.settlements) {
      if (st.isLate) {
        latePaymentsCount++;
        const share = st.amountPaise / totalCreditGivenPaise;
        const penalty = Math.round(share * st.daysLate * LATE_DAY_WEIGHT);
        calculatedScore -= penalty;
        const month = credit.createdAt.toLocaleString("en-US", { month: "short" });
        reasons.push(`₹${(st.amountPaise / 100).toFixed(0)} from ${month} was paid ${st.daysLate} days late (-${penalty} pts)`);
      } else {
        onTimePaymentsCount++;
        calculatedScore += ON_TIME_BONUS;
      }
    }
  }

  // Process currently unpaid / overdue credits
  const creditsStatus: CreditStatus[] = [];
  for (const credit of rawCredits) {
    const isOverdue = credit.unpaidPaise > 0 && referenceDate.getTime() > credit.dueDate.getTime();
    let daysOverdue = 0;
    if (isOverdue) {
      daysOverdue = Math.ceil(
        (referenceDate.getTime() - credit.dueDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const share = credit.unpaidPaise / totalCreditGivenPaise;
      const penalty = Math.round(
        UNPAID_OVERDUE_FLAT_PENALTY + share * daysOverdue * UNPAID_OVERDUE_DAY_WEIGHT
      );
      calculatedScore -= penalty;
      const month = credit.createdAt.toLocaleString("en-US", { month: "short" });
      reasons.push(`₹${(credit.unpaidPaise / 100).toFixed(0)} from ${month}, ${daysOverdue} days overdue (-${penalty} pts)`);
    }

    creditsStatus.push({
      id: credit.id,
      amountPaise: credit.amountPaise,
      unpaidPaise: credit.unpaidPaise,
      createdAt: credit.createdAt,
      dueDate: credit.dueDate,
      isOverdue,
      daysOverdue,
      settlements: credit.settlements,
    });
  }

  // Summary positive reason if clean record
  if (latePaymentsCount === 0 && reasons.length === 0) {
    if (onTimePaymentsCount > 0) {
      reasons.push(`${onTimePaymentsCount} credit payments cleared on time (+${onTimePaymentsCount * ON_TIME_BONUS} pts bonus)`);
    } else {
      reasons.push("All active credit is within current due dates");
    }
  }

  if (latePaymentsCount > 0) {
    reasons.unshift(`${latePaymentsCount} late payment${latePaymentsCount > 1 ? "s" : ""} recorded in khata`);
  }

  // Clamp score strictly between MIN_SCORE and MAX_SCORE
  const finalScore = Math.max(MIN_SCORE, Math.min(MAX_SCORE, Math.round(calculatedScore)));

  // Determine band
  let band: ScoreBand = "Good";
  if (finalScore >= BAND_GOOD_THRESHOLD) {
    band = "Good";
  } else if (finalScore >= BAND_WATCH_THRESHOLD) {
    band = "Watch";
  } else {
    band = "Risky";
  }

  // 5. Suggested Credit Limit = Shop Base Limit scaled by score band
  const multiplier = BAND_MULTIPLIERS[band];
  const suggestedLimitPaise = Math.round(shopBaseLimitPaise * multiplier);

  return {
    score: finalScore,
    band,
    reasons,
    suggestedLimitPaise,
    baseLimitPaise: shopBaseLimitPaise,
    totalCreditGivenPaise,
    totalPaidPaise,
    currentDuePaise,
    credits: creditsStatus,
  };
}
