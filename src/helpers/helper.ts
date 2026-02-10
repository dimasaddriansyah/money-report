const categoryImages = import.meta.glob("../assets/categories/*.png", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const getCategoriesImg = (category: string) => {
  const fileName = category;
  const path = `../assets/categories/${fileName}.png`;

  return (
    categoryImages[path] ?? categoryImages["../assets/categories/default.png"]
  );
};

export const getPaymentClass = (payment: string) => {
  if (
    [
      "Jago",
      "Gasoline",
      "Top Up",
      "Transportation",
      "Laundry and Gallon",
      "Investment",
      "Saving",
    ].includes(payment)
  ) {
    return "bg-[#FCA3111A] border-[#FCA31133] text-[#FCA311]";
  }

  if (["Gopay"].includes(payment)) {
    return "bg-[#00AEEF1A] border-[#00AEEF33] text-[#00AEEF]";
  }

  if (["Loan"].includes(payment)) {
    return "bg-[#0025A31A] border-[#0025A333] text-[#0025A3]";
  }

  if (["Blu by BCA"].includes(payment)) {
    return "bg-[#00A0A31A] border-[#00A0A333] text-[#00A0A3]";
  }

  if (["e-Money Mandiri"].includes(payment)) {
    return "bg-[#00A1911A] border-[#00A19133] text-[#00A191]";
  }

  return "bg-slate-100 text-slate-600 border-slate-300";
};

export const getTypeClass = (type: string) => {
  return type === "Expenses" ? "text-red-500" : "text-green-500";
};

export const getTypeDesc = (type: string) => {
  return type === "Expenses" ? "-" : "+";
};

export const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const formatRupiah = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);

export const parseNominal = (value: string): number =>
  Number(value.replace(/[^\d-]/g, "")) || 0;

export const getPeriodRange = (monthIndex: number, year: number) => {
  const start = new Date(year, monthIndex - 1, 25, 0, 0, 0);
  const end = new Date(year, monthIndex, 24, 23, 59, 59);
  return { start, end };
};
