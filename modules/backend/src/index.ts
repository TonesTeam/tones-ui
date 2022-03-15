import express from 'express'
import "reflect-metadata"
import { createConnection } from "typeorm";
import { User } from "./entity/User";

const connectionPromise = createConnection();

const app = express()
const port = process.env.BE_PORT
const apiRouter = express.Router()

apiRouter.get('/test', async (req, res) => {
	const connection = await connectionPromise
	const userRepo = connection.getRepository(User);
	const allUsers = await userRepo.find();
	console.log(allUsers)
	res.send(JSON.stringify(allUsers[0]))
})

app.use('/api', apiRouter)

app.listen(port, () => {
	console.log(`API listening on port ${port}`)
})
