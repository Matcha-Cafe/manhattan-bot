import "dotenv/config";

import { createSelectSchema } from "drizzle-zod";
import { db } from "../db";
import { currencyTable } from "../db/schema";

const currencies = {
    data: {
        IDR: {
            symbol: "Rp",
            name: "Indonesian Rupiah",
            symbolNative: "Rp",
            decimalDigits: 0,
            rounding: 0,
            code: "IDR",
            namePlural: "Indonesian rupiahs",
            type: "fiat",
            countries: ["ID"],
        },
        MYR: {
            symbol: "RM",
            name: "Malaysian Ringgit",
            symbolNative: "RM",
            decimalDigits: 2,
            rounding: 0,
            code: "MYR",
            namePlural: "Malaysian ringgits",
            type: "fiat",
            countries: ["MY"],
        },
        NZD: {
            symbol: "NZ$",
            name: "New Zealand Dollar",
            symbolNative: "$",
            decimalDigits: 2,
            rounding: 0,
            code: "NZD",
            namePlural: "New Zealand dollars",
            type: "fiat",
            countries: ["CK", "NU", "NZ", "PN", "TK"],
        },
        PHP: {
            symbol: "₱",
            name: "Philippine Peso",
            symbolNative: "₱",
            decimalDigits: 2,
            rounding: 0,
            code: "PHP",
            namePlural: "Philippine pesos",
            type: "fiat",
            countries: ["PH"],
        },
        USD: {
            symbol: "$",
            name: "US Dollar",
            symbolNative: "$",
            decimalDigits: 2,
            rounding: 0,
            code: "USD",
            namePlural: "US dollars",
            type: "fiat",
            countries: [
                "AC",
                "AS",
                "BQ",
                "DG",
                "EC",
                "FM",
                "GU",
                "HT",
                "IO",
                "MH",
                "MP",
                "PA",
                "PR",
                "PW",
                "SV",
                "TC",
                "TL",
                "UM",
                "US",
                "VG",
                "VI",
                "ZW",
            ],
        },
        VND: {
            symbol: "₫",
            name: "Vietnamese Dong",
            symbolNative: "₫",
            decimalDigits: 0,
            rounding: 0,
            code: "VND",
            namePlural: "Vietnamese dong",
            type: "fiat",
            countries: ["VN"],
        },
    },
};

const currencySchema = createSelectSchema(currencyTable).omit({
    last_updated_at: true,
    value: true,
});

const populate = () => {
    Object.entries(currencies.data).forEach(async ([_, value]) => {
        const v = currencySchema.parse(value);

        const result = await db.insert(currencyTable).values(v).returning();
        console.log(result);
    });
};

populate();
