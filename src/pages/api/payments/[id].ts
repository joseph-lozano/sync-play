import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/prisma";

export default async function PaymentsApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const id = (req.query.id || "") as string;

    const payment = await db.payment.findFirstOrThrow({
      where: { id },
      include: { sender: true, receiver: true },
    });
    return res.json(payment);
  }
}
