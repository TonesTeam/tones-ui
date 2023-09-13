import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient, Protocol } from '@prisma/client'
import { ProtocolWithStepsDTO } from "sharedlib/dto/protocol.dto";
import { WashStep } from "sharedlib/dto/step.dto";


class PrismaService extends PrismaClient implements OnModuleInit {
    async onModuleInit() {
        await this.$connect();
    }

    async enableShutdownHooks(app: INestApplication) {
        this.$on('beforeExit', async () => {
            await app.close();
        });
    }
}

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
        return await this.prisma.user.findFirst({where: {deleted:false, username}});
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

    async saveProtocol(protocol: ProtocolWithStepsDTO) {
        protocol.defaultWash
        const pr: Protocol = {
            id: 0,
            name: "",
            creationDate: undefined,
            description: "",
            // userId: (await this.getUser(protocol.author)).id,
            liquidId: protocol.defaultWash.liquid.id,
            deleted: false,
            // washingId: (await this.saveWashing(protocol.defaultWash)).id
        };
        const steps = protocol.steps.map(s => ({}))
        this.prisma.protocol.upsert({
            where: {id: protocol.id},
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
                        username: protocol.author
                    }
                },
                washingLiquid: {
                    connect: {
                        id: protocol.defaultWash.liquid.id
                    }
                },
                steps: {
                    create: protocol.steps.map(s => ({
                        sequenceOrder: 0,
                        stepType: s.type,
                    }))
                }

            },
            update: pr
        })
    }

}

let a = new DatabaseService();
export type FullProtocols = Prisma.PromiseReturnType<typeof a.getProtocols>;
export type FullProtocol = FullProtocols[0];
export type SteppedProtocol = Prisma.PromiseReturnType<typeof a.getProtocolById>;
export type ProtocolStep = SteppedProtocol['steps'][0]



