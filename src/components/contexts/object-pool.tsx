// object pool context
import React, { createContext } from "react";
import { Payment, User } from "~/models";
import { trpc } from "~/lib/trpc";

export const ObjectPoolContext = createContext<{
  payments: Payment[];
  users: User[];
}>({ payments: [], users: [] });

export function useObjectPool() {
  const context = React.useContext(ObjectPoolContext);
  if (context === undefined) {
    throw new Error("useObjectPool must be used within a ObjectPoolProvider");
  }
  return context;
}

export function ObjectPoolProvider(props: { children: React.ReactNode }) {
  if (typeof window === "undefined") {
    return (
      <ObjectPoolContext.Provider
        value={{ payments: [], users: [] }}
        {...props}
      />
    );
  }
  const { data: serverPayments } = trpc.payments.useQuery({ count: 20 });
  const serverUsers =
    serverPayments?.flatMap((payment) => [payment.sender, payment.receiver]) ??
    [];

  const paymentsSet = new Set(serverPayments);
  const usersSet = new Set(serverUsers);

  const users = Array.from(usersSet).map(
    (user) => new User({ email: user.email, id: user.id })
  );

  const payments = Array.from(paymentsSet).map((payment) => {
    const sender = users.find((user) => user.id === payment.sender.id);
    const receiver = users.find((user) => user.id === payment.receiver.id);
    if (!sender || !receiver) throw new Error("User not found");
    return new Payment({
      id: payment.id,
      status: payment.status,
      amount: payment.amount,
      sender,
      receiver,
    });
  });

  localStorage.setItem("payments", JSON.stringify(payments.map((p) => p.id)));
  localStorage.setItem("users", JSON.stringify(users.map((u) => u.id)));

  payments.forEach((payment) => {
    localStorage.setItem(
      payment.id,
      JSON.stringify({
        ...payment,
        // @ts-expect-error
        senderId: payment.senderId,
        // @ts-expect-error
        receiverId: payment.receiverId,
      })
    );
  });

  users.forEach((user) => {
    localStorage.setItem(user.id, JSON.stringify(user));
  });

  return <ObjectPoolContext.Provider value={{ payments, users }} {...props} />;
}
