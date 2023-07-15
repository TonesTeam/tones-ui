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

    async getUsers() {
        return await this.prisma.user.findMany();
    }

    async getLiquids() {
        return await this.prisma.permanentLiquid.findMany({
            include: {
                liquidInfo: true
            }
        });
    }
}

let a = new DatabaseService();
export type FullProtocols = Prisma.PromiseReturnType<typeof a.getProtocols>;
export type FullProtocol = FullProtocols[0];

