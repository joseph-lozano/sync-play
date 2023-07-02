import { ColumnDef } from "@tanstack/react-table";
import { Payment, User } from "@prisma/client";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { match, P } from "ts-pattern";
import { cn } from "~/lib/utils";

export const columns: ColumnDef<Payment & { sender: User; receiver: User }>[] =
  [
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const payment = row.original;
        type ButtonVariant = React.ComponentProps<typeof Button>["variant"];
        type PaymentStatus = Payment["status"];

        const variant = match<PaymentStatus, ButtonVariant>(payment.status)
          .with("success", () => "success")
          .with("pending", () => "secondary")
          .with("failed", () => "destructive")
          .exhaustive();

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant={variant} className="h-6 w-32 capitalize">
                <span className="sr-only">Open menu</span>
                {payment.status}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy payment ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  payment.status = "success";
                  console.log(payment);
                }}
                className={cn("font-bold text-success", {
                  hidden: payment.status === "success",
                })}
              >
                Set Success
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn("font-bold", {
                  hidden: payment.status === "pending",
                })}
              >
                Set Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                className={cn("font-bold text-destructive", {
                  hidden: payment.status === "failed",
                })}
              >
                Set Failed
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "sender.email",
      header: "Sender",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="h-6 w-32 text-left">
                <span className="sr-only">Open menu</span>
                {payment.sender.email}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(payment.sender.email)
                }
              >
                Copy sender Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Other Users select</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "receiver.email",
      header: "Receiver",
      cell: ({ row }) => {
        const payment = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <p className="h-6 w-32 text-left">
                <span className="sr-only">Open menu</span>
                {payment.receiver.email}
              </p>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(payment.receiver.email)
                }
              >
                Copy receiver Email
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Other Users select</DropdownMenuItem> */}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
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
