import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from '@prisma/client'


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


