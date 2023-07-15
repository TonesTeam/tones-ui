import { Controller, Get, Logger, Param, ParseIntPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { DatabaseService } from './db.service';

@Controller()
export class AppController {

    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly appService: AppService,
    ) { }

    @Get("protocols")
    getProtocols() {
        this.logger.log("Retrieving all protocols")
        return this.appService.getProtocols();
    }

    @Get("protocol/:id")
    getProtocolSteps(@Param('id', new ParseIntPipe()) id: number) {
        
    }

}
