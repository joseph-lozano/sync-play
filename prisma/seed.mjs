import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { typeid } from "typeid-js";

const PaymentStatus = ["pending", "success", "failed"];

const db = new PrismaClient();

function randomNumber(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

let users = [];

for (let i = 0; i < 5; i++) {
  const user = {
    id: typeid("user").toString(),
    email: faker.internet.email(),
  };
  const dbUser = await db.user.create({ data: user });
  users.push(dbUser);
}

for (let i = 0; i < 20; i++) {
  const [receiver, sender] = users
    .sort(() => Math.random() - Math.random())
    .slice(0, 2);
  const payment = {
    id: typeid("payment").toString(),
    amount: randomNumber(3, 500),
    status: "pending",
    senderId: sender.id,
    receiverId: receiver.id,
  };

  await db.payment.create({
    data: {
      ...payment,
    },
  });
}
