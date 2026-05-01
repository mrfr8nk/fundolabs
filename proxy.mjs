import { createServer } from "http";
import { request } from "http";

const PROXY_PORT = 5000;
const TARGET_PORT = 8080;

createServer((req, res) => {
  const options = {
    hostname: "localhost",
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxy.on("error", (err) => {
    res.writeHead(502);
    res.end("Proxy error: " + err.message);
  });

  req.pipe(proxy, { end: true });
}).listen(PROXY_PORT, () => {
  console.log("Proxy: port " + PROXY_PORT + " -> " + TARGET_PORT);
});
