import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "~/lib/prisma";

export const appRouter = router({
  payments: procedure
    .input(z.object({ count: z.number() }))
    .query(({ input: { count } }) =>
      db.payment.findMany({
        include: { sender: true, receiver: true },
        take: count,
      })
    ),
});

// export type definition of API
export type AppRouter = typeof appRouter;
