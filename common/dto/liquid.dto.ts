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
}
