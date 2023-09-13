import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService, FullProtocols, ProtocolStep } from './db.service';
import { ProtocolDto, ProtocolWithStepsDTO } from 'sharedlib/dto/protocol.dto'
import { StepDTO, ReagentStep, StepParams, TemperatureStep, WashStep } from 'sharedlib/dto/step.dto'
import { PermanentLiquidDTO, LiquidDTO, LiquidTypeDTO } from 'sharedlib/dto/liquid.dto'
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
        return Promise.all(p.steps.map(async s => await this.stepToDto(s)));
    }

    async getLiquidTypes() {
        let types = await this.dbService.getLiquidTypes();
        return types.map(t => ({
            id: t.id,
            name: t.name
        } as LiquidTypeDTO))
    }

    async getPermanentLiquids() {
        let liquids = await this.dbService.getPermanentLiquids();
        return liquids.map(pl => ({
            type: {
                id: pl.liquidInfo.liquidTypeId,
                name: pl.liquidInfo.type.name,
            },
            id: pl.id,
            name: pl.liquidInfo.name,
            usedCold: pl.requiresCooling,
        } as PermanentLiquidDTO))
    }

    async getCustomProtocolLiquids(id: number) {
        let liquids = await this.dbService.getCustomProtocolLiquids(id)
        return Promise.all(liquids.map(async l => await this.toLiquidDto(l.id)));
    }

    async saveProtocol(protocol: ProtocolWithStepsDTO) {
        throw new Error('Method not implemented.');
    }


    private async stepToDto(step: ProtocolStep): Promise<StepDTO> {
        return {
            id: step.id,
            type: step.stepType as StepType,
            params: await this.getParams(step)
        }
    }

    private async getParams(step: ProtocolStep): Promise<StepParams> {
        switch (step.stepType as StepType) {
            case StepType.LIQUID_APPL:
                return {
                    incubation: step.liquidApplication.liquidIncubationTime,
                    liquid: await this.toLiquidDto(step.liquidApplication.liquidInfo.id),
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
                    liquid: await this.toLiquidDto(step.washing.permanentLiquidId)

                } as WashStep
            default:
                throw new Error(`Unknown step type ${step.stepType}`)
        }
    }

    private async toLiquidDto(liquidInfoId: number): Promise<LiquidDTO> {
        let l = await this.dbService.getLiquidInfo(liquidInfoId);
        return {
            type: {
                id: l.liquidTypeId,
                name: l.type.name,
            },
            id: l.id,
            name: l.name,
        }
    }


}

