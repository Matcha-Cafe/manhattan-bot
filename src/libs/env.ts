import { z } from "zod";

export const secret = z
    .object({
        DISCORD_TOKEN: z.string().min(1, "DISCORD_TOKEN is required"),
        CLIENT_ID: z.string().min(1, "CLIENT_ID is required"),
        GUILD_ID: z.string().min(1, "GUILD_ID is required"),
        NODE_ENV: z.enum(["development", "production"]).default("production"),
        DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
        CURRENCY_API: z.string().min(1, "CURRENCY_API is required"),
    })
    .parse(process.env);
