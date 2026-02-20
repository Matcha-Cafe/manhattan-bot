import type { Channel } from "discord.js";
import { sql } from "drizzle-orm";
import cron from "node-cron";
import { db } from "../db";
import { birthdaysTable } from "../db/schema";
import { extractYYYYMMDD } from "../libs/utils";

export const addDayCronJob = (channel: Channel) => {
    const daySchedule = cron.schedule("1 0 * * *", async () => {
        const today = new Date();
        const birthdays = await db
            .select({
                discordId: birthdaysTable.discordId,
                birthday: birthdaysTable.birthdayDate,
            })
            .from(birthdaysTable)
            .where(sql`${birthdaysTable.birthdayDate} IS NOT NULL`);

        const [_, t_mtns, t_day] = extractYYYYMMDD(today);

        for (const bd of birthdays) {
            const specialDay = new Date(bd.birthday);
            const [_, mtns, day] = extractYYYYMMDD(specialDay);

            if (day === t_day && mtns === t_mtns) {
                if (channel?.isSendable()) {
                    channel.send(`Happy birthday! <@!${bd.discordId}> 🍵`);
                }
            }
        }
    });

    daySchedule.start();
};
