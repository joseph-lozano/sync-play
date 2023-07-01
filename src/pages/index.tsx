import { columns } from "~/components/payments/columns";
import { DataTable } from "~/components/payments/data-table";
import { trpc } from "~/lib/trpc";
export default function DemoPage() {
  const { data } = trpc.payments.useQuery({ count: 20 });
  if (!data) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
