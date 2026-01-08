import { drizzle } from "drizzle-orm/node-postgres";
import { secret } from "../libs/env";
import * as schema from "./schema";

export const db = drizzle({ connection: secret.DATABASE_URL, schema });
