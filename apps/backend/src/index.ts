import express from 'express'
import httpProxy from 'http-proxy'
const app = express()
const port = process.env.BE_PORT
const apiRouter = express.Router()
const FEProxy = httpProxy.createProxyServer();
apiRouter.get('/test', (req, res) => {
	res.send('Hello World!')
})

app.use('/api', apiRouter)

app.listen(port, () => {
	console.log(`API listening on port ${port}`)
})
