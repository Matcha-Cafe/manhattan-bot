import { format, isValid, parse } from "date-fns";

export const extractYYYYMMDD = (date: Date) => {
    const www = [date.getFullYear(), date.getMonth(), date.getDate()];
    return www;
};

export type ValidateOutput =
    | {
          error?: never;
          date: Date;
      }
    | {
          error: string;
          date?: never;
      };

function isStrictISODate(input: string): boolean {
    // parse using exact format
    // prevent invalid date like 2022-02-30 that would roll overflow value forwards
    const parsed = parse(input, "yyyy-MM-dd", new Date());

    return isValid(parsed) && format(parsed, "yyyy-MM-dd") === input;
}

export const validateInputDate = (dateStr: string): ValidateOutput => {
    if (!isStrictISODate(dateStr)) {
        return { error: "Invalid date format. Use YYYY-MM-DD" };
    }
    const date = new Date(dateStr);

    if (Number.isNaN(date.getTime())) {
        return { error: "Invalid date." };
    }

    return { date };
};

export const formatDate = (date: Date) => {
    const outputFormat = new Intl.DateTimeFormat("en-GB", {
        dateStyle: "long",
        timeZone: "Australia/Sydney",
    }).format(date);

    return outputFormat;
};
