import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { sql } from "drizzle-orm";
import { db } from "../../db";
import { usersTable } from "../../db/schema";
import { Command, type CommandHandler } from "../model";

const somethingSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "something",
    description: "does something",
};

const somethingHandle: CommandHandler = async (interaction) => {
    const discordId = interaction.user.id;

    const [user] = await db
        .insert(usersTable)
        .values({ discordId })
        .onConflictDoUpdate({
            target: usersTable.discordId,
            set: {
                somethingCount: sql`${usersTable.somethingCount} + 1`,
            },
        })
        .returning();

    if (user) {
        interaction.reply(`You have **${user.somethingCount} something**.`);
    }
};

export const somethingCommandService = new Command(
    "something",
    somethingSchema,
    somethingHandle,
);
