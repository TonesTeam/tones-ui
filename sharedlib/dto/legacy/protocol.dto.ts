export type UsedProtocolLiquid = {
    liquidName: string;
    liquidType: string;
    amount: number;
};

export interface ProtocolDto {
    id: number;
    name: string;
    authorName: string;
    creationDate: Date;
    usedLiquids: UsedProtocolLiquid[];
}
