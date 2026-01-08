import { defineConfig } from "drizzle-kit";
import { secret } from "./src/libs/env";

export default defineConfig({
    out: "./drizzle",
    schema: "./src/db/schema.ts",
    dialect: "postgresql",
    dbCredentials: {
        url: secret.DATABASE_URL,
    },
});
