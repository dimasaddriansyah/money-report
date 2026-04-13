import { createContext, useContext, useState } from "react";

interface BalanceContextType {
  hideBalance: boolean;
  setHideBalance: (val: boolean) => void;
}

const BalanceContext = createContext<BalanceContextType | null>(null);

export function BalanceProvider({ children }: any) {
  const [hideBalance, setHideBalance] = useState(false);

  return (
    <BalanceContext.Provider value={{ hideBalance, setHideBalance }}>
      {children}
    </BalanceContext.Provider>
  );
}

export function useBalance() {
  const context = useContext(BalanceContext);
  if (!context) throw new Error("useBalance must be used inside provider");
  return context;
}