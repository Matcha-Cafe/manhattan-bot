import {
    ApplicationCommandOptionType,
    AttachmentBuilder,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import QRCode from "qrcode";
import z from "zod";
import { Command, type CommandHandler } from "../model";

const qrcodeSchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "qrcode",
    description: "generate a qrcode from a url",
    options: [
        {
            name: "url",
            type: ApplicationCommandOptionType.String,
            description: "qrcode",
        },
    ],
};

const qrcodeHandle: CommandHandler = async (interaction) => {
    const url = interaction.options.getString("url");

    if (!url) return interaction.reply("whar");
    if (!z.url().safeParse(url).success)
        return interaction.reply("invalid url wah");

    const buffer = await QRCode.toBuffer(url, {
        type: "png",
        errorCorrectionLevel: "H",
        margin: 2,
        scale: 8,
    });

    const attachment = new AttachmentBuilder(buffer, {
        name: "qrcode.png",
    });

    await interaction.reply({
        content: "here u go",
        files: [attachment],
    });
};

export const qrCodeCommandService = new Command(
    "qrcode",
    qrcodeSchema,
    qrcodeHandle,
);
