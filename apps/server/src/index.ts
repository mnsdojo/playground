import express from "express";
const port = process.env.PORT || 8080;
import ts from "typescript";

import { createServer } from "http";
import { Server } from "socket.io";
import { spawn } from "node:child_process";

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
const rooms = new Map();

io.on("connect", (socket) => {
  console.log("Connected user -- " + socket.id);
  socket.on("execute", async (code: string) => {
    const transpiled = await transpileCode(code);
    const compiledCode = await execCode(transpiled);
  });
  socket.on("join", (lang) => {
    socket.join(lang);


    if (!rooms.has(lang)) {
      rooms.set(lang, new Set([socket.id])); // Initialize the set with the current user
    } else {
      rooms.get(lang).add(socket.id); // Add the user to the set of users in the room
    }

    // Emit a message to confirm the user has joined the room
    io.to(socket.id).emit("joinedRoom", { room: lang });

    console.log(`${socket.id} joined room: ${lang}`);
  });
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(port, () => console.log(`Running on Port: ${port}`));
