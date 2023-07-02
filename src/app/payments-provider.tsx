"use client";

import Pusher from "pusher-js";
import { createContext, useContext, useEffect, useState } from "react";
import { env } from "~/env";
import { Payment as PrismaPayment, User as PrismaUser } from "@prisma/client";
import { Payment, createPayment } from "~/models";

const PaymentContext = createContext<Map<string, Payment>>(new Map());

export default function PaymentProvider({
  children,
  payments,
}: {
  children: React.ReactNode;
  payments: (PrismaPayment & { sender: PrismaUser; receiver: PrismaUser })[];
}) {
  const [map, setMap] = useState<Map<string, Payment>>(new Map());

  useEffect(() => {
    const newMap = payments.reduce((map, payment) => {
      map.set(payment.id, createPayment(payment));
      return map;
    }, new Map<string, Payment>());
    setMap(newMap);

    Pusher.logToConsole = true;
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
    });
    const channel = pusher.subscribe("updates");
    channel.bind("updated", function (data: any) {
      fetch(`/api/payments/${data.id}`)
        .then((res) => res.json())
        .then((data) => {
          setMap((prev) => {
            const map = new Map(prev);
            map.set(data.id, createPayment(data));
            return map;
          });
        });
    });
    return () => {
      pusher.unsubscribe("updates");
    };
  }, [setMap, payments]);
  return (
    <PaymentContext.Provider value={map}>{children}</PaymentContext.Provider>
  );
}

export const usePayments = () => {
  return useContext(PaymentContext);
};
