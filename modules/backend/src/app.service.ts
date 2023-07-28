import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService, FullProtocols, ProtocolStep } from './db.service';
import { ProtocolDto } from 'sharedlib/dto/protocol.dto'
import { StepDTO, ReagentStep, StepParams, TemperatureStep, WashStep } from 'sharedlib/dto/step.dto'
import { PermanentLiquidDTO, LiquidDTO } from 'sharedlib/dto/liquid.dto'
import { StepType } from 'sharedlib/enum/DBEnums';


@Injectable()
export class AppService {

    private readonly logger = new Logger(AppService.name);

    constructor(
        private readonly dbService: DatabaseService,
    ) { }

    async getProtocols() {
        let protocols: FullProtocols = await this.dbService.getProtocols();
        return protocols.map(p => ({
            id: p.id,
            author: p.creator.username,
            creationDate: p.creationDate,
            description: p.description,
            name: p.name
        } as ProtocolDto))
    }

    async getProtocolSteps(id: number) {
        let p = await this.dbService.getProtocolById(id);
        return p.steps.map(s => this.stepToDto(s));
    }

    async getPermanentLiquids() {
        let liquids = await this.dbService.getPermanentLiquids();
        return liquids.map(pl => ({
            categoryId: pl.liquidInfo.liquidTypeId,
            categoryName: pl.liquidInfo.name,
            id: pl.id,
            name: pl.liquidInfo.name,
            usedCold: pl.requiresCooling,
        } as PermanentLiquidDTO))
    }

    async getCustomProtocolLiquids(id: number) {
        let liquids = await this.dbService.getCustomProtocolLiquids(id)
        return liquids.map(l => ({
            categoryId: l.liquidTypeId,
            categoryName: l.name,
            id: l.id,
            name: l.name,
        } as LiquidDTO))
    }



    private stepToDto(step: ProtocolStep): StepDTO {
        return {
            id: step.id,
            type: step.stepType as StepType,
            params: this.getParams(step)
        }
    }

    private getParams(step: ProtocolStep): StepParams {
        switch (step.stepType as StepType) {
            case StepType.LIQUID_APPL:
                return {
                    incubation: step.liquidApplication.liquidIncubationTime,
                    liquidId: step.liquidApplication.liquidInfo.id,
                    autoWash: step.liquidApplication.autoWash,
                    temperature: step.liquidApplication.incubationTemperature,
                    custom: step.liquidApplication.liquidInfo.permanentLiquid === null
                } as ReagentStep
            case StepType.TEMP_CHANGE:
                return {
                    source: step.temperatureChange.sourceTemperature,
                    target: step.temperatureChange.targetTemperature,
                } as TemperatureStep
            case StepType.WASHING:
                return {
                    incubation: step.washing.incubationTime,
                    iters: step.washing.iter,
                    liquidID: step.washing.permanentLiquidId
                } as WashStep
            default:
                throw new Error(`Unknown step type ${step.stepType}`)
        }
    }


}

