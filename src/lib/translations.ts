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
  
  // Dashboard Metrics
  totalOutstanding: string;
  customersWithDues: string;
  topDebtors: string;
  quickActions: string;
  recentActivity: string;
  demoDataBadge: string;
  
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

    dashboard: "Dashboard",
    customers: "Customers",
    addCustomer: "Add Customer",
    editCustomer: "Edit Customer",
    allCustomers: "All Customers",
    searchPlaceholder: "Search by name or 10-digit phone...",
    noCustomersFound: "No customer matching search query",
    noCustomersYet: "No customers in your khata yet",
    addFirstCustomer: "Add your first customer to start tracking udhaar",

    customerName: "Customer Name",
    customerPhone: "10-digit Phone Number",
    balanceOwed: "Due Balance",
    advancePaid: "Advance Balance",
    settled: "All Clear (₹0)",
    totalBalance: "Net Due",
    remindWhatsApp: "Remind on WhatsApp",
    viewLedger: "Open Khata",
    save: "Save",
    cancel: "Cancel",

    totalOutstanding: "Total Udhaar (Outstanding)",
    customersWithDues: "Customers with Dues",
    topDebtors: "Top Customers by Balance Owed",
    quickActions: "Quick Actions",
    recentActivity: "Recent Entries",
    demoDataBadge: "Demo Data Loaded",

    ledgerTitle: "Customer Khata",
    giveCredit: "Udhaar Diya (Credit Given)",
    receivePayment: "Jama Kiya (Payment Received)",
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

    dashboard: "डैशबोर्ड",
    customers: "ग्राहक सूची",
    addCustomer: "नया ग्राहक जोड़ें",
    editCustomer: "ग्राहक विवरण बदलें",
    allCustomers: "सभी ग्राहक",
    searchPlaceholder: "नाम या 10 अंकों का फोन नंबर खोजें...",
    noCustomersFound: "कोई ग्राहक नहीं मिला",
    noCustomersYet: "खाते में अभी कोई ग्राहक नहीं है",
    addFirstCustomer: "उधार शुरू करने के लिए पहला ग्राहक जोड़ें",

    customerName: "ग्राहक का नाम",
    customerPhone: "10 अंकों का मोबाइल नंबर",
    balanceOwed: "बकाया राशि (उधार)",
    advancePaid: "जमा / एडवांस",
    settled: "हिसाब चुकता (₹0)",
    totalBalance: "कुल बकाया",
    remindWhatsApp: "व्हाट्सएप पर याद दिलाएं",
    viewLedger: "खाता खोलें",
    save: "सुरक्षित करें",
    cancel: "रद्द करें",

    totalOutstanding: "कुल बकाया उधार",
    customersWithDues: "उधार वाले ग्राहक",
    topDebtors: "सबसे ज्यादा बकाया वाले टॉप ग्राहक",
    quickActions: "त्वरित कार्य",
    recentActivity: "ताज़ा लेन-देन",
    demoDataBadge: "डेमो डेटा लोड है",

    ledgerTitle: "ग्राहक खाता बही",
    giveCredit: "उधार दिया (सामान दिया)",
    receivePayment: "जमा किया (पैसे मिले)",
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

    negativeBalanceWarningTitle: "अतिरिक्त भुगतान चेतावनी",
    negativeBalanceWarningBody: "यह भुगतान वर्तमान बकाया से अधिक है, जिससे ग्राहक का बैलेंस एडवांस हो जाएगा। क्या आप जारी रखना चाहते हैं?",
    confirmPayment: "हाँ, एडवांस दर्ज करें",
    cancelPayment: "रद्द करें",
    appendOnlyNotice: "खाता स्थायी है। सुधार के लिए नई प्रविष्टि जुड़ती है।",

    reminderMessage: (name: string, shop: string, amount: string) =>
      `नमस्ते ${name} जी, ${shop} पर आपका ₹${amount} बकाया है। कृपया सुविधानुसार भुगतान कर दें। धन्यवाद!`,
  },

  as: {
    appName: "ধাৰ সাৰথী (Udhaar Saathi)",
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

    dashboard: "ডেচবৰ্ড",
    customers: "গ্ৰাহকসকল",
    addCustomer: "নতুন গ্ৰাহক যোগ কৰক",
    editCustomer: "গ্ৰাহক তথ্য শুধৰাওক",
    allCustomers: "সকলো গ্ৰাহক",
    searchPlaceholder: "নাম বা ১০-অংকৰ ফোন নম্বৰ সন্ধান কৰক...",
    noCustomersFound: "কোনো গ্ৰাহক বিচাৰি পোৱা নগল",
    noCustomersYet: "খাতাত এতিয়ালৈকে কোনো গ্ৰাহক নাই",
    addFirstCustomer: "ধাৰ আৰম্ভ কৰিবলৈ প্ৰথম গ্ৰাহক যোগ কৰক",

    customerName: "গ্ৰাহকৰ নাম",
    customerPhone: "১০ অংকৰ মোবাইল নম্বৰ",
    balanceOwed: "বাকী থকা ধন",
    advancePaid: "আগধন / জমা",
    settled: "হিচাপ সমাপ্ত (₹0)",
    totalBalance: "মুঠ বাকী",
    remindWhatsApp: "হোৱাটছএপত সোঁৱৰাই দিয়ক",
    viewLedger: "খাতা খোলক",
    save: "সংৰক্ষণ কৰক",
    cancel: "বাতিল কৰক",

    totalOutstanding: "মুঠ বাকী ধন",
    customersWithDues: "বাকী থকা গ্ৰাহকৰ সংখ্যা",
    topDebtors: "শীৰ্ষ বাকী থকা গ্ৰাহকসকল",
    quickActions: "দ্ৰুত কাৰ্য",
    recentActivity: "শেহতীয়া লেনদেন",
    demoDataBadge: "ডেমো তথ্য লোড কৰা আছে",

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

    negativeBalanceWarningTitle: "অতিৰিক্ত পৰিশোধৰ সতৰ্কবাৰ্তা",
    negativeBalanceWarningBody: "এই ধন পৰিশোধ বাকীতকৈ বেছি, যাৰ ফলত গ্ৰাহকৰ আগধন বা ঋণাত্মক বেলেন্স হ'ব। আপুনি আগবাঢ়িব বিচাৰেনে?",
    confirmPayment: "হয়, আগধন লিখক",
    cancelPayment: "বাতিল কৰক",
    appendOnlyNotice: "খাতা স্থায়ী। শুধৰণিৰ বাবে নতুন ওলোটা হিচাপ যোগ হয়।",

    reminderMessage: (name: string, shop: string, amount: string) =>
      `নমস্কাৰ ${name}, ${shop} ত আপোনাৰ বাকী আছে ₹${amount}। অনুগ্ৰহ কৰি সুবিধা অনুযায়ী পৰিশোধ কৰিব। ধন্যবাদ!`,
  },
};
