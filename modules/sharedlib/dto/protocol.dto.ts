export interface ProtocolDto {
    id: number;
    name: string;
    authorName: string;
    creationDate: Date;
    usedLiquids: {
        liquidName: string;
        liquidType: string;
        amount: number;
    }[];
}
