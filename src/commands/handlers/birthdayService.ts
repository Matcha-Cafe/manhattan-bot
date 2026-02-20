import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import {
    ApplicationCommandOptionType,
    ContainerBuilder,
    MessageFlags,
} from "discord.js";
import { sql } from "drizzle-orm";
import { pipe } from "remeda";
import { db } from "../../db";
import { birthdaysTable } from "../../db/schema";
import { Command, type CommandHandler } from "../model";

export const birthdaySchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "birthday",
    description: "Manage birthdays",
    options: [
        {
            type: ApplicationCommandOptionType.Subcommand,
            name: "set",
            description: "Set your birthday",
            options: [
                {
                    type: ApplicationCommandOptionType.String,
                    name: "date",
                    description: "Your birthday (YYYY-MM-DD)",
                    required: true,
                },
            ],
        },
        {
            type: 1,
            name: "view",
            description: "View friends' birthdays",
        },
    ],
};

export function formatBirthday(birthdayInt: number): string {
    // Ensure 8 digits
    const str = birthdayInt.toString().padStart(8, "0");

    const year = parseInt(str.slice(0, 4), 10);
    const month = parseInt(str.slice(4, 6), 10); // 1-12
    const day = parseInt(str.slice(6, 8), 10);

    const dateObj = new Date(year, month - 1, day);

    const timestamp = Math.floor(dateObj.getTime() / 1000);

    return `<t:${timestamp}:d>`; // short date format
}

// YYYY-MM-DD

type ValidateOutput =
    | {
          error?: never;
          date: Date;
      }
    | {
          error: string;
          date?: never;
      };

const validateInputDate = (dateStr: string): ValidateOutput => {
    try {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            return { error: "Invalid date format. Use YYYY-MM-DD" };
        }
        const date = new Date(dateStr);
        return { date };
    } catch {
        return { error: "Invalid date format. Use YYYY-MM-DD" };
    }
};

const formatDate = (date: Date) => {
    const outputFormat = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeZone: "Australia/Sydney",
    }).format(date);

    return outputFormat;
};

const birthdayHandle: CommandHandler = async (interaction) => {
    const subcommand = interaction.options.getSubcommand();

    if (subcommand === "set") {
        const dateStr = interaction.options.getString("date", true);

        const { error, date } = validateInputDate(dateStr);

        if (error || !date) {
            return interaction.reply({
                content: error,
                flags: MessageFlags.Ephemeral,
            });
        }

        await db
            .insert(birthdaysTable)
            .values({
                discordId: interaction.user.id,
                birthdayDate: date.toDateString(),
            })
            .onConflictDoUpdate({
                target: birthdaysTable.discordId,
                set: { birthdayDate: date.toDateString() },
            });

        const outputFormat = new Intl.DateTimeFormat("en-GB", {
            dateStyle: "long",
            timeZone: "Australia/Sydney",
        }).format(date);

        return interaction.reply({
            content: `Your birthday has been saved as **${outputFormat}**!`,
        });
    }

    if (subcommand === "view") {
        // Fetch all birthdays
        const birthdays = await db
            .select({
                discordId: birthdaysTable.discordId,
                birthday: birthdaysTable.birthdayDate,
            })
            .from(birthdaysTable)
            .where(sql`${birthdaysTable.birthdayDate} IS NOT NULL`);

        if (birthdays.length === 0) {
            return interaction.reply({
                content: "No birthdays saved yet 🎂",
            });
        }

        const birthdayText = birthdays
            .map((b) =>
                pipe(
                    new Date(b.birthday),
                    formatDate,
                    (f) => ` <@${b.discordId}> - ${f}`,
                ),
            )
            .join("\n");

        const exampleContainer = new ContainerBuilder()
            .setAccentColor(0x74a12e)
            .addTextDisplayComponents((text) =>
                text.setContent(`## 🍰  **Birthday Manager**\n${birthdayText}`),
            );

        await interaction.reply({
            components: [exampleContainer],
            flags: MessageFlags.IsComponentsV2,
            allowedMentions: { parse: [] },
        });
    }
};

export const birthdayServiceThing = new Command(
    "birthdays",
    birthdaySchema,
    birthdayHandle,
);
