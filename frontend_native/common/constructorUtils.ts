import {
    ReagentStep,
    StepDTO,
    WashStep,
} from 'common/dto/step.dto';
import { StepType } from 'common/enums';
import {
    LIQUID_INJECT_TIME,
} from '../constants/protocol_constants';

export interface ProtocolSettings {
    autoWashConfig: WashStep;
    timeUnits: 'sec' | 'min';
    description: String;
}

// Temperature management is now simplified - no longer needed
// as temperature is handled directly in ReagentStep.targetTemperature

export function calcDuration(blocks: StepDTO[]) {
    let duration = 0;
    for (let i = 0; i < blocks.length; i++) {
        if (blocks[i].type == StepType.WASHING) {
            duration +=
                Number((blocks[i].params as WashStep).iters) *
                (Number((blocks[i].params as WashStep).incubation) +
                    Number(LIQUID_INJECT_TIME));
        } else if (blocks[i].type == StepType.LIQUID_APPL) {
            duration +=
                Number((blocks[i].params as ReagentStep).incubation) +
                LIQUID_INJECT_TIME;
            if ((blocks[i].params as ReagentStep).autoWash) {
                duration += (10 + LIQUID_INJECT_TIME) * 3; //autoWash procedure TODO: READ FROM DEFAULT WASHING CONFIG!
            }
        }
    }

    return duration;
}
