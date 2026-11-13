/**
 * Money utilities for Udhaar Saathi.
 * All amounts in DB are stored as INTEGER PAISE (1 INR = 100 paise).
 * This eliminates floating-point rounding errors.
 */

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

export function paiseToRupees(paise: number): number {
  return paise / 100;
}

export function formatINR(paise: number, showSign: boolean = false): string {
  const rupees = paise / 100;
  const absRupees = Math.abs(rupees);
  
  // Format to Indian numbering system (e.g. 1,00,000)
  const formatted = new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: rupees % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(absRupees);

  if (showSign) {
    if (paise > 0) return `+₹${formatted}`;
    if (paise < 0) return `-₹${formatted}`;
    return `₹0`;
  }

  return `₹${formatted}`;
}
