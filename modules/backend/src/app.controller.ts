import { Body, Controller, Delete, Get, Header, Logger, Param, ParseIntPipe, Post, UsePipes } from '@nestjs/common';
import { AppService } from './app.service';
import { ProtocolWithStepsDTO } from 'sharedlib/dto/protocol.dto';
import { ParseDatePipe } from './parse-date.pipe';
import { PermanentLiquidDTO } from 'sharedlib/dto/liquid.dto';
import { Request as ExpressRequest, Router} from "express";
import { Request } from "@nestjs/common";
import { ProtocolDeploymentService } from './protocol-deployment.service';


@Controller()
@UsePipes(new ParseDatePipe())
export class AppController {

    private readonly logger = new Logger(AppController.name);

    constructor(
        private readonly appService: AppService,
        private readonly deploymentService: ProtocolDeploymentService,
    ) { }

    @Get("/")
    getEndpoints(@Request() req: ExpressRequest) {
        const router = req.app._router as Router;
        return {
            routes: router.stack
                .map(layer => {
                    if(layer.route) {
                        const path = layer.route?.path;
                        const method = layer.route?.stack[0].method;
                        return `${method.toUpperCase()} ${path}`
                    }
                    return undefined;
                })
                .filter(item => item !== undefined)
        }
    }

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

    @Delete("/protocol/delete/:id")
    async deleteProtocol(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Deleting protocol ${id}`);
        await this.appService.deleteProtocol(id);
        return 'Deleted protocol';
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
    @Header("Content-Type", "application/json")
    async saveProtocol(@Body() protocol: ProtocolWithStepsDTO) {
        this.logger.log(`Saving protocol: ${JSON.stringify(protocol)}`)
        return await this.appService.saveProtocol(protocol);
    }

    @Post("/liquid/save")
    async saveLiquid(@Body() liquid: PermanentLiquidDTO) {
        this.logger.log(`Saving liquid: ${JSON.stringify(liquid)}`)
        return await this.appService.saveLiquid(liquid);
    }

    @Delete("/liquid/delete/:id")
    async deleteLiquid(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Deleting liquid ${id}`)
        await this.appService.deleteLiquid(id);
        return 'Deleted liquid';
    }

    @Get("/protocol/:id/deployment")
    async deployProtocol(@Param('id', new ParseIntPipe()) id: number) {
        this.logger.log(`Figuring out deployment for protocol ${id}`);
        return await this.deploymentService.deployProtocol(id);
    }

}
