import {
    EmbedBuilder,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { secret } from "../../libs/env";
import { Command, type CommandHandler } from "../model";

// slash UI info
const infoSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "info",
    description: "check manhattan info",
};

const infoHandle: CommandHandler = (interaction) => {
    const embed = new EmbedBuilder()
        .setTitle("Manhattan Bot info")
        .addFields({ name: "environment", value: secret.NODE_ENV }) // your info
        .setTimestamp();

    interaction.reply({ embeds: [embed] });
};

export const infoCommandService = new Command("info", infoSchema, infoHandle);
