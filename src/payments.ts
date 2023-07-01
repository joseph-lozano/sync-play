import { z } from "zod";
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const statuses = ["pending", "processing", "success", "failed"] as const;
export const paymentSchema = z.object({
  id: z.string(),
  amount: z.string(),
  status: z.enum(statuses),
  email: z.string().email(),
});

type PaymentStatus = z.infer<typeof paymentSchema>["status"];

export type Payment = z.infer<typeof paymentSchema>;
