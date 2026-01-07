import fs from "fs";
import path from "path";

export const logData = (name: string, data: object) => {
    const logDir = path.dirname(`logs/${name}.json`);

    fs.mkdir(logDir, { recursive: true }, () => {
        const output = JSON.stringify(data, null, 2);
        const logPath = `logs/${name}.json`;
        fs.writeFileSync(logPath, output);
    });
};
