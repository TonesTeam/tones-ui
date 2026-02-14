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
                    create: protocol.stepBatches
                        .flatMap((batch) => batch.steps)
                        .map((step, index) => this.createStep(step, index + 1)),
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
                    create: protocol.stepBatches
                        .flatMap((batch) => batch.steps)
                        .map((step, index) => this.createStep(step, index + 1)),
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
            iterations:
                s.type === StepType.WASHING ? (s.params as WashStep).iters : 1,
        };
        if (s.type == StepType.REAGENT) {
            const params = s.params as ReagentStep;
            step.liquidApplication = {
                create: {
                    liquidIncubationTime: params.incubation,
                    washingIterations: 0,
                    incubationTemperature: params.targetTemperature,
                    autoWash: false,
                    liquidInfo: this.getLiquidInfo(params.liquid),
                },
            };
        }
        if (s.type == StepType.WASHING) {
            const params = s.params as WashStep;
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
