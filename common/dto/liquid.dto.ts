export interface LiquidTypeDTO {
    id: number;
    name: string;
}

export interface LiquidDTO {
    type: LiquidTypeDTO;
    id: number;
    name: string;
}

export interface PermanentLiquidDTO extends LiquidDTO {
    position: number;
    is_connected_to_selector: boolean;
    liquid_type_id: number;
    liquid_type_name: string;
    created_at: number;
    default_incubation_time: number;
    default_incubation_temperature: number;
}
