import { StepType } from 'sharedlib/enum/DBEnums';
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
    temperature: number | null; //at which step is applied, calculated
}

export interface ReagentStep extends StepParams {
    incubation: number;
    liquid: LiquidDTO;
    autoWash: boolean;
    temperature: number; //at which step is applied, calculated
}

export interface TemperatureStep extends StepParams {
    source: number;
    target: number;
}
