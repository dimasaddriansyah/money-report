export const categoryAlias: Record<string, string> = {
  fnb: "Foods and Beverages",
  parking: "Parking",
  grocery: "Grocery",
  "top up": "Top Up",
  token: "Electricity Token",
  quota: "Quota",
  gas: "Gasoline",
  transport: "Transportation",
  gallon: "Gallon",
  laundry: "Laundry",
  invest: "Investment",
  "self rewards": "Self Rewards",
  kost: "Kost",
  service: "Service",
  saving: "Saving",
  subscription: "Subscription",
  others: "Others",
  payroll: "Payroll",
  bonus: "Bonus",
  cashback: "Cashback",
  interest: "Interest",
  tfin: "Transfer In",
  tfout: "Transfer Out",
};

export const accountAlias: Record<string, string> = {
  blu: "Blu by BCA",
  emoney: "e-Money Mandiri",
  tapcash: "TapCash BNI",
  gopay: "Gopay",
  jago: "Jago",
  seabank: "Seabank"
};

export const ACCOUNT_GROUPS: Record<string, string[]> = {
  bca: ["bca"],
  "blu by bca": ["blu by bca"],
  jago: [
    "jago",
    "foods and beverages",
    "gasoline",
    "laundry and gallon",
    "top up",
    "transportation",
    "saving",
    "investment",
  ],
  gopay: ["gopay"],
  emoney: ["e-money mandiri"],
  bibit: ["bibit"],
};

export const ACCOUNT_STYLES: Record<string, string> = {
  bca: "bg-blue-50 border border-blue-100 text-blue-700",
  jago: "bg-yellow-50 border border-yellow-100 text-yellow-500",
  gopay: "bg-cyan-50 border border-cyan-100 text-cyan-500",
  emoney: "bg-orange-50 border border-orange-100 text-orange-500",
  "blu by bca": "bg-sky-50 border border-sky-100 text-sky-500",
  bibit: "bg-green-50 border border-green-100 text-green-500",
};

export const MONTH_ALIAS: Record<string, string> = {
  jan: "01",
  januari: "01",
  feb: "02",
  februari: "02",
  mar: "03",
  maret: "03",
  apr: "04",
  april: "04",
  mei: "05",
  jun: "06",
  juni: "06",
  jul: "07",
  juli: "07",
  agu: "08",
  agustus: "08",
  sep: "09",
  september: "09",
  okt: "10",
  oktober: "10",
  nov: "11",
  november: "11",
  des: "12",
  desember: "12",
};

export const RELATIVE_ALIAS: Record<string, number> = {
  kemarin: -1,
  besok: 1,
  "hari ini": 0,
};
