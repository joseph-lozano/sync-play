import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/prisma";
import Pusher from "pusher";
import { env } from "~/env";

const pusher = new Pusher({
  appId: env.NEXT_PUBLIC_PUSHER_APP_ID,
  key: env.NEXT_PUBLIC_PUSHER_KEY,
  secret: env.PUSHER_SECRET,
  cluster: env.NEXT_PUBLIC_PUSHER_CLUSTER,
});

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
  if (req.method === "PATCH") {
    const body = req.body;
    const payment = await db.payment.findFirstOrThrow({
      where: { id: body.id },
      include: { sender: true },
    });
    if (payment.sender.email.endsWith("@yahoo.com")) {
      return res.json({ success: false });
    }
    const updated = await db.payment.update({
      where: { id: body.id },
      data: { status: body.value },
    });
    await pusher.trigger("updates", "updated", {
      id: updated.id,
    });
    return res.json({ success: true });
  }
}
