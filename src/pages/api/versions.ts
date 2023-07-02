import { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/lib/prisma";

export default async function VersionApi(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const versions = await db.payment.findMany({
      select: { id: true, version: true },
    });
    return res.json(versions);
  }
}
