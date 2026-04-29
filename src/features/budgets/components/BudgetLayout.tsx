import Breadcrumb from "../../../shared/ui/Breadcrumb";

type Props = {
  title: string;
  showBack?: boolean;
  button?: { label: string; url: string; };
  breadcrumb: { label: string; path?: string }[];
  children: React.ReactNode;
};

export default function BudgetLayout({ breadcrumb, children }: Props) {

  return (
    <section className="flex flex-col flex-1 px-6 py-8 gap-6 overflow-y-auto">
      <Breadcrumb items={breadcrumb} />
      <section>
        {children}
      </section>
    </section>
  );
}