import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ProtocolWithStepsDTO } from 'sharedlib/dto/protocol.dto';
import { ParseDatePipe } from './parse-date.pipe';
import { PermanentLiquidDTO } from 'sharedlib/dto/liquid.dto';

@Controller()
@UsePipes(new ParseDatePipe())
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

    @Get("protocol/steps/:id")
    getProtocolSteps(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Retrieving protocol ${id}`)
        return this.appService.getProtocolSteps(id);
    }

    @Get("protocol/:id")
    getProtocolWithSteps(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Retrieving protocol ${id}`)
        return this.appService.getProtocolWithSteps(id);
    }

    @Get("liquids")
    getPermanentLiquids() {
        this.logger.log("Retrieving all liquids");
        return this.appService.getPermanentLiquids();
    }

    @Get("types")
    getLiquidTypes() {
        this.logger.log("Retrieving all liquid types");
        return this.appService.getLiquidTypes();
    }

    @Get("/protocol/:id/custom-liquids")
    getCustomProtocolLiquids(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Retrieving custom liquids for protocol ${id}`);
        return this.appService.getCustomProtocolLiquids(id);
    }

    @Post("/protocol/save")
    async saveProtocol(@Body() protocol: ProtocolWithStepsDTO) {
        this.logger.log(`Saving protocol: ${JSON.stringify(protocol)}`)
        return await this.appService.saveProtocol(protocol);
    }

    @Post("/liquid/save")
    async saveLiquid(@Body() liquid: PermanentLiquidDTO) {
        this.logger.log(`Saving liquid: ${JSON.stringify(liquid)}`)
        return await this.appService.saveLiquid(liquid);
    }

}
