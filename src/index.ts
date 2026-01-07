import { ActivityType, Client, IntentsBitField } from "discord.js";
import { logData } from "./libs/log";
import "./command";
import { staticCommandsRegistry } from "./commands/handlers";

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ],
});

client.on("clientReady", (c) => {
    logData("user", c.user);

    client.user?.setActivity({
        name: "drinking coffee",
        type: ActivityType.Custom,
    });

    console.log(`Logged in as ${c.user.tag}`);
});

client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    if (message.content === "ping") {
        message.reply("pong");
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
