import { formatDistance } from "date-fns";
import {
    ApplicationCommandOptionType,
    EmbedBuilder,
    type RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";
import { eq } from "drizzle-orm";
import z from "zod";
import { db } from "../../db";
import { currencyTable } from "../../db/schema";
import { secret } from "../../libs/env";
import { Command, type CommandHandler } from "../model";

const registeredCurrency = ["USD", "IDR", "NZD", "PHP", "MYR", "VND"];

const currencySchema: RESTPostAPIApplicationCommandsJSONBody = {
    name: "currency exchange",
    description: "i will perdict your number",
    options: [
        {
            name: "currency",
            type: ApplicationCommandOptionType.String,
            choices: [
                ...registeredCurrency.map((currency) => ({
                    name: currency,
                    value: currency,
                })),
            ],
            description: "your currency",
            required: true,
        },
        {
            name: "amount",
            type: ApplicationCommandOptionType.Number,
            description: "Amount of money",
            required: true,
        },
    ],
};

const ZCurrencyAPI = z.object({
    data: z.record(
        z.string(),
        z.object({ code: z.string(), value: z.number() }),
    ),
});

const rc = registeredCurrency.join("%2C");
const apiuri = `https://api.currencyapi.com/v3/latest?apikey=${secret.CURRENCY_API}&currencies=${rc}`;

const shouldUpdate = (lastDate: Date) => {
    const diffTime = Math.abs(lastDate.getTime() - new Date().getTime());
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    return diffHours > 12;
};

const currencyHandle: CommandHandler = async (interaction) => {
    const currency = interaction.options.getString("currency");
    const amount = interaction.options.getNumber("amount") || 0;

    if (!currency || amount < 0) return interaction.reply("whar is bro on");

    const result = await db.query.currencyTable.findMany();

    if (!result.length) {
        return interaction.reply("currency not found");
    }

    if (result[0]?.last_updated_at && shouldUpdate(result[0].last_updated_at)) {
        const response = await fetch(apiuri);
        const resJson = await response.json();

        console.log(resJson);

        const { data } = ZCurrencyAPI.parse(resJson);

        for (const [_, c] of Object.entries(data)) {
            const { code, value } = c;

            await db
                .update(currencyTable)
                .set({
                    code,
                    value: value,
                    last_updated_at: new Date(),
                })
                .where(eq(currencyTable.code, code));
        }
    }

    const kv = Object.fromEntries(result.map((r) => [r.code, r]));

    const targetCurrency = kv[currency];
    const resultAmount = amount / (targetCurrency?.value || 1);

    const cData = { ...kv };
    delete cData[currency];

    const updateTimestamp = new Date(
        targetCurrency?.last_updated_at || 0,
    ).getTime();
    const convertCurrency = Object.values(cData).map((c) => ({
        ...c,
        value: resultAmount * (c?.value || 1),
    }));

    const out = convertCurrency
        .map((c) => {
            const { code, symbol } = c;
            const formatValue = `${c.value.toFixed(c.decimalDigits)}`;

            let left = `${code} (${symbol})`;
            const padr = 10 - left.length;
            left += " ".repeat(padr);

            return `${left} | ${formatValue}     \n`;
        })
        .join("");

    const exampleEmbed = new EmbedBuilder()
        .setColor(0x2ead00)
        .addFields({
            name: `${amount} ${currency} converts to`,
            value: `\`\`\`${out}\`\`\``,
            inline: true,
        })
        .setFooter({
            text: `last exchange updated ${formatDistance(updateTimestamp, Date.now())} ago`,
        });

    interaction.reply({ embeds: [exampleEmbed] });
};

export const currencyCommandService = new Command(
    "currency",
    currencySchema,
    currencyHandle,
);
