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
  if (payment.sender.email.endsWith("@yahoo.com")) {
    return res.json({ success: false });
  }
  await db.payment.update({
    where: { id: body.id },
    data: { status: body.value, version: {increment: 1} },
  });
  return res.json({ success: true });
}
