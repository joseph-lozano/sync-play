"use client";
import { usePayments } from "~/app/payments-provider";
import { columns } from "~/components/payments/columns";
import DataTable from "./data-table";

export default function PaymentTable() {
  const payments = usePayments();

  return <DataTable columns={columns} data={Array.from(payments.values())} />;
}
