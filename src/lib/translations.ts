export type Language = "en" | "hi" | "as";

export interface Translations {
  appName: string;
  tagline: string;
  loginTitle: string;
  loginSubtitle: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  loginButton: string;
  logoutButton: string;
  demoPasswordHint: string;
  useDemoPassword: string;
  invalidPassword: string;
  singleShopSecured: string;
  
  // Navigation & Headers
  dashboard: string;
  customers: string;
  addCustomer: string;
  editCustomer: string;
  allCustomers: string;
  searchPlaceholder: string;
  noCustomersFound: string;
  noCustomersYet: string;
  addFirstCustomer: string;
  kiranaBadge: string;
  digitalKhataSubtitle: string;
  khataSummaryTitle: string;
  totalCount: string;
  profitSaathiNav: string;
  
  // Customer details & cards
  customerName: string;
  customerPhone: string;
  balanceOwed: string;
  advancePaid: string;
  settled: string;
  totalBalance: string;
  remindWhatsApp: string;
  viewLedger: string;
  save: string;
  cancel: string;
  filterAll: string;
  filterDues: string;
  filterSettled: string;
  phoneHelperText: string;
  entriesCount: string;
  noSearchMatch: (query: string) => string;
  
  // Dashboard Metrics
  totalOutstanding: string;
  customersWithDues: string;
  topDebtors: string;
  quickActions: string;
  recentActivity: string;
  demoDataBadge: string;
  liveFeed: string;
  rationPantryTitle: string;
  rationPantrySubtitle: string;
  rationPantryDesc: string;
  openButton: string;
  flourGrains: string;
  essentialRation: string;
  mustardOil: string;
  fastMoving: string;
  teaSpices: string;
  profitLeader: string;
  
  // Ledger
  ledgerTitle: string;
  giveCredit: string;
  receivePayment: string;
  creditGiven: string;
  paymentReceived: string;
  amountLabel: string;
  amountPlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  submitEntry: string;
  entriesHistory: string;
  noEntriesYet: string;
  netBalance: string;
  reverseEntry: string;
  reversedNotice: string;
  customersBreadcrumb: string;
  recordTransaction: string;
  recordInstructions: string;
  udhaarScoreTitle: string;
  suggestedLimit: string;
  advisoryNote: string;
  scoreFactorsTitle: string;
  bandGood: string;
  bandWatch: string;
  bandRisky: string;
  
  // Profit Saathi
  profitSaathiTitle: string;
  profitSaathiSubtitle: string;
  addNewItem: string;
  totalStockCost: string;
  sellingValue: string;
  lowStockBadge: string;
  needsReorderSoon: string;
  deadStockBadge: string;
  noSales30Days: string;
  activeItemsCount: string;
  regularStock: string;
  velocityRanking: string;
  rankedByProfit: string;
  noItemsYet: string;
  addFirstItem: string;
  costPrice: string;
  sellingPrice: string;
  margin: string;
  salesPerDay: string;
  profitPerDay: string;
  perDay: string;
  sellButton: string;
  currentStock: string;
  avgSales: string;
  stockCoverDays: string;
  zeroSales: string;
  days: string;
  units: string;
  suggestedReorder: string;
  aiMorningBriefing: string;
  aiDisclaimer: string;
  deterministicReport: string;
  deterministicDesc: (count: number) => string;
  seasonalDemandHints: string;
  seasonalDisclaimer: string;
  productName: string;
  startingStock: string;
  category: string;
  saveProduct: string;
  saving: string;
  recordSaleTitle: string;
  availableStock: string;
  unitPrice: string;
  unitsSold: string;
  recording: string;
  confirmSale: string;
  targetCoverTitle: string;
  targetCoverDesc: string;
  bufferDays: string;
  saveSetting: string;
  
  // Confirmations & Alerts
  negativeBalanceWarningTitle: string;
  negativeBalanceWarningBody: string;
  confirmPayment: string;
  cancelPayment: string;
  appendOnlyNotice: string;
  
  // WhatsApp Reminder template
  reminderMessage: (name: string, shop: string, amount: string) => string;

  // Landing Page & Step-by-Step Explainer
  landingTagline: string;
  landingHeroTitle: string;
  landingHeroSubtitle: string;
  landingCtaStart: string;
  landingCtaDashboard: string;
  landingCtaHowItWorks: string;
  landingTrust1: string;
  landingTrust2: string;
  landingTrust3: string;
  landingTrust4: string;
  alreadyLoggedInBanner: (name: string) => string;

  howItWorksHeading: string;
  howItWorksSubheading: string;

  step1Badge: string;
  step1Title: string;
  step1Desc: string;
  step1Feature1: string;
  step1Feature2: string;
  step1Feature3: string;

  step2Badge: string;
  step2Title: string;
  step2Desc: string;
  step2Feature1: string;
  step2Feature2: string;
  step2Feature3: string;

  step3Badge: string;
  step3Title: string;
  step3Desc: string;
  step3Feature1: string;
  step3Feature2: string;
  step3Feature3: string;

  step4Badge: string;
  step4Title: string;
  step4Desc: string;
  step4Feature1: string;
  step4Feature2: string;
  step4Feature3: string;

  step5Badge: string;
  step5Title: string;
  step5Desc: string;
  step5Feature1: string;
  step5Feature2: string;
  step5Feature3: string;

  comparisonTitle: string;
  comparisonSubtitle: string;
  paperKhata: string;
  paperPoint1: string;
  paperPoint2: string;
  paperPoint3: string;
  paperPoint4: string;
  paperPoint5: string;

  digitalKhata: string;
  digitalPoint1: string;
  digitalPoint2: string;
  digitalPoint3: string;
  digitalPoint4: string;
  digitalPoint5: string;

  landingBottomCtaTitle: string;
  landingBottomCtaDesc: string;
  landingBottomCtaButton: string;
}

