export const parseNominal = (value: string): number =>
  Number(value.replace(/[^\d-]/g, "")) || 0;

export const parseSmartNominal = (value: string): number => {
  value = value.toLowerCase().replace(",", ".");

  if (value.includes("jt")) {
    return parseFloat(value.replace("jt", "")) * 1_000_000;
  }

  if (value.includes("k") || value.includes("rb")) {
    return parseFloat(value.replace("k", "").replace("rb", "")) * 1_000;
  }

  return parseNominal(value);
};
