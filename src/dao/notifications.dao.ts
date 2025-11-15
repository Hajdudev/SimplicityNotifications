import { Insertable, Selectable, Updateable } from "kysely";
import { NotificationsCategory, NotificationsTable } from "../db/tables/notification.table";
import { getUserDb } from "../db/postgresDB";

const TABLE_NAME = "notifications";

export type SelectableNotifications = Selectable<NotificationsTable>;
export type InsertableNotification = Omit<
  Insertable<NotificationsTable>,
  "id" | "created" | "updated"
>;
export type UpdateableNotification = Omit<
  Updateable<NotificationsTable>,
  "id" | "created" | "updated"
>;

export type NotificationWithTotal = SelectableNotifications & {
  total: string | number | bigint
};

export async function getNotifications({
  size,
  offset,
  category
}: {
  size: number;
  offset: number;
  category?: NotificationsCategory;
}): Promise<NotificationWithTotal[]> {
  const db = getUserDb();

  let query = db.selectFrom(TABLE_NAME);

  if (category !== undefined) {
    query = query.where("category", "=", category);
  }

  return await query
    .selectAll()
    .select(db.fn.countAll().over().as("total"))
    .orderBy("created", "desc") // Most recent first
    .limit(size)
    .offset(offset)
    .execute();
}

export async function getNotificationById(id: number): Promise<SelectableNotifications | undefined> {
  const db = getUserDb();

  return await db
    .selectFrom(TABLE_NAME)
    .selectAll()
    .where("id", "=", id)
    .executeTakeFirst();
}

export async function createNotification(
  notification: InsertableNotification
): Promise<SelectableNotifications> {
  const db = getUserDb();

  return await db
    .insertInto(TABLE_NAME)
    .values(notification)
    .returningAll()
    .executeTakeFirstOrThrow();
}

export async function updateNotification(
  id: number,
  notification: UpdateableNotification
): Promise<SelectableNotifications | undefined> {
  const db = getUserDb();

  return await db
    .updateTable(TABLE_NAME)
    .set(notification)
    .where("id", "=", id)
    .returningAll()
    .executeTakeFirst();
}

export async function deleteNotification(id: number): Promise<boolean> {
  const db = getUserDb();

  const result = await db
    .deleteFrom(TABLE_NAME)
    .where("id", "=", id)
    .executeTakeFirst();

  return result.numDeletedRows > 0n;
}
