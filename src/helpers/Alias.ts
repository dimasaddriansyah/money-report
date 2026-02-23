export const categoryAlias: Record<string, string> = {
  fnb: "Foods and Beverages",
  parking: "Parking",
};

export const paymentAlias: Record<string, string> = {
  blu: "Blu by BCA",
  emoney: "e-Money Mandiri",
  tapcash: "TapCash BNI",
  gopay: "Gopay"
};

export const PAYMENT_GROUPS: Record<string, string[]> = {
  bca: ["blu by bca", "bca"],
  jago: [
    "jago",
    "foods and beverages",
    "gasoline",
    "laundry and gallon",
    "top up",
    "transportation",
    "saving",
    "investment"
  ],
  gopay: ["gopay"],
  emoney: ["e-money mandiri"],
  loan: ["loan"],
};

export const PAYMENT_STYLES: Record<string, string> = {
  bca: "bg-[#00529C1A] border-[#00529C33] text-[#00529C]",
  jago: "bg-[#FCA3111A] border-[#FCA31133] text-[#FCA311]",
  gopay: "bg-[#00AEEF1A] border-[#00AEEF33] text-[#00AEEF]",
  emoney: "bg-[#00A1911A] border-[#00A19133] text-[#00A191]",
  loan: "bg-[#0025A31A] border-[#0025A333] text-[#0025A3]",
};
