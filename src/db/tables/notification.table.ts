import { Generated } from "kysely";


export const NotificationsCategory = {
  CITY: "city",
} as const;

export type NotificationsCategory = (typeof NotificationsCategory)[keyof typeof NotificationsCategory];

export interface NotificationsTable {
  id: Generated<number>; // PK
  title: string;
  content: string;
  category: NotificationsCategory,
  created: Generated<number>;
  updated: Generated<number>;
}
