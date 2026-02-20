import {
    ActivityType,
    type Channel,
    Client,
    IntentsBitField,
} from "discord.js";
import { logData } from "./libs/log";
import "./command";
import { staticCommandsRegistry } from "./commands/handlers";
import { addDayCronJob } from "./cron/cron-service";

export const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

const isDevelopment = process.env.NODE_ENV === "development";

let homeChannel: Channel | null = null;

client.on("clientReady", async (c) => {
    logData("user", c.user);

    homeChannel =
        client.channels.cache.get("1458029020192178306") ||
        (await client.channels.fetch("1458029020192178306"));

    client.user?.setActivity({
        name: "brewing matcha... 🍃",
        type: ActivityType.Custom,
    });

    if (homeChannel) {
        console.log(homeChannel);
        addDayCronJob(homeChannel);
    }

    setTimeout(() => {
        if (isDevelopment) {
            client.user?.setActivity({
                name: "experimenting matcha 🍵",
                type: ActivityType.Custom,
            });
        } else {
            client.user?.setActivity({
                name: "drinking matcha 🍵",
                type: ActivityType.Custom,
            });
        }
    }, 5000);

    console.log(`Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (message.content === "ping") {
        message.reply("pong");
    }

    if (message.content === "beep") {
        if (homeChannel?.isSendable()) {
            homeChannel.send("boop");
        }
    }
});

// slash command events
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isChatInputCommand()) return;
    const { commandName } = interaction;

    for (const command of staticCommandsRegistry) {
        if (command.name === commandName) {
            command.handler(interaction);
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
console.log("Manhattan is up");
