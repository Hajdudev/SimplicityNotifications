import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
  InsertableNotification,
  SelectableNotifications,
  UpdateableNotification,
} from "../dao/notifications.dao";
import { NotificationsCategory } from "../db/tables/notification.table";
import { InternalServerError, NotFoundError } from "../utils/errors";
import { excludePropertyFromObjects } from "../utils/utils";
import { broadcastNewNotification } from "./websocket.service";

export async function handleGetNotifications({
  size = 10,
  page,
  category,
}: {
  size?: number;
  page?: number;
  category?: NotificationsCategory;
}) {
  const currentPage = page && page > 0 ? page : 1;
  const offset = (currentPage - 1) * size;

  const notificationsWithTotal = await getNotifications({ size, offset, category });

  const total = notificationsWithTotal.length > 0 ? Number(notificationsWithTotal[0].total) : 0;
  const notifications = excludePropertyFromObjects(notificationsWithTotal, "total");

  const metadata = {
    page: currentPage,
    totalPages: Math.ceil(total / size),
    pageSize: size,
    total,
  };

  return { notifications, metadata };
}

export async function handleGetNotification(id: number): Promise<SelectableNotifications> {
  const notification = await getNotificationById(id);
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  return notification;
}

export async function handlePostNotification(
  data: InsertableNotification
): Promise<SelectableNotifications> {
  const created = await createNotification(data);
  if (!created) {
    throw new InternalServerError("Failed to create notification");
  }

  broadcastNewNotification(created);
  return created;
}

export async function handlePutNotification(
  id: number,
  data: UpdateableNotification
): Promise<SelectableNotifications> {
  const notification = await getNotificationById(id);
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  const updated = await updateNotification(id, data);
  if (!updated) {
    throw new InternalServerError("Failed to update notification");
  }

  return updated;
}

export async function handleDeleteNotification(id: number): Promise<void> {
  const notification = await getNotificationById(id);
  if (!notification) {
    throw new NotFoundError("Notification not found");
  }

  const deleted = await deleteNotification(id);
  if (!deleted) {
    throw new InternalServerError("Failed to delete notification");
  }

  return;
}
