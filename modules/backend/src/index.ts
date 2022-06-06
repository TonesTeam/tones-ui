import "@controller/BlocklyController";
import "@controller/ProtocolController";
import * as bodyParser from 'body-parser';
import { Container } from 'inversify';
import { buildProviderModule } from "inversify-binding-decorators";
import { InversifyExpressServer } from 'inversify-express-utils';
import "reflect-metadata";
import config from "sharedlib/tones-config.json";
import { Logger } from "tslog";


let container = new Container();
container.bind(Container).toConstantValue(container);

container.load(buildProviderModule());
const logger = new Logger()
container.bind<Logger>(Logger).toConstantValue(logger);

let server = new InversifyExpressServer(container, null, { rootPath: "/api" });
server.setConfig(app => {
	app.use(bodyParser.text({ type: '*/*' }));
})
let app = server.build();
const port = process.env.BE_PORT ?? 8080
app.listen(port, () => {
	console.log("Magic word is", config["magic-word"])
	logger.info(`API listening on port ${port}`)
});

