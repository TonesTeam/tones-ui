import "reflect-metadata"

import { Container } from 'inversify';
import { InversifyExpressServer } from 'inversify-express-utils';

import "@controller/main.controller"
import { buildProviderModule } from "inversify-binding-decorators";
import { Logger } from "tslog";
import "ormconfig"

//apiRouter.get('/test', async (req, res) => {
//	const connection = await connectionPromise
//	const userRepo = connection.getRepository(User);
//	const protocolRepo = connection.getRepository(Protocol);
//	const allUsers = await userRepo.find({ relations: ["protocols", "protocols.protocolType"] });
//	console.log(allUsers[0])
//	console.log(allUsers[0].protocols[0].creator)
//	res.send(JSON.stringify(allUsers[0]))
//})

let container = new Container();
container.load(buildProviderModule());
const logger = new Logger()
container.bind<Logger>(Logger).toConstantValue(logger);

let server = new InversifyExpressServer(container, null, { rootPath: "/api" });
let app = server.build();
const port = process.env.BE_PORT ?? 8080
app.listen(port, () => {
	logger.info(`API listening on port ${port}`)
});

