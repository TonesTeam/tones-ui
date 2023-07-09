import { StepType } from "./stepType";

export interface StepDTO{
    type: StepType;
    id: number;
    params: WashStep | ReagentStep | TemperatureStep
}

export type WashStep = {
    //id: number;
    iters: number;
    incubation: number;
    liquidID: number;
    temperature: number; //at which step is applied, calculated
}

export type ReagentStep = {
    //id: number;
    incubation: number;
    liquidID: number;
    autoWash: boolean;
    temperature: number; //at which step is applied, calculated
}

export type TemperatureStep = {
    //id: number;
    source: number;
    target: number;
}




