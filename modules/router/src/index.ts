import express from 'express'
import httpProxy from 'http-proxy'
const app = express()
const port = process.env.ROUTER_PORT
const FEProxy = httpProxy.createProxyServer();

app.all("/api/*", (req, res) => {
	var url = new URL("http://" + req.headers.host!)
	url.port = process.env.BE_PORT!
	const opts = { target: url.toString() }
	FEProxy.web(req, res, opts);
})

app.all("/*", (req, res) => {
	var url = new URL("http://" + req.headers.host!)
	url.port = process.env.FE_PORT!
	const opts = { target: url.toString() }
	FEProxy.web(req, res, opts);
})

app.listen(port, () => {
	console.log(`Router listening on port ${port}`)
})
