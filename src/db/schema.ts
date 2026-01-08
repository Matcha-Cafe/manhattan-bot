import { integer, pgTable, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    discordId: varchar({ length: 255 }).notNull().unique(),
    somethingCount: integer().notNull().default(0),
});
