import DashboardDesktop from "../components/DashboardDesktop";
import DashboardMobile from "../components/DashboardMobile";

export default function DashboardPage() {
  return (
    <>
      <div className="hidden md:block">
        <DashboardDesktop />
      </div>

      <div className="md:hidden">
        <DashboardMobile />
      </div>
    </>
  );
}