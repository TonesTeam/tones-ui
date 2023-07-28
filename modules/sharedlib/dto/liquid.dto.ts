export interface LiquidDTO {
    categoryId: number;
    categoryName: string;
    id: number;
    name: string;
}

export interface PermanentLiquidDTO extends LiquidDTO {
    usedCold: boolean;
}