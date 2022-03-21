import express from 'express'
import "reflect-metadata"
import { createConnection } from "typeorm";
import { Protocol } from './entity/Protocol';
import { User } from "./entity/User";

const connectionPromise = createConnection();

const app = express()
const port = process.env.BE_PORT
const apiRouter = express.Router()

apiRouter.get('/test', async (req, res) => {
	const connection = await connectionPromise
	const userRepo = connection.getRepository(User);
	const protocolRepo = connection.getRepository(Protocol);
	const allUsers = await userRepo.find({ relations: ["protocols", "protocols.protocolType"] });
	console.log(allUsers[0])
	console.log(allUsers[0].protocols[0].creator)
	res.send(JSON.stringify(allUsers[0]))
})

app.use('/api', apiRouter)

app.listen(port, () => {
	console.log(`API listening on port ${port}`)
})
