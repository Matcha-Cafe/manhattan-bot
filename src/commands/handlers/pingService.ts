import type { RESTPostAPIApplicationCommandsJSONBody } from "discord.js";
import { Command, type CommandHandler } from "../model";

const pingSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "ping",
    description: "might pong",
};

const pingHandle: CommandHandler = (interaction) => {
    interaction.reply("pong");
};

export const pingCommandService = new Command("ping", pingSchema, pingHandle);
