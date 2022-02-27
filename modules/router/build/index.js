"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const app = (0, express_1.default)();
const port = process.env.ROUTER_PORT;
const FEProxy = http_proxy_1.default.createProxyServer();
app.all("/api/*", (req, res) => {
    var url = new URL("http://" + req.headers.host);
    url.port = process.env.BE_PORT;
    const opts = { target: url.toString() };
    FEProxy.web(req, res, opts);
});
app.all("/*", (req, res) => {
    var url = new URL("http://" + req.headers.host);
    url.port = process.env.FE_PORT;
    const opts = { target: url.toString() };
    FEProxy.web(req, res, opts);
});
app.listen(port, () => {
    console.log(`Router listening on port ${port}`);
});
