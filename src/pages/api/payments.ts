import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/prisma";

export default async function PaymentsApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const payments = await db.payment.findMany({
      include: { sender: true, receiver: true },
      orderBy: { id: "asc" },
    });
    return res.json(payments);
  }
}
