import express from "express";
const port = process.env.PORT || 8080;
import ts from "typescript";

import { createServer } from "http";
import { Server } from "socket.io";
import {spawn} from 'node:child_process'


async function transpileCode(sourceCode: string) {
  const result = ts.transpileModule(sourceCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });

  return JSON.stringify(result);
}
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

async function execCode(transpiledCode: string) {
  return "";
}

io.on("connect", (socket) => {
  socket.on("execute", async (code: string) => {
    const transpiled = await transpileCode(code);
    const compiledCode = await execCode(transpiled);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => console.log(`Running on Port: ${port}`));
