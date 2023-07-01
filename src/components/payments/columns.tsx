import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "~/payments";
import { MoreHorizontal } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { match, P } from "ts-pattern";

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const payment = row.original;

      console.log({ payment });

      type ButtonVariant =  React.ComponentProps<typeof Button>["variant"]
      type PaymentStatus = Payment["status"]

      const variant = match<PaymentStatus,ButtonVariant>(payment.status)
        .with("success", () => "success")
        .with("pending", () => "secondary")
        .with("processing", () => "default")
        .with("failed", () => "destructive")
        .exhaustive();

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant={variant}className="h-6 w-32 capitalize">
              <span className="sr-only">Open menu</span>
              {payment.status}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];
