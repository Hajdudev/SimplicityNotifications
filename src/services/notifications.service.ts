import { getNotifications } from "../dao/notifications.dao";
import { NotificationsCategory } from "../db/tables/notification.table";
import { excludePropertyFromObjects } from "../utils/utils";

export async function handleGetNotifications({ size = 10, page, category }: { size?: number, page?: number, category?: NotificationsCategory }) {
  const currentPage = page && page > 0 ? page : 1;
  const offset = (currentPage - 1) * size;

  const notificationsWithTotal = await getNotifications({ size, offset, category });

  const total = notificationsWithTotal.length > 0 ? Number(notificationsWithTotal[0].total) : 0;
  const userProfiles = excludePropertyFromObjects(notificationsWithTotal, "total");

  const metadata = {
    page: currentPage,
    totalPages: Math.ceil(total / size),
    pageSize: size,
    total,
  };

  return { userProfiles, metadata };
}

export async function handleGetNotification() { }

export async function handlePostNotification() { }

export async function handlePutNotification() { }

export async function handleDeleteNotification() { }
