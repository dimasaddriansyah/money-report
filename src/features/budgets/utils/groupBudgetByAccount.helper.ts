type BudgetGroup = {
  accountId: string;
  accountName: string;
  total: number;
  color?: string;
  items?: BudgetGroup[];
};

const JAGO_ACCOUNTS = ["gopay", "jago", "investment", "bibit"];

const ACCOUNT_COLORS: Record<string, string> = {
  "blu by bca": "bg-cyan-500",
  bca: "bg-blue-500",
  seabank: "bg-amber-500",
};

export function groupBudgetByAccount(grouped: BudgetGroup[]) {
  const result = grouped.reduce(
    (acc, item) => {
      const name = item.accountName.toLowerCase();

      if (JAGO_ACCOUNTS.includes(name)) {
        acc.jago.total += item.total;
        acc.jago.items.push(item);
      } else {
        acc.others.push({
          ...item,
          color: ACCOUNT_COLORS[name] || "bg-slate-400",
        });
      }

      return acc;
    },
    {
      jago: {
        accountId: "jago-group",
        accountName: "Jago",
        total: 0,
        color: "bg-yellow-500",
        items: [] as BudgetGroup[],
      },
      others: [] as BudgetGroup[],
    }
  );

  const merged = [
    ...(result.jago.total > 0 ? [result.jago] : []),
    ...result.others,
  ];

  return merged.sort((a, b) => b.total - a.total);
}