export const translations: Record<Language, Translations> = {
  en: {
    appName: "Udhaar Saathi",
    tagline: "Digital Khata for Local Shopkeepers",
    loginTitle: "Shopkeeper Sign In",
    loginSubtitle: "Enter your shop password to access your ledger",
    passwordLabel: "Shop Password",
    passwordPlaceholder: "Enter password",
    loginButton: "Open Khata",
    logoutButton: "Logout",
    demoPasswordHint: "Default shop password is set in .env",
    useDemoPassword: "Use Default (kirana123)",
    invalidPassword: "Incorrect password. Please try again.",
    singleShopSecured: "Single-shopkeeper secured ledger (.env)",

    dashboard: "Dashboard",
    customers: "Customers",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",
    allCustomers: "All Customers",
    searchPlaceholder: "Search by name or 10-digit phone...",
    noCustomersFound: "No customer matching search query",
    noCustomersYet: "No customers in your khata yet",
    addFirstCustomer: "Add your first customer to start tracking udhaar",
    kiranaBadge: "Kirana",
    digitalKhataSubtitle: "Shopkeeper Digital Credit Register",
    khataSummaryTitle: "Khata Ledger Summary",
    totalCount: "Total",
    profitSaathiNav: "Profit Saathi (Stock & Margin)",

    customerName: "Customer Name",
    customerPhone: "10-digit Phone Number",
    balanceOwed: "Due Balance",
    advancePaid: "Advance Balance",
    settled: "All Clear (₹0)",
    totalBalance: "Net Due",
    remindWhatsApp: "Remind on WhatsApp",
    viewLedger: "Khata",
    save: "Save",
    cancel: "Cancel",
    filterAll: "All",
    filterDues: "Pending Dues",
    filterSettled: "Settled",
    phoneHelperText: "10-digit Indian mobile number for WhatsApp balance reminders",
    entriesCount: "entries",
    noSearchMatch: (query: string) => `No customer found matching "${query}". Check phone or spelling.`,

    totalOutstanding: "Total Udhaar (Outstanding)",
    customersWithDues: "Customers with Dues",
    topDebtors: "Top Customers by Balance Owed",
    quickActions: "Quick Actions",
    recentActivity: "Recent Entries",
    demoDataBadge: "Demo Data Mode",
    liveFeed: "Live Feed",
    rationPantryTitle: "Shop Stock & Inventory",
    rationPantrySubtitle: "Profit Saathi Inventory",
    rationPantryDesc: "Calculates stock days, reorder quantities, and daily profit from 30-day sales with zero guesswork.",
    openButton: "Open →",
    flourGrains: "Atta / Pulses",
    essentialRation: "Essentials",
    mustardOil: "Mustard Oil",
    fastMoving: "Fast Moving",
    teaSpices: "Tea & Spices",
    profitLeader: "Margin Leader",

    ledgerTitle: "Customer Khata",
    giveCredit: "Udhaar Diya (+ Credit)",
    receivePayment: "Jama Kiya (- Payment)",
    creditGiven: "Udhaar Diya (+)",
    paymentReceived: "Jama Kiya (-)",
    amountLabel: "Amount (₹)",
    amountPlaceholder: "0.00",
    noteLabel: "Reason / Item Note (Optional)",
    notePlaceholder: "e.g. Atta, Dal, Oil or UPI Ref",
    submitEntry: "Save to Khata",
    entriesHistory: "Transaction History",
    noEntriesYet: "No transactions recorded yet for this customer",
    netBalance: "Current Balance",
    reverseEntry: "Reversal Entry",
    reversedNotice: "Reversal of earlier entry",
    customersBreadcrumb: "Customers Directory",
    recordTransaction: "Record Transaction",
    recordInstructions: "Use the red button to give credit and green button to record received payment.",
    udhaarScoreTitle: "Udhaar Score",
    suggestedLimit: "Suggested Limit",
    advisoryNote: "Advisory",
    scoreFactorsTitle: "Payment History & Score Factors",
    bandGood: "Good",
    bandWatch: "Watch",
    bandRisky: "Risky",

    profitSaathiTitle: "Profit Saathi (Stock & Margin Assistant)",
    profitSaathiSubtitle: "30-day sales velocity, stock cover days & margin analytics",
    addNewItem: "Add Product",
    totalStockCost: "Total Stock Cost",
    sellingValue: "Selling Value",
    lowStockBadge: "Low Stock (≤7d)",
    needsReorderSoon: "Needs reorder soon",
    deadStockBadge: "Dead Stock",
    noSales30Days: "No sales in 30 days",
    activeItemsCount: "Active Inventory Items",
    regularStock: "Regular shop inventory",
    velocityRanking: "Product Velocity & Daily Profit Ranking",
    rankedByProfit: "Ranked by Profit/Day",
    noItemsYet: "No inventory items added yet",
    addFirstItem: "Add your first inventory product",
    costPrice: "Cost",
    sellingPrice: "Price",
    margin: "Margin",
    salesPerDay: "Sales",
    profitPerDay: "Daily Profit",
    perDay: "/day",
    sellButton: "Sell",
    currentStock: "Shop Stock",
    avgSales: "Avg Daily Sales",
    stockCoverDays: "Stock Cover Days",
    zeroSales: "Zero sales",
    days: "days",
    units: "units",
    suggestedReorder: "Suggested Reorder",
    aiMorningBriefing: "AI Morning Briefing",
    aiDisclaimer: "* Based strictly on your shop's 30-day recorded sales. No predictions or invented numbers.",
    deterministicReport: "Inventory Analytics (Deterministic)",
    deterministicDesc: (count: number) => `Tracking ${count} products. All metrics derived strictly from your 30-day sales register.`,
    seasonalDemandHints: "Seasonal Demand Context (General Hints)",
    seasonalDisclaimer: "* These hints reflect general Indian retail trends and are not automated demand forecasts.",
    productName: "Product Name",
    startingStock: "Starting Stock Units",
    category: "Category (Optional)",
    saveProduct: "Save Product",
    saving: "Saving...",
    recordSaleTitle: "Record Sale",
    availableStock: "Available in stock",
    unitPrice: "Unit Price",
    unitsSold: "Units Sold",
    recording: "Recording...",
    confirmSale: "Confirm Sale",
    targetCoverTitle: "Target Days of Cover",
    targetCoverDesc: "Set how many days of inventory buffer you wish to maintain when calculating the suggested reorder quantity.",
    bufferDays: "Buffer Days (Default: 14)",
    saveSetting: "Save Setting",

    negativeBalanceWarningTitle: "Excess Payment Warning",
    negativeBalanceWarningBody: "This payment exceeds the current balance owed and will result in an advance / negative balance. Do you want to continue?",
    confirmPayment: "Yes, Record Advance",
    cancelPayment: "Cancel",
    appendOnlyNotice: "Ledger is append-only. Corrections create a reversal entry.",

    reminderMessage: (name: string, shop: string, amount: string) =>
      `Namaste ${name}, your balance at ${shop} is ₹${amount}. Please pay when convenient. Thank you!`,

    // Landing Page & Step-by-Step Explainer
    landingTagline: "Say goodbye to paper diaries! Simple, reliable digital khata & profit assistant.",
    landingHeroTitle: "Replace Your Paper Diary with Smart Digital Khata",
    landingHeroSubtitle: "Crafted specifically for small Indian kirana & retail shops. Instant credit recording, polite 1-tap WhatsApp reminders, automatic credit health scoring, and smart stock alerts.",
    landingCtaStart: "Open Shop Khata / Login",
    landingCtaDashboard: "Go to Shop Dashboard",
    landingCtaHowItWorks: "See How It Works",
    landingTrust1: "100% Private to Your Shop",
    landingTrust2: "Exact Paise Math (Zero Calculation Errors)",
    landingTrust3: "Single Password — No KYC or Signups",
    landingTrust4: "Works Fluidly on Mobile, Tablet & PC",
    alreadyLoggedInBanner: (name: string) => `Currently logged in as ${name}. Click to open your live dashboard ➔`,

    howItWorksHeading: "How Udhaar Saathi Works (Step-by-Step)",
    howItWorksSubheading: "Designed so any non-technical shopkeeper can use it effortlessly in under 30 seconds.",

    step1Badge: "Step 1",
    step1Title: "Instant Single-Password Access",
    step1Desc: "No phone OTP delays, no complicated signups, and no messy forms. Enter your shop's secret password on your counter phone or PC, and your ledger opens instantly.",
    step1Feature1: "Zero registration friction",
    step1Feature2: "Protected session encryption",
    step1Feature3: "Data is 100% private to your shop",

    step2Badge: "Step 2",
    step2Title: "Add Customers & Record Khata in Seconds",
    step2Desc: "Add customers with their name and 10-digit mobile number. Record 'Credit Given' (उधार दिया) or 'Payment Received' (जमा किया) with a single tap. Ledger entries are strictly append-only so your audit trail is never lost.",
    step2Feature1: "Real-time search by name or phone",
    step2Feature2: "Negative balance safeguard for advances",
    step2Feature3: "Reversal entries preserve complete history",

    step3Badge: "Step 3",
    step3Title: "1-Tap Polite WhatsApp Reminders",
    step3Desc: "Never hesitate or feel awkward about asking neighbours for overdue dues. Tap one button to open WhatsApp with a respectful, pre-filled reminder in Hindi, English, or Assamese with the exact amount and shop name.",
    step3Feature1: "No expensive WhatsApp Business API fees",
    step3Feature2: "Polite pre-filled respectful message",
    step3Feature3: "Opens directly in customer's WhatsApp",

    step4Badge: "Step 4",
    step4Title: "Smart Udhaar Score & Credit Limits",
    step4Desc: "Know who pays on time and who delays! A 100% rule-based 0–100 score automatically categorizes customers into Good, Watch, or Risky based on FIFO payments and due dates (15th of next month in IST), suggesting safe credit limits.",
    step4Feature1: "100% transparent & deterministic rules",
    step4Feature2: "FIFO payment matching to oldest credit",
    step4Feature3: "Advisory warnings prevent bad debt",

    step5Badge: "Step 5",
    step5Title: "Profit Saathi: Daily Profit & Stock Velocity",
    step5Desc: "Stop letting valuable stock sit dead in godowns while fast-moving essentials run out. Profit Saathi tracks daily sales velocity, calculates days of stock remaining, suggests reorder amounts, and ranks your top moneymakers.",
    step5Feature1: "Atomic concurrency prevents negative stock",
    step5Feature2: "Automatic dead-stock detector (30 days)",
    step5Feature3: "Optional AI morning briefing in your language",

    comparisonTitle: "Paper Diary vs Udhaar Saathi",
    comparisonSubtitle: "Why local shopkeepers are upgrading to digital khata",
    paperKhata: "Old Paper Notebook (कागज़ी बही-खाता)",
    paperPoint1: "Pages tear, smudge with oil/water, or get lost",
    paperPoint2: "Mental addition mistakes lead to disputes & losses",
    paperPoint3: "Hesitation & awkwardness asking neighbours for dues",
    paperPoint4: "No idea which customer is becoming risky to lend to",
    paperPoint5: "Dead stock sits forgotten in godown while essentials run out",

    digitalKhata: "Udhaar Saathi (उधार साथी)",
    digitalPoint1: "Always secure, accessible from phone or counter PC",
    digitalPoint2: "Exact paise calculations, zero mathematical errors",
    digitalPoint3: "1-click polite WhatsApp reminder in customer's language",
    digitalPoint4: "Automatic Udhaar Score & safe suggested credit limits",
    digitalPoint5: "Profit Saathi tracks stock days, reorders & top margins",

    landingBottomCtaTitle: "Ready to Make Your Shop 100% Organized & Profitable?",
    landingBottomCtaDesc: "Takes less than 1 minute to start. Open your digital khata now!",
    landingBottomCtaButton: "Open My Shop Khata Now",
  },

  hi: {
    appName: "उधार साथी",
    tagline: "दुकानदारों का डिजिटल खाता",
    loginTitle: "दुकानदार लॉगिन",
    loginSubtitle: "अपने बही-खाता देखने के लिए दुकान का पासवर्ड डालें",
    passwordLabel: "दुकान का पासवर्ड",
    passwordPlaceholder: "पासवर्ड दर्ज करें",
    loginButton: "खाता खोलें",
    logoutButton: "लॉगआउट",
    demoPasswordHint: "डिफ़ॉल्ट पासवर्ड .env में सेट है",
    useDemoPassword: "डिफ़ॉल्ट पासवर्ड भरें (kirana123)",
    invalidPassword: "गलत पासवर्ड! कृपया दोबारा जांचें।",
    singleShopSecured: "एकल-दुकानदार सुरक्षित खाता (.env)",

    dashboard: "डैशबोर्ड",
    customers: "ग्राहक सूची",
    addCustomer: "नया ग्राहक जोड़ें",
    editCustomer: "ग्राहक विवरण बदलें",
    allCustomers: "सभी ग्राहक",
    searchPlaceholder: "नाम या 10 अंकों का फोन नंबर खोजें...",
    noCustomersFound: "कोई ग्राहक नहीं मिला",
    noCustomersYet: "खाते में अभी कोई ग्राहक नहीं है",
    addFirstCustomer: "उधार शुरू करने के लिए पहला ग्राहक जोड़ें",
    kiranaBadge: "किराना",
    digitalKhataSubtitle: "दुकानदार का डिजिटल खाता रजिस्टर",
    khataSummaryTitle: "खाता बही सारांश",
    totalCount: "कुल",
    profitSaathiNav: "प्रॉफ़िट साथी (राशन व मुनाफा)",

    customerName: "ग्राहक का नाम",
    customerPhone: "10 अंकों का मोबाइल नंबर",
    balanceOwed: "बकाया राशि (उधार)",
    advancePaid: "जमा / एडवांस",
    settled: "हिसाब चुकता (₹0)",
    totalBalance: "कुल बकाया",
    remindWhatsApp: "व्हाट्सएप पर याद दिलाएं",
    viewLedger: "खाता",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",
    filterAll: "सभी",
    filterDues: "उधार बाकी",
    filterSettled: "हिसाब चुकता",
    phoneHelperText: "10-अंकों का भारतीय मोबाइल नंबर (WhatsApp रिमाइंडर हेतु)",
    entriesCount: "प्रविष्टियां",
    noSearchMatch: (query: string) => `"${query}" के नाम या नंबर से कोई ग्राहक नहीं मिला। कृपया नंबर या वर्तनी जांचें।`,

    totalOutstanding: "कुल बकाया उधार",
    customersWithDues: "उधार वाले ग्राहक",
    topDebtors: "सबसे ज्यादा बकाया वाले टॉप ग्राहक",
    quickActions: "त्वरित कार्य",
    recentActivity: "ताज़ा लेन-देन",
    demoDataBadge: "डेमो डेटा मोड",
    liveFeed: "लाइव फीड",
    rationPantryTitle: "दुकान का राशन व स्टॉक",
    rationPantrySubtitle: "प्रॉफ़िट साथी इन्वेंट्री",
    rationPantryDesc: "30-दिनों की बिक्री से स्टॉक के दिन, रिऑर्डर मात्रा व मुनाफ़ा की गणना बिना किसी अनुमान के।",
    openButton: "खोलें →",
    flourGrains: "आटा / दाल",
    essentialRation: "आवश्यक राशन",
    mustardOil: "सरसों तेल",
    fastMoving: "तेज़ बिक्री",
    teaSpices: "चाय / मसाले",
    profitLeader: "मुनाफ़ा लीडर",

    ledgerTitle: "ग्राहक खाता बही",
    giveCredit: "उधार दिया (+ सामान दिया)",
    receivePayment: "जमा किया (- पैसे मिले)",
    creditGiven: "उधार दिया (+)",
    paymentReceived: "जमा किया (-)",
    amountLabel: "रुपये (₹)",
    amountPlaceholder: "0.00",
    noteLabel: "सामान या विवरण (वैकल्पिक)",
    notePlaceholder: "उदा. आटा, दाल, चीनी या UPI",
    submitEntry: "खाते में जोड़ें",
    entriesHistory: "लेन-देन का इतिहास",
    noEntriesYet: "इस ग्राहक का कोई लेन-देन दर्ज नहीं है",
    netBalance: "वर्तमान बकाया",
    reverseEntry: "सुधार प्रविष्टि (रिवर्सल)",
    reversedNotice: "पिछली प्रविष्टि का उलट हिसाब",
    customersBreadcrumb: "ग्राहक सूची",
    recordTransaction: "लेन-देन दर्ज करें",
    recordInstructions: "उधार देने के लिए लाल बटन व भुगतान जमा करने के लिए हरे बटन का उपयोग करें।",
    udhaarScoreTitle: "उधार साख (Score)",
    suggestedLimit: "सुझाया गया लिमिट",
    advisoryNote: "सलाहकारी",
    scoreFactorsTitle: "भुगतान इतिहास व स्कोर कारक",
    bandGood: "अच्छा (Good)",
    bandWatch: "सतर्क (Watch)",
    bandRisky: "जोखिम (Risky)",

    profitSaathiTitle: "Profit Saathi (राशन व मुनाफा साथी)",
    profitSaathiSubtitle: "30-दिनों की बिक्री से स्टॉक के दिन, रिऑर्डर मात्रा व मुनाफ़ा विश्लेषण",
    addNewItem: "नया राशन उत्पाद जोड़ें",
    totalStockCost: "कुल स्टॉक लागत",
    sellingValue: "बिक्री मूल्य",
    lowStockBadge: "कम स्टॉक (≤7d)",
    needsReorderSoon: "जल्द रिऑर्डर की आवश्यकता",
    deadStockBadge: "डेड स्टॉक",
    noSales30Days: "30 दिनों में शून्य बिक्री",
    activeItemsCount: "सक्रिय राशन आइटम",
    regularStock: "नियमित दुकान इन्वेंट्री",
    velocityRanking: "राशन आइटम व दैनिक मुनाफ़ा रैंकिंग",
    rankedByProfit: "दैनिक मुनाफ़े अनुसार क्रमबद्ध",
    noItemsYet: "अभी तक कोई सामान नहीं जोड़ा गया",
    addFirstItem: "पहला राशन उत्पाद जोड़ें",
    costPrice: "लागत",
    sellingPrice: "बिक्री मूल्य",
    margin: "मार्जिन",
    salesPerDay: "बिक्री",
    profitPerDay: "दैनिक मुनाफ़ा",
    perDay: "/दिन",
    sellButton: "बेचें",
    currentStock: "दुकान में स्टॉक",
    avgSales: "औसत बिक्री",
    stockCoverDays: "स्टॉक कितने दिन चलेगा",
    zeroSales: "शून्य बिक्री",
    days: "दिन",
    units: "units",
    suggestedReorder: "सुझाया रिऑर्डर",
    aiMorningBriefing: "AI Morning Briefing (दुकान रिपोर्ट)",
    aiDisclaimer: "* दुकान की 30-दिनों की वास्तविक बिक्री पर आधारित। कोई काल्पनिक भविष्यवाणियां नहीं।",
    deterministicReport: "इन्वेंट्री रिपोर्ट (Deterministic)",
    deterministicDesc: (count: number) => `कुल ${count} राशन उत्पाद ट्रैक हो रहे हैं। सभी आंकड़े आपकी दुकान के 30-दिनों के वास्तविक बिक्री रजिस्टर से निकाले गए हैं।`,
    seasonalDemandHints: "त्योहारी व मौसमी मांग संदर्भ (General Hints)",
    seasonalDisclaimer: "* यह संदर्भ सामान्य भारतीय खुदरा मांग पर आधारित है, यह कोई सांख्यिकीय भविष्यवाणी नहीं है।",
    productName: "उत्पाद का नाम",
    startingStock: "शुरुआती स्टॉक",
    category: "श्रेणी (वैकल्पिक)",
    saveProduct: "उत्पाद सहेजें",
    saving: "सहेज रहे हैं...",
    recordSaleTitle: "बिक्री दर्ज करें",
    availableStock: "उपलब्ध स्टॉक",
    unitPrice: "प्रति यूनिट मूल्य",
    unitsSold: "बेची गई इकाइयां",
    recording: "दर्ज हो रहा है...",
    confirmSale: "बिक्री पक्की करें",
    targetCoverTitle: "स्टॉक बफर लक्ष्य (दिन)",
    targetCoverDesc: "रिऑर्डर सुझाव गणना के लिए अपनी दुकान का लक्ष्य स्टॉक बफर (दिन) निर्धारित करें।",
    bufferDays: "Buffer Days (Default: 14 दिन)",
    saveSetting: "सेटिंग सहेजें",

    negativeBalanceWarningTitle: "अतिरिक्त भुगतान चेतावनी",
    negativeBalanceWarningBody: "यह भुगतान वर्तमान बकाया से अधिक है, जिससे ग्राहक का बैलेंस एडवांस हो जाएगा। क्या आप जारी रखना चाहते हैं?",
    confirmPayment: "हाँ, एडवांस दर्ज करें",
    cancelPayment: "रद्द करें",
    appendOnlyNotice: "खाता स्थायी है। सुधार के लिए नई प्रविष्टि जुड़ती है।",

    reminderMessage: (name: string, shop: string, amount: string) =>
      `नमस्ते ${name} जी, ${shop} पर आपका ₹${amount} बकाया है। कृपया सुविधानुसार भुगतान कर दें। धन्यवाद!`,

    // Landing Page & Step-by-Step Explainer
    landingTagline: "पुराने कागज़ी बही-खाते को कहें अलविदा! दुकानदारों का सरल, सुरक्षित डिजिटल खाता।",
    landingHeroTitle: "कागज़ी डायरी छोड़ें, अपनाएं स्मार्ट डिजिटल खाता",
    landingHeroSubtitle: "भारतीय किराना व खुदरा दुकानदारों के लिए विशेष रूप से निर्मित। झटपट उधार-जमा हिसाब, 1-टैप विनम्र व्हाट्सएप तगादा, स्वचालित उधार साख स्कोर और स्टॉक-मुनाफ़े की सटीक जानकारी।",
    landingCtaStart: "दुकान खाता खोलें / लॉगिन करें",
    landingCtaDashboard: "दुकान डैशबोर्ड पर जाएं",
    landingCtaHowItWorks: "देखें कैसे काम करता है",
    landingTrust1: "आपकी दुकान का 100% निजी डेटा",
    landingTrust2: "पाई-पाई का सटीक हिसाब (ज़ीरो गलती)",
    landingTrust3: "सिर्फ एक पासवर्ड — कोई फॉर्म या केवाईसी नहीं",
    landingTrust4: "मोबाइल, टैबलेट और पीसी पर एकदम आसान",
    alreadyLoggedInBanner: (name: string) => `दुकान '${name}' में लॉगिन हैं। सीधे लाइव डैशबोर्ड पर जाने के लिए यहां क्लिक करें ➔`,

    howItWorksHeading: "उधार साथी कैसे काम करता है? (कदम-दर-कदम समझें)",
    howItWorksSubheading: "किसी भी गैर-तकनीकी दुकानदार के लिए 30 सेकंड में समझने और इस्तेमाल करने योग्य।",

    step1Badge: "कदम 1",
    step1Title: "सिर्फ एक पासवर्ड से तुरंत लॉगिन",
    step1Desc: "न कोई ओटीपी, न लंबा फॉर्म, न कोई झंझट। अपनी दुकान के काउंटर फोन या कंप्यूटर पर सिर्फ अपना गुप्त पासवर्ड डालें और आपकी पूरी दुकान का खाता तुरंत खुल जाएगा।",
    step1Feature1: "बिना किसी साइनअप या कागजी औपचारिकता के",
    step1Feature2: "सुरक्षित सेशन और कड़ा डेटा पहरा",
    step1Feature3: "खाता केवल आपकी दुकान के लिए निजी",

    step2Badge: "कदम 2",
    step2Title: "ग्राहक जोड़ें और 5 सेकंड में बही-खाता लिखें",
    step2Desc: "ग्राहक का नाम और 10 अंकों का मोबाइल नंबर डालें। 'उधार दिया' (+ Credit) या 'जमा किया' (- Payment) एक टैप में दर्ज करें। हिसाब हमेशा सुरक्षित और पारदर्शी रहता है।",
    step2Feature1: "नाम या फोन नंबर से तुरंत खोजें",
    step2Feature2: "गलती से ज्यादा जमा रोकने के लिए सुरक्षा चेतावनी",
    step2Feature3: "रिवर्सल एंट्री से पूरा लेन-देन रिकॉर्ड सुरक्षित",

    step3Badge: "कदम 3",
    step3Title: "1-क्लिक में विनम्र व्हाट्सएप तगादा भेजें",
    step3Desc: "पड़ोसी या ग्राहक से उधारी मांगते समय कोई झिझक या शर्म नहीं। सिर्फ एक बटन दबाएं और ग्राहक की भाषा (हिंदी/अंग्रेजी/असमिया) में बना-बनाया विनम्र संदेश व्हाट्सएप पर खुल जाएगा।",
    step3Feature1: "बिना किसी महंगे व्हाट्सएप बिजनेस चार्ज के",
    step3Feature2: "सटीक बकाया राशि और दुकान के नाम के साथ",
    step3Feature3: "सीधे ग्राहक के व्हाट्सएप चैट में खुलता है",

    step4Badge: "कदम 4",
    step4Title: "स्मार्ट उधार स्कोर और सुरक्षा लिमिट",
    step4Desc: "कौन समय पर पैसा लौटाता है और कौन लटकाता है? 100% पारदर्शी नियमों के साथ 0-100 का उधार स्कोर ग्राहकों को 'अच्छा', 'सतर्क' या 'जोखिम' में बांटता है और सुरक्षित उधार सीमा बताता है।",
    step4Feature1: "100% स्पष्ट नियम (कोई गुप्त एआई नहीं)",
    step4Feature2: "पुराने उधार को पहले चुकता करने का नियम (FIFO)",
    step4Feature3: "उधार सीमा से ज्यादा जाने पर सतर्क करने वाली चेतावनी",

    step5Badge: "कदम 5",
    step5Title: "प्रॉफ़िट साथी: दैनिक बिक्री और स्टॉक सुरक्षा",
    step5Desc: "गोदाम में रुका हुआ माल पहचानें और रोज बिकने वाली आवश्यक वस्तुओं को खत्म होने से पहले मंगाएं। दैनिक बिक्री की रफ़्तार, बचे हुए दिन, ऑर्डर करने की सलाह और सबसे ज्यादा मुनाफा देने वाले उत्पाद देखें।",
    step5Feature1: "समानांतर बिक्री में भी स्टॉक कभी माइनस नहीं जाता",
    step5Feature2: "30 दिनों से न बिकने वाले सामान (Dead Stock) की पहचान",
    step5Feature3: "दुकानदार के लिए सुबह की सरल भाषा में ब्रीफिंग",

    comparisonTitle: "पुराना कागज़ी रजिस्टर बनाम उधार साथी",
    comparisonSubtitle: "जानिए क्यों हजारों दुकानदार डिजिटल खाते पर भरोसा करते हैं",
    paperKhata: "पुराना कागज़ी खाता",
    paperPoint1: "पन्ने फटना, तेल-पानी या सीलन से खराब होना",
    paperPoint2: "जोड़-घटाव में गलती से नुकसान या ग्राहक से विवाद",
    paperPoint3: "उधार का तगादा करने में शर्म और रिश्तों में खटास",
    paperPoint4: "कौन सा ग्राहक कितना लेट है, इसका कोई सही अंदाज नहीं",
    paperPoint5: "दुकान में कौन सा माल रुका पड़ा है, पता ही नहीं चलता",

    digitalKhata: "उधार साथी (डिजिटल खाता)",
    digitalPoint1: "हमेशा सुरक्षित, मोबाइल व कंप्यूटर पर कभी भी उपलब्ध",
    digitalPoint2: "पाई-पाई का सटीक हिसाब, शून्य गलती",
    digitalPoint3: "1-क्लिक में शिष्ट और विनम्र व्हाट्सएप संदेश",
    digitalPoint4: "ऑटोमैटिक उधार स्कोर और सुरक्षित लिमिट की सलाह",
    digitalPoint5: "प्रॉफ़िट साथी से स्टॉक के दिन और मुनाफे की पूरी जानकारी",

    landingBottomCtaTitle: "क्या आप अपनी दुकान को 100% व्यवस्थित और मुनाफ़ेदार बनाने के लिए तैयार हैं?",
    landingBottomCtaDesc: "शुरू करने में 1 मिनट से भी कम समय लगता है। अभी अपनी दुकान का खाता खोलें!",
    landingBottomCtaButton: "अपनी दुकान का खाता खोलें",
  },

  as: {
    appName: "ধাৰ সাৰথী",
    tagline: "দোকানীৰ ডিজিটেল খাতা বহি",
    loginTitle: "দোকানী প্ৰৱেশ",
    loginSubtitle: "আপোনাৰ খাতা চাবলৈ দোকানৰ পাছৱৰ্ড দিয়ক",
    passwordLabel: "দোকানৰ পাছৱৰ্ড",
    passwordPlaceholder: "পাছৱৰ্ড লিখক",
    loginButton: "খাতা খোলক",
    logoutButton: "লগআউট",
    demoPasswordHint: "ডিফল্ট পাছৱৰ্ড .env ত নিৰ্ধাৰণ কৰা হৈছে",
    useDemoPassword: "ডিফল্ট ব্যৱহাৰ কৰক (kirana123)",
    invalidPassword: "ভুল পাছৱৰ্ড! অনুগ্ৰহ কৰি পুনৰ চেষ্টা কৰক।",
    singleShopSecured: "সুৰক্ষিত একক খাতা (.env)",

    dashboard: "ডেচবৰ্ড",
    customers: "গ্ৰাহকসকল",
    addCustomer: "নতুন গ্ৰাহক যোগ কৰক",
    editCustomer: "গ্ৰাহক তথ্য শুধৰাওক",
    allCustomers: "সকলো গ্ৰাহক",
    searchPlaceholder: "নাম বা ১০-অংকৰ ফোন নম্বৰ সন্ধান কৰক...",
    noCustomersFound: "কোনো গ্ৰাহক বিচাৰি পোৱা নগল",
    noCustomersYet: "খাতাত এতিয়ালৈকে কোনো গ্ৰাহক নাই",
    addFirstCustomer: "ধাৰ আৰম্ভ কৰিবলৈ প্ৰথম গ্ৰাহক যোগ কৰক",
    kiranaBadge: "কিৰানা",
    digitalKhataSubtitle: "দোকানীৰ ডিজিটেল খাতা পঞ্জী",
    khataSummaryTitle: "খাতা বহি সাৰাংশ",
    totalCount: "মুঠ",
    profitSaathiNav: "প্ৰফিট সাৰথী (ৰেচন আৰু লাভ)",

    customerName: "গ্ৰাহকৰ নাম",
    customerPhone: "১০ অংকৰ মোবাইল নম্বৰ",
    balanceOwed: "বাকী থকা ধন",
    advancePaid: "আগধন / জমা",
    settled: "হিচাপ সমাপ্ত (₹0)",
    totalBalance: "মুঠ বাকী",
    remindWhatsApp: "হোৱাটছএপত সোঁৱৰাই দিয়ক",
    viewLedger: "খাতা",
    save: "সংৰক্ষণ কৰক",
    cancel: "বাতিল কৰক",
    filterAll: "সকলো",
    filterDues: "বাকী থকা",
    filterSettled: "পৰিশোধিত",
    phoneHelperText: "১০-অংকৰ মোবাইল নম্বৰ (WhatsApp সোঁৱৰণীৰ বাবে)",
    entriesCount: "প্ৰৱিষ্টি",
    noSearchMatch: (query: string) => `"${query}" ৰ নাম বা নম্বৰৰ কোনো গ্ৰাহক পোৱা নগ'ল।`,

    totalOutstanding: "মুঠ বাকী ধন",
    customersWithDues: "বাকী থকা গ্ৰাহকৰ সংখ্যা",
    topDebtors: "শীৰ্ষ বাকী থকা গ্ৰাহকসকল",
    quickActions: "দ্ৰুত কাৰ্য",
    recentActivity: "শেহতীয়া লেনদেন",
    demoDataBadge: "ডেমো তথ্য মোড",
    liveFeed: "লাইভ ফিড",
    rationPantryTitle: "দোকানৰ ৰেচন আৰু ষ্টক",
    rationPantrySubtitle: "প্ৰফিট সাৰথী ইনভেণ্টৰী",
    rationPantryDesc: "৩০ দিনৰ বিক্ৰীৰ পৰা ষ্টকৰ দিন, ৰিঅৰ্ডাৰ পৰিমাণ আৰু লাভ নিৰ্ধাৰণ।",
    openButton: "খোলক →",
    flourGrains: "আটা / দাইল",
    essentialRation: "প্ৰয়োজনীয় ৰেচন",
    mustardOil: "মিঠা তেল",
    fastMoving: "দ্ৰুত বিক্ৰী",
    teaSpices: "চাহ / মচলা",
    profitLeader: "লাভজনক সামগ্ৰী",

    ledgerTitle: "গ্ৰাহকৰ খাতা",
    giveCredit: "ধাৰ দিয়া হ'ল (+)",
    receivePayment: "জমা লোৱা হ'ল (-)",
    creditGiven: "ধাৰ দিয়া হ'ল (+)",
    paymentReceived: "জমা লোৱা হ'ল (-)",
    amountLabel: "টকা (₹)",
    amountPlaceholder: "0.00",
    noteLabel: "সামগ্ৰী / কাৰণ (ঐচ্ছিক)",
    notePlaceholder: "যেনে: আটা, চাউল বা ইউপিআই",
    submitEntry: "খাতাত যোগ কৰক",
    entriesHistory: "লেনদেনৰ ইতিহাস",
    noEntriesYet: "এই গ্ৰাহকৰ এতিয়ালৈকে কোনো লেনদেন হোৱা নাই",
    netBalance: "বৰ্তমানৰ বাকী",
    reverseEntry: "উলোটা হিচাপ (সংশোধন)",
    reversedNotice: "পূৰ্বৰ ভৰ্তিৰ সংশোধন",
    customersBreadcrumb: "গ্ৰাহক তালিকা",
    recordTransaction: "লেনদেন লিখক",
    recordInstructions: "ধাৰ দিবলৈ ৰঙা আৰু ধন লবলৈ সেউজীয়া বুটাম ব্যৱহাৰ কৰক।",
    udhaarScoreTitle: "ধাৰ স্কোৰ",
    suggestedLimit: "পৰামৰ্শিত সীমা",
    advisoryNote: "পৰামৰ্শমূলক",
    scoreFactorsTitle: "পৰিশোধৰ ইতিহাস আৰু কাৰক",
    bandGood: "ভাল (Good)",
    bandWatch: "নজৰ ৰাখক (Watch)",
    bandRisky: "বিপদজনক (Risky)",

    profitSaathiTitle: "প্ৰফিট সাৰথী (ৰেচন আৰু লাভ সাৰথী)",
    profitSaathiSubtitle: "৩০ দিনৰ বিক্ৰী, ষ্টকৰ দিন আৰু লাভৰ বিশ্লেষণ",
    addNewItem: "নতুন সামগ্ৰী যোগ কৰক",
    totalStockCost: "মুঠ ষ্টকৰ খৰচ",
    sellingValue: "বিক্ৰী মূল্য",
    lowStockBadge: "কম ষ্টক (≤৭ দিন)",
    needsReorderSoon: "শীঘ্ৰে অৰ্ডাৰৰ প্ৰয়োজন",
    deadStockBadge: "ডেড ষ্টক",
    noSales30Days: "৩০ দিনত কোনো বিক্ৰী নাই",
    activeItemsCount: "সক্ৰিয় সামগ্ৰী",
    regularStock: "নিয়মীয়া দোকানৰ ষ্টক",
    velocityRanking: "সামগ্ৰীৰ বিক্ৰী আৰু দৈনিক লাভ ৰেংকিং",
    rankedByProfit: "দৈনিক লাভ অনুসৰি ক্ৰমবদ্ধ",
    noItemsYet: "এতিয়ালৈকে কোনো সামগ্ৰী যোগ কৰা হোৱা নাই",
    addFirstItem: "প্ৰথম সামগ্ৰী যোগ কৰক",
    costPrice: "খৰচ",
    sellingPrice: "বিক্ৰী মূল্য",
    margin: "লাভৰ শতাংশ",
    salesPerDay: "বিক্ৰী",
    profitPerDay: "দৈনিক লাভ",
    perDay: "/দিন",
    sellButton: "বিক্ৰী কৰক",
    currentStock: "দোকানৰ ষ্টক",
    avgSales: "গড় দৈনিক বিক্ৰী",
    stockCoverDays: "ষ্টক কেইদিন থাকিব",
    zeroSales: "শূন্য বিক্ৰী",
    days: "দিন",
    units: "units",
    suggestedReorder: "পৰামৰ্শিত ৰিঅৰ্ডাৰ",
    aiMorningBriefing: "AI দোকানৰ ৰিপোৰ্ট",
    aiDisclaimer: "* দোকানৰ ৩০ দিনৰ প্ৰকৃত বিক্ৰীৰ ওপৰত আধাৰিত। কোনো কাল্পনিক ভৱিষ্যতবাণী নহয়।",
    deterministicReport: "ইনভেণ্টৰী বিশ্লেষণ",
    deterministicDesc: (count: number) => `মুঠ ${count} টা সামগ্ৰী ট্ৰেক কৰা হৈছে।`,
    seasonalDemandHints: "ঋতুভিত্তিক চাহিদাৰ প্ৰসংগ (সাধাৰণ আভাস)",
    seasonalDisclaimer: "* এইটো সাধাৰণ খুচুৰা ধাৰাৰ ওপৰত আধাৰিত, কোনো নিশ্চিত ভৱিষ্যতবাণী নহয়।",
    productName: "সামগ্ৰীৰ নাম",
    startingStock: "প্ৰাৰম্ভিক ষ্টক",
    category: "শ্ৰেণী (ঐচ্ছিক)",
    saveProduct: "সামগ্ৰী সংৰক্ষণ কৰক",
    saving: "সংৰক্ষণ কৰি থকা হৈছে...",
    recordSaleTitle: "বিক্ৰী লিখক",
    availableStock: "উপলব্ধ ষ্টক",
    unitPrice: "প্ৰতি এককৰ মূল্য",
    unitsSold: "বিক্ৰী হোৱা একক",
    recording: "লিখি থকা হৈছে...",
    confirmSale: "বিক্ৰী নিশ্চিত কৰক",
    targetCoverTitle: "ষ্টক বাফাৰৰ লক্ষ্য",
    targetCoverDesc: "ৰিঅৰ্ডাৰ পৰামৰ্শ গণনাৰ বাবে নিজৰ দোকানৰ ষ্টক বাফাৰ নিৰ্ধাৰণ কৰক।",
    bufferDays: "বাফাৰ দিন (ডিফল্ট: ১৪ দিন)",
    saveSetting: "ছেটিং সংৰক্ষণ কৰক",

    negativeBalanceWarningTitle: "অতিৰিক্ত পৰিশোধৰ সতৰ্কবাৰ্তা",
    negativeBalanceWarningBody: "এই ধন পৰিশোধ বাকীতকৈ বেছি, যাৰ ফলত গ্ৰাহকৰ আগধন বা ঋণাত্মক বেলেন্স হ'ব। আপুনি আগবাঢ়িব বিচাৰেনে?",
    confirmPayment: "হয়, আগধন লিখক",
    cancelPayment: "বাতিল কৰক",
    appendOnlyNotice: "খাতা স্থায়ী। শুধৰণিৰ বাবে নতুন ওলোটা হিচাপ যোগ হয়।",

    reminderMessage: (name: string, shop: string, amount: string) =>
      `নমস্কাৰ ${name}, ${shop} ত আপোনাৰ বাকী আছে ₹${amount}। অনুগ্ৰহ কৰি সুবিধা অনুযায়ী পৰিশোধ কৰিব। ধন্যবাদ!`,

    // Landing Page & Step-by-Step Explainer
    landingTagline: "পুৰণি কাগজৰ খাতা এৰি স্মাৰ্ট ডিজিটেল খাতা ব্যৱহাৰ কৰক! সহজ আৰু নিৰ্ভৰযোগ্য।",
    landingHeroTitle: "কাগজৰ ডায়েৰী এৰি স্মাৰ্ট ডিজিটেল খাতা ব্যৱহাৰ কৰক",
    landingHeroSubtitle: "স্থানীয় গেলামাল আৰু খুচুৰা ব্যৱসায়ীসকলৰ বাবে বিশেষভাৱে নিৰ্মিত। খৰতকীয়া ধাৰৰ হিচাপ, ১-ক্লিকত বিনম্ৰ হোৱাটছএপ সোঁৱৰণি, ধাৰ স্ক'ৰ আৰু মজুত সামগ্ৰীৰ সঠিক তথ্য।",
    landingCtaStart: "দোকানৰ খাতা খোলক / লগইন কৰক",
    landingCtaDashboard: "দোকানৰ ডেছব'ৰ্ডলৈ যাওক",
    landingCtaHowItWorks: "কেনেদৰে কাম কৰে চাওক",
    landingTrust1: "আপোনাৰ দোকানৰ বাবে ১০০% ব্যক্তিগত",
    landingTrust2: "পইচাৰ সঠিক হিচাপ (কোনো ভুল নহয়)",
    landingTrust3: "কেৱল এটা পাছৱৰ্ড — কোনো ফৰ্ম বা কেৱাইচি নাই",
    landingTrust4: "ম'বাইল, টেবলেট আৰু কম্পিউটাৰত সহজ ব্যৱহাৰ",
    alreadyLoggedInBanner: (name: string) => `দোকান '${name}' ত লগইন হৈ আছে। পোনপটীয়াকৈ ডেছব'ৰ্ডলৈ যাবলৈ ইয়াত ক্লিক কৰক ➔`,

    howItWorksHeading: "ধাৰ সাৰথী কেনেদৰে কাম কৰে? (খোজ-ক্ৰমে বুজি লওক)",
    howItWorksSubheading: "যিকোনো সাধাৰণ দোকানীৰ বাবে ৩০ ছেকেণ্ডতে বুজিব পৰা সহজ ব্যৱস্থা।",

    step1Badge: "খোজ ১",
    step1Title: "মাত্ৰ এটা পাছৱৰ্ডেৰে লগে লগে লগইন",
    step1Desc: "কোনো ওটিপি নাই, কোনো দীঘলীয়া পঞ্জীয়ন নাই। দোকানৰ কাউণ্টাৰৰ ম'বাইল বা কম্পিউটাৰত গোপন পাছৱৰ্ড দিয়ক আৰু লগে লগে আপোনাৰ দোকানৰ খাতা খোল খাব।",
    step1Feature1: "বিনা কোনো পঞ্জীয়ন বা ঝামেলার",
    step1Feature2: "সুৰক্ষিত ছেছন আৰু ডাটাৰ সম্পূৰ্ণ সুৰক্ষা",
    step1Feature3: "খাতা কেৱল আপোনাৰ দোকানৰ বাবে ব্যক্তিগত",

    step2Badge: "খোজ ২",
    step2Title: "গ্ৰাহক যোগ কৰক আৰু ৫ ছেকেণ্ডতে খাতা লিখক",
    step2Desc: "গ্ৰাহকৰ নাম আৰু ১০ টা সংখ্যাৰ ম'বাইল নম্বৰ দিয়ক। 'ধাৰ দিয়া' (+ Credit) বা 'টকা জমা' (- Payment) এটা ক্লিকতে লিপিবদ্ধ কৰক। হিচাপ সদায় স্পষ্ট আৰু সুৰক্ষিত।",
    step2Feature1: "নাম বা ফোন নম্বৰেৰে লগে লগে বিচাৰক",
    step2Feature2: "ভুলবশতঃ অধিক টকা লোৱা ৰোধ কৰিবলৈ সতৰ্কবাৰ্তা",
    step2Feature3: "পূৰ্বৰ সকলো লেনদেনৰ সম্পূৰ্ণ তথ্য সুৰক্ষিত",

    step3Badge: "খোজ ৩",
    step3Title: "১-ক্লিকতে বিনম্ৰ হোৱাটছএপ সোঁৱৰণি পঠিয়াওক",
    step3Desc: "চুবুৰীয়া বা গ্ৰাহকৰ পৰা বাকী টকা বিচৰাত কোনো লাজ বা দ্বিধা নাই। এটা বুটাম টিপিলেই অসমীয়া/হিন্দী/ইংৰাজীত প্ৰস্তুত কৰা বিনম্ৰ বাৰ্তা হোৱাটছএপত খোল খাব।",
    step3Feature1: "কোনো খৰচী হোৱাটছএপ বিজনেছ মাচুল নাই",
    step3Feature2: "বাকী থকা সঠিক টকা আৰু দোকানৰ নামৰ সৈতে",
    step3Feature3: "পোনপটীয়াকৈ গ্ৰাহকৰ হোৱাটছএপত খোল খায়",

    step4Badge: "খোজ ৪",
    step4Title: "স্মাৰ্ট ধাৰ স্ক'ৰ আৰু সুৰক্ষা লিমিট",
    step4Desc: "কোনে সময়ত টকা ঘূৰাই দিয়ে আৰু কোনে পলম কৰে? ১০০% স্পষ্ট নিয়মেৰে ০-১০০ ৰ ধাৰ স্ক'ৰে গ্ৰাহকক 'ভাল', 'নজৰ ৰাখক' বা 'বিপদজনক' হিচাপে ভাগ কৰে আৰু নিৰাপদ ধাৰৰ পৰামৰ্শ দিয়ে।",
    step4Feature1: "১০০% স্পষ্ট আৰু নিৰ্দিষ্ট নিয়ম",
    step4Feature2: "পুৰণি ধাৰ প্ৰথমে পৰিশোধ কৰাৰ নিয়ম (FIFO)",
    step4Feature3: "ধাৰৰ সীমা পাৰ হ'লে সতৰ্ক কৰি দিয়া ব্যৱস্থা",

    step5Badge: "খোজ ৫",
    step5Title: "লাভ সাৰথী: দৈনিক বিক্ৰী আৰু মজুত সামগ্ৰীৰ নিৰাপত্তা",
    step5Desc: "বিক্ৰী নোহোৱা পুৰণি সামগ্ৰী চিনাক্ত কৰক আৰু প্ৰয়োজনীয় সামগ্ৰী শেষ হোৱাৰ আগতেই আনক। দৈনিক বিক্ৰীৰ গতি, মজুত থকা দিন আৰু সৰ্বাধিক লাভ দিয়া সামগ্ৰী চাওক।",
    step5Feature1: "একে সময়তে বিক্ৰী হ'লেও মজুত কেতিয়াও ঋণাত্মক নহয়",
    step5Feature2: "৩০ দিন ধৰি বিক্ৰী নোহোৱা সামগ্ৰীৰ (Dead Stock) সন্ধান",
    step5Feature3: "দোকানীৰ বাবে পুৱাৰ সহজ ভাষাত চমু বতৰা",

    comparisonTitle: "পুৰণি কাগজৰ বহী বনাম ধাৰ সাৰথী",
    comparisonSubtitle: "দোকানীসকলে কিয় ডিজিটেল খাতা পছন্দ কৰে জানক",
    paperKhata: "পুৰণি কাগজৰ খাতা",
    paperPoint1: "পৃষ্ঠা ফটা, পানী বা তেলেৰে নষ্ট হোৱাৰ ভয়",
    paperPoint2: "যোগ-বিয়োগত ভুল হৈ লোকচান বা গ্ৰাহকৰ সৈতে বাক-বিতণ্ডা",
    paperPoint3: "টকা খুজিবলৈ লাজ লগা আৰু সম্পৰ্ক নষ্ট হোৱাৰ শংকা",
    paperPoint4: "কোন গ্ৰাহকে কিমান পলম কৰিছে বুজিবলৈ অসুবিধা",
    paperPoint5: "দোকানত কি সামগ্ৰী পৰি ৰৈছে বুজি পোৱা নাযায়",

    digitalKhata: "ধাৰ সাৰথী (ডিজিটেল খাতা)",
    digitalPoint1: "সদায় সুৰক্ষিত, ম'বাইল আৰু কম্পিউটাৰত উপলব্ধ",
    digitalPoint2: "পইচাৰ সঠিক হিচাপ, কোনো ভুল নহয়",
    digitalPoint3: "১-ক্লিকতে বিনম্ৰ হোৱাটছএপ বাৰ্তা",
    digitalPoint4: "স্বয়ংক্ৰিয় ধাৰ স্ক'ৰ আৰু নিৰাপদ সীমাৰ পৰামৰ্শ",
    digitalPoint5: "লাভ সাৰথীৰ দ্বাৰা সামগ্ৰী আৰু লাভৰ সঠিক তথ্য",

    landingBottomCtaTitle: "আপোনাৰ দোকানখন ১০০% সুশৃংখল আৰু লাভজনক কৰিবলৈ সাজুনে?",
    landingBottomCtaDesc: "আৰম্ভ কৰিবলৈ ১ মিনিটতকৈও কম সময় লাগে। এতিয়াই ডিজিটেল খাতা খোলক!",
    landingBottomCtaButton: "মোৰ দোকানৰ খাতা খোলক",
  },
};
