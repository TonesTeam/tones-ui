import "@controller/BlocklyController";
import "@controller/ProtocolController";
import * as bodyParser from 'body-parser';
import { NextFunction, Request, Response } from "express";
import { Container } from 'inversify';
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from 'inversify-express-utils';
import { DelimiterParser, SerialPort, SerialPortMock } from 'serialport';
import "reflect-metadata";
import config from "sharedlib/tones-config.json";
import { Logger } from "tslog";
import { ControllerMessageInterface } from "@service/external/ControllerMessageInterface";
import { MessageChannel } from "@service/external/Message";


const logger = new Logger()
let container = new Container();
container.bind(Container).toConstantValue(container);
container.load(buildProviderModule());
container.bind<Logger>(Logger).toConstantValue(logger);
function getPort() {
	if (process.arch === "arm64") {
		return new SerialPort({ path: '/dev/ttyS0', baudRate: 115200 })
	}
	SerialPortMock.binding.createPort("/dev/test", { echo: true, record: true })
	return new SerialPortMock({ path: "/dev/test", baudRate: 9600 })
}
const serialport = getPort();
const parser = serialport.pipe(new DelimiterParser({ delimiter: ';\n', includeDelimiter: false }));
container.bind(SerialPort).toConstantValue(serialport);
container.bind<DelimiterParser>(DelimiterParser).toConstantValue(parser);

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
// serialport.on('open', () => {
	// serialport.port!.write(Buffer.from("2,testdata,99e5365e;\n"))
		// .then(() => {
			// container.get<ControllerMessageInterface>(ControllerMessageInterface).readMsgFromChannel(MessageChannel.INFO)
				// .then((res) => {
// 					console.log(`RECIEVED: ${res}`)
// 				})
// 			container.get<ControllerMessageInterface>(ControllerMessageInterface).readMsgFromChannel(MessageChannel.INFO)
// 				.then((res) => {
// 					console.log(`RECIEVED: ${res}`)
// 				})
// 		})
// });