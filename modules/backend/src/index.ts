import "@controller/BlocklyController";
import "@controller/ProtocolController";
import { LiquidApplicationCommand } from "@service/commands/Commands";
import { LiquidConfigurationResolver } from "@service/deployment/LiquidConfigurationResolver";
import assert from "assert";
import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from "express";
import { Container } from 'inversify';
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from 'inversify-express-utils';
import { ReadlineParser, SerialPort, SerialPortMock } from 'serialport';
import "reflect-metadata";
import config from "sharedlib/tones-config.json";
import { Logger } from "tslog";


let container = new Container();
container.bind(Container).toConstantValue(container);

container.load(buildProviderModule());
const logger = new Logger()
container.bind<Logger>(Logger).toConstantValue(logger);
function getPort() {
	if (process.arch === "arm64") {
		return new SerialPort({
			path: '/dev/ttyS0',
			baudRate: 115200,
		})
	}
	SerialPortMock.binding.createPort("/dev/test")
	return new SerialPortMock({ path: "/dev/test", baudRate: 9600 })
}
const serialport = getPort()
container.bind(SerialPort).toConstantValue(serialport)
serialport


let server = new InversifyExpressServer(container, null, { rootPath: "/api" });
server.setConfig(app => {
	app.use(bodyParser.text({ type: '*/*' }));
})
server.setErrorConfig(app => {
	app.use((err: any, req: Request, res: Response, next: NextFunction) => {
		console.log(err?.stack ?? err)
		res.status(500).send(err?.message ?? err)
	})
})
let app = server.build();
const port = process.env.BE_PORT ?? 8080

app.listen(port, () => {
	console.log("Magic word is", config["magic-word"])
	logger.info(`API listening on port ${port}`)
});

