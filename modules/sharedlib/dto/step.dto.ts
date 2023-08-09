import { StepType } from "sharedlib/enum/DBEnums";
import { LiquidDTO } from "./liquid.dto";

export interface StepDTO {
  type: StepType;
  id: number;
  params: StepParams;
}

export interface StepParams {}

export interface WashStep extends StepParams {
  //id: number;
  iters: number;
  incubation: number;
  liquid: LiquidDTO;
  temperature: number | null; //at which step is applied, calculated
}

export interface ReagentStep extends StepParams {
  //id: number;
  incubation: number;
  liquid: LiquidDTO;
  autoWash: boolean;
  temperature: number; //at which step is applied, calculated
  custom: boolean;
}

export interface TemperatureStep extends StepParams {
  //id: number;
  source: number;
  target: number;
}
