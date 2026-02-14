import { StepType } from 'common/enums';
import { LiquidDTO } from './liquid.dto';

export interface StepBatchDTO {
    id: number;
    sequenceNumber: number;
    name?: string;
    steps: StepDTO[];
}

export interface StepDTO {
    id: number;
    type: StepType;
    sequenceNumber: number;
    params: StepParams;
}

export type StepParams = TemperatureParams | WashStep | ReagentStep;

export interface TemperatureParams {
    targetTemperature: number;
    duration: number; //(секунды)
}

export interface WashStep {
    liquid: LiquidDTO;
    incubation: number;
    iters: number;
    targetTemperature: number;
}

export interface ReagentStep {
    liquid: LiquidDTO;
    incubation: number;
    targetTemperature: number;
}
