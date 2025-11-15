import z from "zod";
import { NotificationsCategory } from "../../db/tables/notification.table";

export const notificationsResponseSchema = z.object({
  id: z.number().openapi({ example: 42 }),
  title: z.string().openapi({ example: "Emergency Alert: Road Closure" }),
  conntent: z.string().openapi({
    example: "Main Street will be closed from 8 AM to 6 PM due to maintenance work."
  }),
  category: z.enum(NotificationsCategory).openapi({ example: "EMERGENCIES" }),
  created: z.number().openapi({ example: 1753749030986 }),
  updated: z.number().openapi({ example: 1753749055123 }),
});
