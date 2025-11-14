import { Generated } from "kysely";

export const UserStatus = {
  ACTIVE: "active",
  INACTIVE: "inactive",
} as const;

export type UserStatusType = (typeof UserStatus)[keyof typeof UserStatus];

export interface UsersTable {
  id: Generated<number>; // PK
  name: string,
  email: string,
  passwordHash: string,
  status: UserStatusType,
  created: Generated<number>;
  updated: Generated<number>;
}
