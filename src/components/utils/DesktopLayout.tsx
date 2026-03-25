/* eslint-disable @typescript-eslint/no-explicit-any */
export default function DesktopLayout({ children }: any) {
  return (
    <div className="hidden md:flex flex-col h-screen">{children}</div>
  );
}
