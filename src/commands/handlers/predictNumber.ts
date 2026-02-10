import {
    ApplicationCommandOptionType,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { Command, type CommandHandler } from "../model";

// slash UI template
const templateSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "template",
    description: "i will predict your number",
    options: [
        {
            name: "your_number",
            type: ApplicationCommandOptionType.Integer,
            description: "your number",
        },
    ],
};

// command logic
const templateHandle: CommandHandler = (interaction) => {
    const number = interaction.options.getInteger("your_number") || 100;
    interaction.reply(`your number is ${number}`);
};

export const predictNumber = new Command(
    "predict",
    templateSchema,
    templateHandle,
);
