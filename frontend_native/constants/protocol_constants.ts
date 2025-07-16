import { LiquidDTO } from 'sharedlib/dto/liquid.dto';
import { WashStep } from 'sharedlib/dto/step.dto';

export const DEFAULT_TEMEPRATURE = 25; //default tempretaure for the system
export const LIQUID_INJECT_TIME: number = 10; //default time to inject liduid into slot chip

export const DEFAULT_WASH_STEP = {
    iters: 1,
    incubation: 10,
    temperature: null,
    //liquid: define default liquid prefferbly without request ?
} as Partial<WashStep>;

export const TEMPERATURE_MAX = 90;
export const TEMPERATURE_MIN = 10;
export const INCUBATION_MAX = 36000;
export const INCUBATION_MIN = 0;
export const ITERATIONS_MAX = 100;
export const ITERATIONS_MIN = 0;
