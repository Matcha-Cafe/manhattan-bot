import {
    ApplicationCommandOptionType,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { Command, type CommandHandler } from "../model";

const rollSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "roll",
    description: "roll dice",
    options: [
        {
            name: "number",
            type: ApplicationCommandOptionType.Integer,
            description: "of 100",
        },
    ],
};

const rollHandle: CommandHandler = (interaction) => {
    const num = interaction.options.getInteger("number") || 100;

    const roll = Math.floor(Math.random() * (num + 1));
    interaction.reply(`${roll}`);
};

export const rollCommandService = new Command("roll", rollSchema, rollHandle);
