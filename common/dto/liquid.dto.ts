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
    usedCold: boolean;
    toxic: boolean;
}
