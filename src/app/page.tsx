import { columns } from "~/components/payments/columns";
import DataTable from "~/components/payments/data-table";
import { Payment, createPayment } from "~/models";
import { configure } from "mobx";
import { useEffect, useState } from "react";
import Pusher from "pusher-js";
import { env } from "~/env";
import { z } from "zod";
import PaymentProvider from "./payments-provider";
import PaymentTable from "~/components/payments/payment-table";
import { db } from "~/lib/prisma";

configure({
  enforceActions: "never",
});

export default async function DemoPage() {
  console.log("BEFORE");
  const payments = await db.payment.findMany({
    include: { sender: true, receiver: true },
    orderBy: { id: "asc" },
  });
  console.log("AFTER");

  return (
    <div className="container mx-auto py-10">
      <PaymentProvider payments={payments}>
        <PaymentTable />
      </PaymentProvider>
    </div>
  );
}
