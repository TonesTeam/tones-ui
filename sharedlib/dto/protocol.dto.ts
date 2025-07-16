import { LiquidDTO } from './liquid.dto';
import { WashStep, StepDTO } from './step.dto';

export interface ProtocolDto {
    id: number;
    name: string;
    author: string | null; //UserDTO | null
    creationDate: Date;
    description: string;
}

export interface ProtocolWithStepsDTO extends ProtocolDto {
    defaultWash: WashStep;
    customLiquids: LiquidDTO[];
    steps: StepDTO[];
}
