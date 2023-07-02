import { Payment as PrismaPayment, User as PrismaUser } from "@prisma/client";
import { makeAutoObservable } from "mobx";

type PrismaPaymentWithUsers = PrismaPayment & {
  sender: PrismaUser;
  receiver: PrismaUser;
};

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

/* 
You can't intercept the property accessor at runtime with
decorators, so we have to use a Proxy to intercept the
setter in order to auto-magically send the post request
to the API whenever the object is modified. If the request
fails, we reset the value to the old value.
*/
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
          })
          .catch(() => reset());
      }
      return Reflect.set(target, prop, value, receiver);
    },
  });
  return proxy;
}

export { createPayment, type Payment };
