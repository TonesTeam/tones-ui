import { StepDTO } from './step.dto';

export interface ProtocolDto {
    author_id: number;
    created_at: number; // unix timestamp
    description: string;
    history_id: string;
    id: number;
    is_deleted: boolean;
    last_launched: number | null;
    last_updated: number;
    name: string;
    version: number;
    author_first_name: string;
    author_last_name: string;
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
