import { StepType } from 'common/enums';
import { LiquidDTO } from './liquid.dto';

export interface StepDTO {
    type: StepType;
    id: number;
    params: StepParams;
}

export interface StepParams {}

export interface WashStep extends StepParams {
    iters: number;
    incubation: number; // in seconds
    liquid: LiquidDTO;
}

export interface ReagentStep extends StepParams {
    incubation: number;
    liquid: LiquidDTO;
    autoWash: boolean;
    targetTemperature: number; //target temperature for this step
}

// Remove TemperatureStep interface as it's no longer needed
