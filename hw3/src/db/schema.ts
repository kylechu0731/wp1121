import { sql } from "drizzle-orm";
import {
  index,
  serial, 
  varchar, 
  pgTable,
  timestamp,
  integer,
  unique,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    userName: varchar("user_name", { length: 50 }).notNull().unique(),
  },
  (table) => ({
    nameIndex: index("name_index").on(table.userName),
  }),
);

export const eventsTable = pgTable(
  "events",
  {
    id: serial("id").primaryKey(),
    eventName: varchar("event_name", {length: 50}).notNull(),
    hostName: varchar("host_name", { length: 50 })
      .notNull()
      .references(() => usersTable.userName, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    createdAt: timestamp("created_at").default(sql`now()`),
  },
  (table) => ({
    hostNameIndex: index("host_name_index").on(table.hostName),
    createdAtIndex: index("created_at_index").on(table.createdAt),
  }),
);

export const joinsTable = pgTable(
  "joins",
  {
    id: serial("id").primaryKey(),
    joinerName: varchar("joiner_name", { length: 50})
      .notNull()
      .references(() => usersTable.userName, { onDelete: "cascade" }),
    eventId: integer("event_id")
      .notNull()
      .references(() => eventsTable.id, { onDelete: "cascade" }),
  },
  (table) => ({
    eventIdIndex: index("event_id_index").on(table.eventId),
    hostNameIndex: index("host_name_index").on(table.joinerName),
    uniqCombination: unique().on(table.joinerName, table.eventId),
  }),
);