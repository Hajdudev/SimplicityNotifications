import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import z from "zod";
import { listQuerySchema } from "./common.request.schema";
import { NotificationsCategory } from "../../db/tables/notification.table";


extendZodWithOpenApi(z);
export const notificationsGetRequestSchema = listQuerySchema.extend({
  category: z
    .enum(NotificationsCategory)
    .optional()
    .openapi({ example: Object.values(NotificationsCategory)[0] }),
  title_contains: z.string().optional().openapi({ example: "Meeting tomorrow" }),
  content_contains: z.string().optional().openapi({ example: "Important client updates" })
});
export type NotificationsGetType = z.infer<typeof notificationsGetRequestSchema>;


extendZodWithOpenApi(z);

export const notificationPostRequestSchema = z.object({
  title: z
    .string()
    .min(1, "title is required")
    .openapi({ example: "New city announcement" }),
  content: z
    .string()
    .min(1, "content is required")
    .openapi({ example: "There will be planned maintenance on ..." }),
  category: z
    .enum(NotificationsCategory)
    .openapi({ example: Object.values(NotificationsCategory)[0] }),
});
export type NotificationPostType = z.infer<typeof notificationPostRequestSchema>;

export const notificationPutRequestSchema = z.object({
  title: z
    .string()
    .min(1)
    .optional()
    .openapi({ example: "Updated announcement title" }),
  content: z
    .string()
    .min(1)
    .optional()
    .openapi({ example: "Updated content for the notification" }),
  category: z
    .enum(NotificationsCategory)
    .optional()
    .openapi({ example: Object.values(NotificationsCategory)[0] }),
});
export type NotificationPutType = z.infer<typeof notificationPutRequestSchema>;
