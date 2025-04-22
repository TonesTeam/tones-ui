import {
    ReagentStep,
    StepDTO,
    TemperatureStep,
    WashStep,
} from 'sharedlib/dto/step.dto';
import { DEFAULT_TEMEPRATURE, LIQUID_INJECT_TIME } from './Constructor';
import { StepType } from 'sharedlib/enum/DBEnums';

export function updateTemperature(blocks: StepDTO[]) {
    let tempBlocks = [...blocks];
    let currentTemp = DEFAULT_TEMEPRATURE;

    for (let i = 0; i < tempBlocks.length; i++) {
        if (tempBlocks[i].type == StepType.TEMP_CHANGE) {
            const fromTemp = (tempBlocks[i].params as TemperatureStep).source;
            const target = (tempBlocks[i].params as TemperatureStep).target;

            let editedBlock = { ...tempBlocks[i] } as StepDTO;
            (editedBlock.params as TemperatureStep).source = currentTemp;
            (editedBlock.params as TemperatureStep).target = target;

            //filter redundant blocks later
            if (
                (editedBlock.params as TemperatureStep).source ==
                (editedBlock.params as TemperatureStep).target
            ) {
                editedBlock.id = -1;
            }

            tempBlocks[i] = editedBlock;

            currentTemp = (tempBlocks[i].params as TemperatureStep)
                .target as number;
        } else {
            (tempBlocks[i].params as WashStep | ReagentStep).temperature =
                currentTemp;
        }
    }
    const refactoredBlocks = tempBlocks.filter((block) => {
        return block.id != -1;
    });

    return refactoredBlocks;
}

function refactorTemperature(blocks: StepDTO[]) {
    let refactBlocks = [...blocks];
    let current = DEFAULT_TEMEPRATURE;

    for (let i = 0; i < refactBlocks.length; i++) {
        if (refactBlocks[i].type == StepType.TEMP_CHANGE) {
            let temp_params = refactBlocks[i].params as TemperatureStep;
            const fromTemp = temp_params.source;
            const target = temp_params.target;
            let editedBlock = { ...refactBlocks[i] } as StepDTO;
            (editedBlock.params as TemperatureStep).source = current;
            (editedBlock.params as TemperatureStep).target = target;

            //filter redundant blocks later
            if (
                (editedBlock.params as TemperatureStep).source ==
                (editedBlock.params as TemperatureStep).target
            ) {
                editedBlock.id = -1;
            }
            refactBlocks[i] = editedBlock;

            current = target as number;
        }
    }
}

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
        } else if (blocks[i].type == StepType.TEMP_CHANGE) {
            duration +=
                Math.abs(
                    (blocks[i].params as TemperatureStep).source -
                        (blocks[i].params as TemperatureStep).target,
                ) * 2;
        }
    }

    return duration;
}
