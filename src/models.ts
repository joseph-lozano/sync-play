import { Payment as PrismaPayment, User as PrismaUser } from "@prisma/client";
import { makeAutoObservable } from "mobx";

type PrismaPaymentWithUsers = PrismaPayment & {
  sender: PrismaUser;
  receiver: PrismaUser;
};

export function createPayments(data: PrismaPaymentWithUsers[]) {
  return data.map((p) => createPayment(p));
}

const propertyMap = new Map<string, Array<string>>();
function property(target: any, key: string) {
  if (!propertyMap.has(target.constructor.name))
    propertyMap.set(target.constructor.name, []);
  propertyMap.get(target.constructor.name)?.push(key);
}

class Payment {
  @property
  id: string;
  @property
  status: PrismaPayment["status"];
  @property
  amount: PrismaPayment["amount"];

  sender: PrismaUser;
  receiver: PrismaUser;

  constructor(data: PrismaPaymentWithUsers) {
    this.id = data.id;
    this.status = data.status;
    this.amount = data.amount;
    this.sender = data.sender;
    this.receiver = data.receiver;
    makeAutoObservable(this);
  }
}

function createPayment(data: PrismaPaymentWithUsers) {
  const target = new Payment(data);
  const proxy = new Proxy(target, {
    set(target, prop, value, receiver) {
      if (propertyMap.get(target.constructor.name)?.includes(prop as string)) {
        const oldValue = Reflect.get(target, prop);
        const entity = target.constructor.name;
        const id = target.id;
        const reset = () => Reflect.set(target, prop, oldValue, receiver);
        fetch(`/api/payments/${id}`, {
          method: "PATCH",
          body: JSON.stringify({ entity, id, oldValue, value }),
          headers: { "Content-Type": "application/json" },
        })
          .then((res) => res.json())
          .then(({ success }) => {
            if (!success) reset();
          });
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
  return proxy;
}

export { createPayment, type Payment };
