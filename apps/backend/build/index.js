"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_proxy_1 = __importDefault(require("http-proxy"));
const app = (0, express_1.default)();
const port = process.env.BE_PORT;
const apiRouter = express_1.default.Router();
const FEProxy = http_proxy_1.default.createProxyServer();
apiRouter.get('/test', (req, res) => {
    res.send('Hello World!');
});
app.use('/api', apiRouter);
app.listen(port, () => {
    console.log(`API listening on port ${port}`);
});
