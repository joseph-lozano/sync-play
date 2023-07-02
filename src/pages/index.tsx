import { columns } from "~/components/payments/columns";
import DataTable from "~/components/payments/data-table";
import { Payment, createPayments } from "~/models";
import { configure } from "mobx";
import { useEffect, useState } from "react";

configure({
  enforceActions: "never",
});

export default function DemoPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        setPayments(createPayments(data));
      });
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={payments} />
    </div>
  );
}
