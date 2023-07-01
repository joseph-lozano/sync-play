import { z } from "zod";
import { procedure, router } from "../trpc";
import { faker } from "@faker-js/faker";
import { Payment, statuses } from "~/payments";

export const appRouter = router({
  payments: procedure
    .input(z.object({ count: z.number() }))
    .query(({ input: { count } }) => {
      const payments: Payment[] = Array.from({ length: count }).map((_, i) => ({
        id: faker.string.nanoid(),
        amount: (Math.random() * 100).toFixed(2).toString(),
        status: statuses[Math.floor(Math.random() * statuses.length)],
        email: faker.internet.email(),
      }));
      return payments;
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
