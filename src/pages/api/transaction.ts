import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/prisma";

export default async function TransactionApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = req.body;
  const payment = await db.payment.findFirstOrThrow({
    where: { id: body.id },
    include: { sender: true },
  });
  console.log(body.id);
  console.log(payment.sender.email);
  if (payment.sender.email.endsWith("@yahoo.com")) {
    console.log("Yahoo is not allowed");
    return res.json({ success: false });
  }
  console.log("updating");
  const foo = await db.payment.update({
    where: { id: body.id },
    data: { status: body.value },
  });
  console.log({ foo });
  return res.json({ success: true });
}
