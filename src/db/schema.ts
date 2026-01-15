import {
    doublePrecision,
    integer,
    pgTable,
    timestamp,
    varchar,
} from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    discordId: varchar().unique(),
    somethingCount: integer().notNull().default(0),
});

export const currencyTable = pgTable("currency", {
    code: varchar().primaryKey(),
    value: doublePrecision().default(1),
    symbol: varchar().notNull(),
    name: varchar().notNull(),
    symbolNative: varchar().notNull(),
    decimalDigits: integer().notNull().default(0),
    rounding: integer().notNull(),
    namePlural: varchar().notNull(),
    last_updated_at: timestamp().defaultNow(),
});
