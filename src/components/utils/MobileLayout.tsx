/* eslint-disable @typescript-eslint/no-explicit-any */
export default function MobileLayout({ children }: any) {
  return <div className="md:hidden bg-slate-900 min-h-screen">{children}</div>;
}
