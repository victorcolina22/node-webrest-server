"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http2_1 = __importDefault(require("http2"));
const node_fs_1 = __importDefault(require("node:fs"));
const server = http2_1.default.createSecureServer({
    key: node_fs_1.default.readFileSync("./keys/server.key"),
    cert: node_fs_1.default.readFileSync("./keys/server.crt"),
}, (req, res) => {
    var _a, _b;
    console.log({ request: req.url });
    // res.writeHead(200, { "Content-Type": "text/html" });
    // res.write(`<h1>URL${req.url}</h1>`);
    // res.end();
    // const data = { name: "John Doe", age: 30, city: "New York" };
    // res.writeHead(200, { "Content-Type": "application/json" });
    // res.end(JSON.stringify(data));
    if (req.url === "/") {
        const htmlFile = node_fs_1.default.readFileSync("./public/index.html", "utf-8");
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(htmlFile);
        return;
    }
    if ((_a = req.url) === null || _a === void 0 ? void 0 : _a.endsWith(".js")) {
        res.writeHead(200, { "Content-Type": "application/javascript" });
    }
    else if ((_b = req.url) === null || _b === void 0 ? void 0 : _b.endsWith(".css")) {
        res.writeHead(200, { "Content-Type": "text/css" });
    }
    try {
        const responseContent = node_fs_1.default.readFileSync(`./public${req.url}`, "utf-8");
        res.end(responseContent);
    }
    catch (error) {
        res.writeHead(404, { "Content-Type": "text/html" });
        res.end();
    }
});
server.listen(8080, () => {
    console.log("Server running on port 8080");
});
