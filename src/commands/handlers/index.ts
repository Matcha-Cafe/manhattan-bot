import type { Command } from "../model";
import { addCommandService } from "./addService";
import { somethingCommandService } from "./birthdayService";
import { currencyCommandService } from "./currencyService";
import { infoCommandService } from "./infoService";
import { pingCommandService } from "./pingService";
import { qrCodeCommandService } from "./qrcodeService";
import { rollCommandService } from "./rollService";
import { templateCommandService } from "./templateService";

export const staticCommandsRegistry: Command[] = [
    pingCommandService,
    addCommandService,
    rollCommandService,
    templateCommandService,
    infoCommandService,
    somethingCommandService,
    qrCodeCommandService,
    currencyCommandService,
];
