import type { Command } from "../model";
import { addCommandService } from "./addService";
import { somethingCommandService } from "./birthdayService";
import { infoCommandService } from "./infoService";
import { pingCommandService } from "./pingService";
import { rollCommandService } from "./rollService";
import { templateCommandService } from "./templateService";

export const staticCommandsRegistry: Command[] = [
    pingCommandService,
    addCommandService,
    rollCommandService,
    templateCommandService,
    infoCommandService,
    somethingCommandService,
];
