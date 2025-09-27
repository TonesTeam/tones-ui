import { StepType } from 'common/enums';
import { LiquidDTO } from './liquid.dto';

export interface StepDTO {
    type: StepType;
    id: number;
    params: StepParams;
}

export interface StepParams {
    iters: number;
    incubation: number; // in seconds
    liquid: LiquidDTO;
}

export interface WashStep extends StepParams {}

export interface ReagentStep extends StepParams {
    autoWash: boolean;
    targetTemperature: number; //target temperature for this step
}

// Remove TemperatureStep interface as it's no longer needed
