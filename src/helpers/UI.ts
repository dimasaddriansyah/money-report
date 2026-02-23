import { PAYMENT_GROUPS, PAYMENT_STYLES } from "./Alias";

export const getCategoriesImg = (category: string) => {
  const categoryImages = import.meta.glob("../assets/categories/*.png", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const path = `../assets/categories/${category}.png`;

  return (
    categoryImages[path] ?? categoryImages["../assets/categories/default.png"]
  );
};

export const getPaymentClass = (payment: string) => {
  const normalized = payment.toLowerCase().trim();

  const groupKey = Object.keys(PAYMENT_GROUPS).find((key) =>
    PAYMENT_GROUPS[key].includes(normalized),
  );

  if (groupKey) {
    return PAYMENT_STYLES[groupKey];
  }

  return "bg-slate-100 text-slate-600 border-slate-300";
};

export const getTypeClass = (type: string) =>
  type === "expenses" || type === "transfer"
    ? "text-red-500"
    : "text-green-500";

export const getTypeDesc = (type: string) =>
  type === "expenses" || type === "transfer" ? "-" : "+";
