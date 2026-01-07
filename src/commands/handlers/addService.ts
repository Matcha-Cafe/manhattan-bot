import {
    ApplicationCommandOptionType,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { Command, type CommandHandler } from "../model";

const addSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "add",
    description: "big brain",
    options: [
        {
            name: "num1",
            type: ApplicationCommandOptionType.Number,
            description: "number 1",
            required: true,
        },
        {
            name: "num2",
            type: ApplicationCommandOptionType.Number,
            description: "number 2",
            required: true,
        },
    ],
};

const addHandle: CommandHandler = (interaction) => {
    const num1 = interaction.options.getNumber("num1");
    const num2 = interaction.options.getNumber("num2");

    if (!num1 || !num2) return interaction.reply("whar");
    const sum = num1 + num2;

    if (num1 === 33 && num2 === 77)
        return interaction.reply(`${num1} + ${num2} = 100`);
    if (num1 === 77 && num2 === 33)
        return interaction.reply(`${num1} + ${num2} = 100`);

    interaction.reply(`${num1} + ${num2} = ${sum}`);
};

export const addCommandService = new Command("add", addSchema, addHandle);
