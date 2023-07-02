import type { Payment as PrismaPayment } from "@prisma/client";
import { type } from "os";
import { match } from "ts-pattern";
import { type TypeID, typeid } from "typeid-js";

function property<T>() {
  return function (target: any, key: string) {
    // console.log({ target, key });
  };
}

function isPayment(payment?: Payment | null): payment is Payment {
  return !!payment;
}

function isUser(user?: User | null): user is User {
  return !!user;
}

function hasMany() {
  return function (target: any, key: string) {
    const getter = function (this: Model) {
      return match(key)
        .with("sentPayments", () => {
          const paymentIds: string[] = JSON.parse(
            localStorage.getItem("payments") || "[]"
          );
          return paymentIds
            .map((paymentId) => {
              const paymentJson = JSON.parse(
                localStorage.getItem(paymentId) || "{}"
              );
              if (paymentJson.senderId === this.id) {
                const p = new Payment(paymentJson);
                // @ts-expect-error
                p.senderId = paymentJson.senderId;
                // @ts-expect-error
                p.receiverId = paymentJson.receiverId;
                return p;
              } else {
                return null;
              }
            })
            .filter(isPayment);
        })
        .with("recievedPayments", () => {
          const paymentIds: string[] = JSON.parse(
            localStorage.getItem("payments") || "[]"
          );
          return paymentIds
            .map((paymentId) => {
              const payment: Payment = JSON.parse(
                localStorage.getItem(paymentId) || "{}"
              );
              if (payment.receiver.id === this.id) {
                return new Payment(payment);
              } else {
                return null;
              }
            })
            .filter(isPayment);
        })
        .otherwise(() => []);
    };
    const properties: PropertyDescriptorMap = {};
    properties[key] = {
      get: getter,
      set: function () {},
      enumerable: true,
    };
    Object.defineProperties(target, properties);
  };
}

function belongsTo<Class>() {
  return function (target: any, key: string) {
    Object.defineProperty(target, key + "Id", {
      get: function (this) {
        return this[key].id;
      },
      set: function (this, value) {
        const userJson = localStorage.getItem(value);
        const user = new User(JSON.parse(userJson || "{}"));
        this[key] = user;
      },
    });
  };
}

// function model(name: string) {
//   return function model<T extends { new (...args: any[]): {} }>(
//     constructor: T
//   ) {
//     return class extends constructor {
//       id: TypeID;
//       constructor(...args: any[]) {
//         super(...args);
//         this.id = typeid(name.toLowerCase());
//       }
//     };
//   };
// }

// @model("User")

class Model {
  id: string;
  constructor() {
    if (this.constructor === Model) {
      throw new Error("Can't instantiate abstract class!");
    }
    this.id = typeid(this.constructor.name.toLowerCase()).toString();
  }
}
class User extends Model {
  @property<User>()
  email: string;

  @hasMany()
  sentPayments: Payment[];

  @hasMany()
  receivedPayments: Payment[];

  constructor({ email, id }: { email: string; id?: string }) {
    super();
    this.email = email;
    this.sentPayments = [];
    this.receivedPayments = [];
    this.id = id || super.id;
  }
}

// @model("Payment")
class Payment extends Model {
  @property()
  amount: string;
  @property()
  status: PrismaPayment["status"];

  @belongsTo<User>()
  sender: User;

  @belongsTo<User>()
  receiver: User;

  constructor({
    sender,
    receiver,
    amount,
    status = "pending",
    id,
  }: {
    sender: User;
    receiver: User;
    amount: string;
    status: PrismaPayment["status"];
    id?: string;
  }) {
    super();
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.status = status;
    this.id = id || super.id;
  }
}

export { User, Payment };
