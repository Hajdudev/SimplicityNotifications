import { Generated } from "kysely";


export const NotificationsCategory = {
  CITY: "city",
  COMMUNITY_EVENTS: "community_events",
  CRIME_AND_SAFETY: "crime_and_safety",
  CULTURE: "culture",
  DISCOUNTS_AND_BENEFITS: "discounts_and_benefits",
  EMERGENCIES: "emergencies",
  FOR_SENIORS: "for_seniors",
  HEALTH: "health",
  KIDS_FAMILY: "kids_family",
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
