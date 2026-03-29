import { useState } from "react";
import Sidebar from "./Sidebar";

export default function DesktopLayout({ children }: any) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="hidden md:flex h-screen">
      {/* SIDEBAR */}
      <Sidebar collapsed={collapsed} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        {children({ collapsed, setCollapsed })}
      </div>
    </div>
  );
}