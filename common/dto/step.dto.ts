import { StepType } from 'common/enums';
import { LiquidDTO } from './liquid.dto';

export interface StepDTO {
    type: StepType;
    id: number;
    iterations: number;
    incubation_time: number; // in seconds
}

export interface StepParams {}

export interface WashStep extends StepParams {}

export interface ReagentStep extends StepParams {
    autoWash: boolean;
    targetTemperature: number;
    washingIterations: number;
}

// Remove TemperatureStep interface as it's no longer needed
