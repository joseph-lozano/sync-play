import { useObjectPool } from "~/components/contexts/object-pool";
import { columns } from "~/components/payments/columns";
import { DataTable } from "~/components/payments/data-table";
export default function DemoPage() {
  const { payments } = useObjectPool();

  if (payments.length > 0) {
    console.log({
      firstPayment: payments[2].sender.sentPayments
    })
    console.log("sender", payments[0].sender.sentPayments[0].sender.sentPayments);
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
