import { sql } from "drizzle-orm";
import { 
  pgTable,
  serial,
  varchar,
  index,
  timestamp,
  unique,
  integer
} from "drizzle-orm/pg-core";

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: varchar("display_id", { length: 50 }).notNull().unique()
  },
  (table) => ({
    displayIdIndex: index("name_index").on(table.displayId)
  })
);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    senderId: varchar("sender_id", { length: 50 })
      .notNull()
      .references(() => usersTable.displayId, {
        onUpdate: "cascade",
        onDelete: "cascade"
      }),
    receiverId: varchar("receiver_id", { length: 50 })
      .notNull()
      .references(() => usersTable.displayId, {
        onUpdate: "cascade",
        onDelete: "cascade"
      }),
    content: varchar("content", { length: 280 }).notNull(),
    unsendState: integer("unsend_state").default(0),
    sentAt: timestamp("sent_at").default(sql`now()`)
  },
  (table) => ({
    sendIndex: index("send_index").on(table.senderId, table.receiverId),
    receiveIndex: index("receive_index").on(table.receiverId, table.senderId)
  })
);

export const roomsTable = pgTable(
  "rooms",
  {
    id: serial("id").primaryKey(),
    viewerId: varchar("viewer_id", { length: 50 })
      .notNull()
      .references(() => usersTable.displayId, {
        onUpdate: "cascade",
        onDelete: "cascade"
      }),
    counterId: varchar("counter_id", { length: 50 })
      .notNull()
      .references(() => usersTable.displayId, {
        onUpdate: "cascade",
        onDelete: "cascade"
      }),
    announceId: integer("announce_id").default(0),
    recentTime: timestamp("recent_time").default(sql`now()`)
  },
  (table) => ({
    viewerIndex: index("viewer_index").on(table.viewerId),
    viewerCounter: unique().on(table.viewerId, table.counterId)
  })
)