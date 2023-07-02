import { columns } from "~/components/payments/columns";
import DataTable from "~/components/payments/data-table";
import { Payment, createPayment } from "~/models";
import { configure } from "mobx";
import { useEffect, useState } from "react";

configure({
  enforceActions: "never",
});

export default function DemoPage() {
  const [payments, setPayments] = useState<Map<string, Payment>>(new Map());

  useEffect(() => {
    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        const map = new Map<string, Payment>();
        data.forEach((payment: any) => {
          map.set(payment.id, createPayment(payment));
        });
        setPayments(map);
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      fetch("/api/versions")
        .then((res) => res.json())
        .then((data) => {
          data.forEach((versionData: { id: string; version: number }) => {
            const payment = payments.get(versionData.id);
            if (payment && payment.version < versionData.version) {
              fetch(`/api/payments/${versionData.id}`)
                .then((res) => res.json())
                .then((data) => {
                  setPayments((prev) => {
                    const map = new Map(prev);
                    map.set(data.id, createPayment(data));
                    return map;
                  });
                });
            }
          });
        });
    }, 1000);
    return () => clearInterval(interval);
  }, [payments]);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={Array.from(payments.values())} />
    </div>
  );
}
