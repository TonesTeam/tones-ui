import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { DEFAULT_TEMEPRATURE, LIQUID_INJECT_TIME } from "../constants/protocol_constants";

export function updateTemperature(blocks: StepDTO[]): [StepDTO[], number] {
  let tempBlocks = [...blocks];
  let currentTemp = DEFAULT_TEMEPRATURE; //Current temperature of protocol for given step

  // Algo:
  // Go through all existing blocks in given order
  // 1️⃣  If current is Temeprature block - change "currenTemp" to target of step
  // 2️⃣  Change step params to match protocol temeprature.
  // 3️⃣  If after change temperatures are equal - change ID to -1 (to delete later)
  // 4️⃣  If current is not Temperature block - change temeprature param to "currentTemp"
  // 5️⃣  After loop filter all steps with ID = -1, return filtered list

  for (let i = 0; i < tempBlocks.length; i++) {
    if (tempBlocks[i].type == StepType.TEMP_CHANGE) {
      const fromTemp = (tempBlocks[i].params as TemperatureStep).source;
      const target = (tempBlocks[i].params as TemperatureStep).target;

      let editedBlock = { ...tempBlocks[i] } as StepDTO;
      (editedBlock.params as TemperatureStep).source = currentTemp;
      (editedBlock.params as TemperatureStep).target = target;

      //will filter redundant blocks later
      if (
        (editedBlock.params as TemperatureStep).source ==
        (editedBlock.params as TemperatureStep).target
      ) {
        editedBlock.id = -1;
      }

      if (i != 0 && tempBlocks[i - 1].type == StepType.TEMP_CHANGE) {
        //Remove doubling temperature change
        tempBlocks[i - 1].id = -1;

        editedBlock.params = {
          source: (tempBlocks[i - 1].params as TemperatureStep).source,
          target: (tempBlocks[i].params as TemperatureStep).target,
        } as TemperatureStep;
      }

      tempBlocks[i] = editedBlock;

      currentTemp = (tempBlocks[i].params as TemperatureStep).target as number;
    } else {
      (tempBlocks[i].params as WashStep | ReagentStep).temperature = currentTemp;
    }
  }
  const refactoredBlocks = tempBlocks.filter((block) => {
    return block.id != -1;
  });

  const temperatures = refactoredBlocks.filter((block) => block.type == StepType.TEMP_CHANGE);
  const newCurrentTemp =
    temperatures.length == 0
      ? DEFAULT_TEMEPRATURE
      : (temperatures[temperatures.length - 1].params as TemperatureStep).target;

  return [refactoredBlocks, newCurrentTemp];
}

export function calcDuration(blocks: StepDTO[]) {
  let duration = 0;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].type == StepType.WASHING) {
      duration +=
        Number((blocks[i].params as WashStep).iters) *
        (Number((blocks[i].params as WashStep).incubation) + Number(LIQUID_INJECT_TIME));
    } else if (blocks[i].type == StepType.LIQUID_APPL) {
      duration += Number((blocks[i].params as ReagentStep).incubation) + LIQUID_INJECT_TIME;
      if ((blocks[i].params as ReagentStep).autoWash) {
        duration += (10 + LIQUID_INJECT_TIME) * 3; //autoWash procedure TODO: READ FROM DEFAULT WASHING CONFIG!
      }
    } else if (blocks[i].type == StepType.TEMP_CHANGE) {
      duration +=
        Math.abs(
          (blocks[i].params as TemperatureStep).source -
            (blocks[i].params as TemperatureStep).target
        ) * 2;
    }
  }

  return duration;
}
