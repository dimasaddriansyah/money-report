export const getCategoriesImg = (category: string) => {
  const categoryImages = import.meta.glob("../../assets/categories/*.png", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  const categoryMap: Record<string, string> = {
    Interest: "Saving",
    Cashback: "Saving",
    Bonus: "Payroll",
  };

  const filterCategory = categoryMap[category] ?? category;

  const path = `../../assets/categories/${filterCategory}.png`;

  return (
    categoryImages[path] ?? categoryImages["../../assets/categories/default.png"]
  );
};

export const getAccountsImg = (account: string) => {
  const accountImages = import.meta.glob("../../assets/accounts/*.webp", {
    eager: true,
    import: "default",
  }) as Record<string, string>;

  if (account === "All Account") {
    return accountImages["../../assets/accounts/Default.webp"];
  }

  const accountMap: Record<string, string> = {
    Investment: "Jago",
    Subscription: "Jago",
  };

  const filterAccount = accountMap[account] ?? account;

  const path = `../../assets/accounts/${filterAccount}.webp`;

  return (
    accountImages[path] ?? accountImages["../../assets/accounts/Default.webp"]
  );
};

export const getProgressStyles = (value: number) => {
  if (value >= 90)
    return {
      bar: "bg-red-500",
      badge: "bg-red-50 text-red-500",
      text: "text-red-500",
    };

  if (value >= 60)
    return {
      bar: "bg-amber-500",
      badge: "bg-amber-50 text-amber-500",
      text: "text-amber-500",
    };

  return {
    bar: "bg-blue-500",
    badge: "bg-blue-50 text-blue-500",
    text: "text-blue-500",
  };
};

export function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}
