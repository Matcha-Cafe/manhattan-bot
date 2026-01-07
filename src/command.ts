import { REST, Routes } from "discord.js";
import { map } from "remeda";
import { staticCommandsRegistry } from "./commands/handlers";
import { secret } from "./libs/env";

const rest = new REST({ version: "10" }).setToken(secret.DISCORD_TOKEN);

const commandSchemas = map(staticCommandsRegistry, (command) => command.schema);

(async () => {
    await rest.put(
        Routes.applicationGuildCommands(secret.CLIENT_ID, secret.GUILD_ID),
        {
            body: commandSchemas,
        },
    );
    console.log("Successfully registered application commands.");
})();
