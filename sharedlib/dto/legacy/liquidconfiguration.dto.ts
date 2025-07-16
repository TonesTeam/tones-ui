import { LiquidDto } from './liquid.dto';

export interface DeploymentLiquidConfiguration {
    liquidSlotNumber: number;
    liquidId: number;
    liquid: LiquidDto | undefined;
    liquidAmount: number;
}
