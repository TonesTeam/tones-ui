import { LiquidDTO } from './liquid.dto';
import { WashStep, StepDTO } from './step.dto';

export interface ProtocolDto {
    author_id: number;
    created_at: number; // unix timestamp
    description: string;
    history_id: string;
    id: number;
    is_deleted: boolean;
    last_launched: number;
    last_updated: number;
    name: string;
    version: number;
}

export interface StepGroupDTO {
    id: number;
    name: string;
    protocol_id: number;
    sequence_number: number;
}

export interface StepGroupWithStepsDTO {
    step_group: StepGroupDTO;
    steps: StepDTO[];
}

export interface ProtocolWithStepsDTO {
    metadata: ProtocolDto;
    step_groups: StepGroupWithStepsDTO[];
}
