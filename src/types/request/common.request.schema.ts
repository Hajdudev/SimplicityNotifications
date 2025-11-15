import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";

extendZodWithOpenApi(z);

export const listQuerySchema = z.object({
  page: z.preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().optional()).openapi({ example: 0 }),
  size: z.preprocess((v) => (v === undefined ? undefined : Number(v)), z.number().default(10)).openapi({ example: 10 }),
});

export type ListQueryType = z.infer<typeof listQuerySchema>;

export const idParamsSchema = z.object({
  id: z
    .transform((val) => Number(val))
    .refine((val) => Number.isFinite(val) && val > 0, {
      message: "Invalid ID",
    })
    .openapi({ type: "integer", example: 1 }),
});
export type IdParamsType = z.infer<typeof idParamsSchema>;
