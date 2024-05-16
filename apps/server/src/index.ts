import express from "express";
const port = process.env.PORT || 8080;

import { createServer } from "http";
import SocketService from "./services/socket";

const app = express();
const server = createServer(app);
new SocketService(server);

server.listen(port, () => console.log(`Running on Port: ${port}`));
