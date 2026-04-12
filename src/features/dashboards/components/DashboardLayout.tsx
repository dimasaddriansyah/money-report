export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col flex-1 px-6 py-8 gap-6 min-w-0">
      {children}
    </section>
  );
}