import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { Prisma, Protocol } from '@prisma/client';
import { ProtocolWithStepsDTO } from 'common/dto/protocol.dto';
import { LiquidDTO } from 'common/dto/liquid.dto';
import { StepType } from 'common/enums';
import { ReagentStep, StepDTO, WashStep } from 'common/dto/step.dto';

@Injectable()
export class ProtocolSavingService {
    prisma: PrismaService;

    constructor() {
        this.prisma = new PrismaService();
    }

    async saveProtocol(protocol: ProtocolWithStepsDTO) {
        if (protocol.id && protocol.id != -1) {
            await this.updateProtocol(protocol);
        }
        await this.prisma.protocol.upsert({
            where: { id: +protocol.id },
            update: {},
            create: {
                name: protocol.name,
                creationDate: protocol.creationDate,
                lastUpdate: new Date(),
                description: protocol.description,
                deleted: false,
                defaultWashing: {
                    create: {
                        incubationTime: protocol.defaultWash.incubation,
                        iter: protocol.defaultWash.iters,
                        permanentLiquidId: protocol.defaultWash.liquid.id,
                    },
                },
                creator: {
                    connect: {
                        username: protocol.author ?? 'Jefferey',
                    },
                },
                washingLiquid: {
                    connect: {
                        id: protocol.defaultWash.liquid.id,
                    },
                },
                steps: {
                    create: protocol.steps.map((s) => {
                        let i = 0;
                        return this.createStep(s, ++i);
                    }),
                },
            },
        });
    }

    async updateProtocol(protocol: ProtocolWithStepsDTO) {
        const steps: number[] = (
            await this.prisma.step.findMany({
                where: {
                    protocol: {
                        id: +protocol.id,
                    },
                },
                select: {
                    id: true,
                },
            })
        ).map((i) => i.id);
        const deleteOldSteps = this.prisma.step.deleteMany({
            where: { id: { in: steps } },
        });

        const updateProtocolWithNewSteps = this.prisma.protocol.update({
            where: { id: +protocol.id },
            data: {
                name: protocol.name,
                description: protocol.description,
                lastUpdate: new Date(),
                defaultWashing: {
                    update: {
                        incubationTime: protocol.defaultWash.incubation,
                        iter: protocol.defaultWash.iters,
                        permanentLiquidId: protocol.defaultWash.liquid.id,
                    },
                },
                steps: {
                    create: protocol.steps.map((s) => {
                        let i = 0;
                        return this.createStep(s, ++i);
                    }),
                },
            },
        });
        await this.prisma.$transaction([
            deleteOldSteps,
            updateProtocolWithNewSteps,
        ]);
    }

    private createStep(
        s: StepDTO,
        order: number,
    ): Prisma.StepCreateWithoutProtocolInput {
        const step: Prisma.StepCreateWithoutProtocolInput = {
            sequenceOrder: order,
            stepType: s.type,
            iterations: s.params.iters,
        };
        if (s.type == StepType.LIQUID_APPL) {
            let params = s.params as ReagentStep;
            step.liquidApplication = {
                create: {
                    liquidIncubationTime: params.incubation,
                    incubationTemperature: params.targetTemperature,
                    autoWash: params.autoWash,
                    liquidInfo: this.getLiquidInfo(params.liquid),
                },
            };
        }
        if (s.type == StepType.WASHING) {
            let params = s.params as WashStep;
            step.washing = {
                create: {
                    incubationTime: params.incubation,
                    permanentLiquid: {
                        connect: {
                            id: params.liquid.id,
                        },
                    },
                },
            };
        }
        return step;
    }

    private getLiquidInfo(
        l: LiquidDTO,
    ): Prisma.LiquidInfoCreateNestedOneWithoutLiquidApplicationInput {
        if (l.id > 0) {
            return {
                connect: {
                    id: l.id,
                },
            };
        }
        return {
            create: {
                name: l.name,
                type: {
                    connect: {
                        id: l.type.id,
                    },
                },
            },
        };
    }
}
