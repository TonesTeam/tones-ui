import { StepType } from 'common/enums';
import { LiquidDTO } from './liquid.dto';

export interface StepDTO {
    type: StepType;
    id: number;
    iterations: number;
    incubation_time: number; // in seconds
    target_temperature: number;
    applied_liquid_id: number;
    sequence_number: number;
    washing_iterations: number;
}

export interface StepParams {}

export interface WashStep extends StepParams {}

export interface ReagentStep extends StepParams {
    autoWash: boolean;
    washingIterations: number;
}

// Remove TemperatureStep interface as it's no longer needed
