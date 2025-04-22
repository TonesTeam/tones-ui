import express from 'express';
import httpProxy from 'http-proxy';
import http from 'http';
const app = express();
const port: number = Number(process.env.ROUTER_PORT);
const FEProxy = httpProxy.createProxyServer();

app.all('/api/v2/*', (req, res) => {
    var url = new URL('http://' + req.headers.host!);
    url.port = process.env.BE_PORT!;
    const opts = { target: url.toString() };
    FEProxy.web(req, res, opts);
});

app.all('/api/*', (req, res) => {
    var url = new URL('http://' + req.headers.host!);
    url.port = process.env.LEGACY_BE_PORT!;
    const opts = { target: url.toString() };
    FEProxy.web(req, res, opts);
});

app.all('/*', (req, res) => {
    var url = new URL('http://' + req.headers.host!);
    url.port = process.env.FE_PORT!;
    const opts = { target: url.toString() };
    FEProxy.web(req, res, opts);
});

http.createServer(app).listen(port, () => {
    console.log(`Router listening on port ${port}`);
});
