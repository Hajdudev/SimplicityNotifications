import { NotificationsTable } from "./tables/notification.table";
import { UsersTable } from "./tables/users.table";

export interface DatabaseSchema {
  notifications: NotificationsTable
  users: UsersTable
}
