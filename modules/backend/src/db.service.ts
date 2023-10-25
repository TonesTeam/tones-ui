import { Injectable } from "@nestjs/common";
import { Prisma, Protocol } from '@prisma/client'
import { LiquidDTO } from "sharedlib/dto/liquid.dto";
import { ProtocolWithStepsDTO } from "sharedlib/dto/protocol.dto";
import { ReagentStep, StepDTO, WashStep } from "sharedlib/dto/step.dto";
import { StepType } from "sharedlib/enum/DBEnums";
import { PrismaService } from "./prisma.service";


@Injectable()
export class DatabaseService {

    prisma: PrismaService;

    constructor() {
        this.prisma = new PrismaService();
    }


    async getProtocols() {
        return await this.prisma.protocol.findMany({
            where: {
                deleted: false
            },
            include: {
                creator: true
            }
        });
    }

    async getProtocolById(id: number) {
        return await this.prisma.protocol.findUnique({
            where: { id },
            include: {
                creator: true,
                defaultWashing: true,
                steps: {
                    include: {
                        liquidApplication: {
                            include: {
                                liquidInfo: {
                                    include: {
                                        permanentLiquid: true
                                    }
                                }
                            }
                        },
                        temperatureChange: true,
                        washing: {
                            include: {
                                permanentLiquid: true
                            }
                        }
                    }
                }
            }
        })
    }

    async getUsers() {
        return await this.prisma.user.findMany();
    }

    async getUser(username: string) {
        return await this.prisma.user.findFirst({ where: { deleted: false, username } });
    }

    async getPermanentLiquids() {
        return await this.prisma.permanentLiquid.findMany({
            include: {
                liquidInfo: {
                    include: {
                        type: true
                    }
                }
            }
        });
    }

    async getLiquidTypes() {
        return this.prisma.liquidType.findMany();
    }

    async getCustomProtocolLiquids(id: number) {
        return await this.prisma.liquidInfo.findMany({
            where: {
                permanentLiquid: null,
                liquidApplication: {
                    some: {
                        step: {
                            protocolId: id
                        }
                    }
                }
            },
            include: {
                type: true
            }
        })
    }

    async getLiquidInfo(id: number) {
        return await this.prisma.liquidInfo.findFirst({
            where: { id },
            include: {
                type: true
            }
        })
    }

}

let a = new DatabaseService();
export type FullProtocols = Prisma.PromiseReturnType<typeof a.getProtocols>;
export type FullProtocol = FullProtocols[0];
export type SteppedProtocol = Prisma.PromiseReturnType<typeof a.getProtocolById>;
export type ProtocolStep = SteppedProtocol['steps'][0]



