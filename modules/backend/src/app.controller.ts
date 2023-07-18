import { Controller, Get, Logger } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './db.service';

@Controller()
export class AppController {

    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly appService: AppService,
        private readonly dbService: DatabaseService,
    ) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get("test")
    async getUsers() {
        return await this.dbService.getUsers()
    }

    @Get("liquids")
    async getLiquids() {
        return await this.dbService.getLiquids()
    }

}
