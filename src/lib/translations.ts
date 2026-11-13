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
  },
};
