import type { Command } from "../model";
import { addCommandService } from "./addService";
import { birthdayServiceThing } from "./birthdayService";
import { currencyCommandService } from "./currencyService";
import { infoCommandService } from "./infoService";
import { pingCommandService } from "./pingService";
import { qrCodeCommandService } from "./qrcodeService";
import { rollCommandService } from "./rollService";
import { predictNumber } from "./predictNumber";

export const staticCommandsRegistry: Command[] = [
    pingCommandService,
    addCommandService,
    rollCommandService,
    predictNumber,
    infoCommandService,
    birthdayServiceThing,
    qrCodeCommandService,
    currencyCommandService,
];
