import { describe, expect, test } from "bun:test";
import { extractYYYYMMDD, validateInputDate } from "./utils";

describe("extractYYYYMMDD", () => {
    test("2022-02-02 to be [2022, 1, 2]", () => {
        const date = new Date("2022-02-02");
        expect(extractYYYYMMDD(date)).toEqual([2022, 1, 2]);
    });
});

describe("validateInputDate", () => {
    test.each([
        { date: "2026-02-01" },
        { date: "2026-02-20" },
        { date: "2026-02-28" },
    ])("$date to be valid", (data) => {
        const { date } = validateInputDate(data.date);

        expect(date).toBeInstanceOf(Date);
    });

    test.each([
        { date: "2026-02-00" },
        { date: "2026-02-29" },
        { date: "2026-02-1" },
        { date: "2026-2-10" },
        { date: "2026-00-10" },
    ])("$date to be invalid", (data) => {
        const { error } = validateInputDate(data.date);

        expect(error).toBeDefined();
    });
});
