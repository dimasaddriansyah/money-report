import DesktopShell from "./DesktopShell";
import MobileShell from "./MobileShell";

export default function AppLayout({ children }: any) {
  return (
    <>
      {/* DESKTOP */}
      <div className="hidden md:block">
        <DesktopShell>{children}</DesktopShell>
      </div>

      {/* MOBILE */}
      <div className="md:hidden">
        <MobileShell>{children}</MobileShell>
      </div>
    </>
  );
}