import { StepType } from "../enum/DBEnums";

export interface StepDTO {
    type: StepType;
    id: number;
    params: StepParams
}

export interface StepParams {}

export interface WashStep extends StepParams {
    //id: number;
    iters: number;
    incubation: number;
    liquidID: number;
    temperature: number; //at which step is applied, calculated
}

export interface ReagentStep extends StepParams {
    //id: number;
    incubation: number;
    liquidId: number;
    autoWash: boolean;
    temperature: number; //at which step is applied, calculated
}

export interface TemperatureStep extends StepParams {
    //id: number;
    source: number;
    target: number;
}




