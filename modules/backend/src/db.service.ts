import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from '@prisma/client'


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

    async getUsers() {
        return await this.prisma.user.findMany();
    }

    async getLiquids() {
        return await this.prisma.liquid.findMany();
    }

}
