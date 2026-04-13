export default function FooterDesktop() {
    const year = new Date().getFullYear();

  return (
    <div className="px-6 h-10 flex items-center justify-between text-xs text-slate-400 bg-white border-t border-slate-100 shrink-0">
      <span>Designed by Dimas Adddriansyah</span>
      <span>© {year} Cashflow v1.0</span>
    </div>
  );
}
