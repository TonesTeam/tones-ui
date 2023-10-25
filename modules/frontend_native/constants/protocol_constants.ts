import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { WashStep } from "sharedlib/dto/step.dto";

export const DEFAULT_TEMEPRATURE = 25; //default tempretaure for the system
export const LIQUID_INJECT_TIME: number = 10; //default time to inject liduid into slot chip

export const DEFAULT_WASH_STEP = {
  iters: 1,
  incubation: 10,
  temperature: null,
  //liquid: define default liquid prefferbly without request ?
} as Partial<WashStep>;
