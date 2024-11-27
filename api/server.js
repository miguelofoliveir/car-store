const path = require('path');
const jsonServer = require(path.join(__dirname, 'node_modules/json-server'));

const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const port = 3000;

console.log('Using database file:', path.join(__dirname, 'db.json'));
console.log(`JSON Server is running on http://localhost:${port}`);

server.listen(port);
