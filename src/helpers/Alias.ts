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
  bca: ["blu by bca", "bca"],
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
  loan: ["loan"],
};

export const ACCOUNT_STYLES: Record<string, string> = {
  bca: "bg-[#00529C1A] border-[#00529C33] text-[#00529C]",
  jago: "bg-[#FCA3111A] border-[#FCA31133] text-[#FCA311]",
  gopay: "bg-[#00AEEF1A] border-[#00AEEF33] text-[#00AEEF]",
  emoney: "bg-[#00A1911A] border-[#00A19133] text-[#00A191]",
  loan: "bg-[#0025A31A] border-[#0025A333] text-[#0025A3]",
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
