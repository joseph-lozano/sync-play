import { columns } from "~/components/payments/columns";
import DataTable from "~/components/payments/data-table";
import { Payment, createPayment } from "~/models";
import { configure } from "mobx";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { env } from "~/env";

configure({
  enforceActions: "never",
});

export default function DemoPage() {
  const [payments, setPayments] = useState<Map<string, Payment>>(new Map());

  useEffect(() => {
    console.log(env.NEXT_PUBLIC_PUSHER_CLUSTER, env.NEXT_PUBLIC_PUSHER_APP_ID);
    Pusher.logToConsole = true;
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe("updates");
    channel.bind("updated", function (data: any) {
      fetch(`/api/payments/${data.id}`)
        .then((res) => res.json())
        .then((data) => {
          setPayments((prev) => {
            const map = new Map(prev);
            map.set(data.id, createPayment(data));
            return map;
          });
        });
    });

    fetch("/api/payments")
      .then((res) => res.json())
      .then((data) => {
        const map = new Map<string, Payment>();
        data.forEach((payment: any) => {
          map.set(payment.id, createPayment(payment));
        });
        setPayments(map);
      });
    return () => {
      pusher.unsubscribe("updates");
    };
  }, []);

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={Array.from(payments.values())} />
    </div>
  );
}
