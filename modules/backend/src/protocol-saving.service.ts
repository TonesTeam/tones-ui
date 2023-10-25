import { Injectable } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { Prisma, Protocol, TemperatureChange } from "@prisma/client";
import { ProtocolWithStepsDTO } from "sharedlib/dto/protocol.dto";
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { ReagentStep, StepDTO, TemperatureStep, WashStep } from "sharedlib/dto/step.dto";


@Injectable()
export class ProtocolSavingService {

    prisma: PrismaService;

    constructor() {
        this.prisma = new PrismaService();
    }

    async saveProtocol(protocol: ProtocolWithStepsDTO) {
        protocol.defaultWash
        await this.prisma.protocol.upsert({
            where: { id: protocol.id ?? -1 },
            update: {},
            create: {
                name: protocol.name,
                creationDate: protocol.creationDate,
                description: protocol.description,
                deleted: false,
                defaultWashing: {
                    create: {
                        incubationTime: protocol.defaultWash.incubation,
                        iter: protocol.defaultWash.iters,
                        permanentLiquidId: protocol.defaultWash.liquid.id,
                    }
                },
                creator: {
                    connect: {
                        username: protocol.author ?? "Jefferey"
                    }
                },
                washingLiquid: {
                    connect: {
                        id: protocol.defaultWash.liquid.id
                    }
                },
                steps: {
                    create: protocol.steps.map(s => {
                        let i = 0;
                        return this.createStep(s, ++i)
                    })
                }
            },
        })
    }

    private createStep(s: StepDTO, order: number): Prisma.StepCreateWithoutProtocolInput {
        const step: Prisma.StepCreateWithoutProtocolInput = {
            sequenceOrder: order,
            stepType: s.type,
        };
        if (s.type == StepType.LIQUID_APPL) {
            let params = s.params as ReagentStep;
            step.liquidApplication = {
                create: {
                    liquidIncubationTime: params.incubation,
                    incubationTemperature: params.temperature,
                    autoWash: params.autoWash,
                    liquidInfo: this.getLiquidInfo(params.liquid),
                }
            };
        }
        if (s.type == StepType.TEMP_CHANGE) {
            let params = s.params as TemperatureStep;
            step.temperatureChange = {
                create: {
                    sourceTemperature: params.source,
                    targetTemperature: params.target
                }
            }
        }
        if (s.type == StepType.WASHING) {
            let params = s.params as WashStep;
            step.washing = {
                create: {
                    incubationTime: params.incubation,
                    iter: params.iters,
                    permanentLiquid: {
                        connect: {
                            id: params.liquid.id
                        }
                    }
                }
            }
        }
        return step;
    }

    private getLiquidInfo(l: LiquidDTO): Prisma.LiquidInfoCreateNestedOneWithoutLiquidApplicationInput {
        if (l.id > 0) {
            return {
                connect: {
                    id: l.id
                }
            }
        }
        return {
            create: {
                name: l.name,
                type: {
                    connect: {
                        id: l.type.id
                    }
                },
            }
        }
    }
}