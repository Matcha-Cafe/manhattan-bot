import type {
    CacheType,
    ChatInputCommandInteraction,
    RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

export type CommandHandler = (
    Interaction: ChatInputCommandInteraction<CacheType>,
) => void;
export type CommandEntity = {
    schema: RESTPostAPIApplicationCommandsJSONBody;
    handler: CommandHandler;
};

export class Command implements CommandEntity {
    name: string;
    schema: RESTPostAPIApplicationCommandsJSONBody;
    handler: CommandHandler;
    constructor(
        name: string,
        schema: RESTPostAPIApplicationCommandsJSONBody,
        handler: CommandHandler,
    ) {
        this.name = name;
        this.schema = schema;
        this.handler = handler;

        schema.name = name;
    }
}
