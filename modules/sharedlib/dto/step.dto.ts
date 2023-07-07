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
}

export type ReagentStep = {
    //id: number;
    incubation: number;
    temperature: number;
    liquidID: number;
    autoWash: boolean;
}

export type TemperatureStep = {
    //id: number;
    source: number;
    target: number;
}




