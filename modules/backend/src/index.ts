import express from 'express'

const app = express()
const port = process.env.BE_PORT
const apiRouter = express.Router()

apiRouter.get('/test', (req, res) => {
	res.send('{"test":"Hello Worlds 23"}')
})

app.use('/api', apiRouter)

app.listen(port, () => {
	console.log(`API listening on port ${port}`)
})
