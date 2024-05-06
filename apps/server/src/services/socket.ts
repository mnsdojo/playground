import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import * as ts from "typescript";
import { spawn } from "node:child_process";

export async function transpileCode(sourceCode: string) {
  try {
    if (!sourceCode) {
      throw new Error("Source code is undefined or empty");
    }
    const result = ts.transpileModule(sourceCode, {
      compilerOptions: { module: ts.ModuleKind.CommonJS },
    });

    return { code: JSON.stringify(result.outputText) };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function compileCode(
  code: string
): Promise<{ output: string; error?: string }> {
  try {
    if (!code) throw new Error("No transpiled code found");

    await new Promise((resolve) => setTimeout(resolve, 400));

    const childProcess = spawn("node", ["-e", code]);
    let output = "";
    let error = "";

    childProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    childProcess.stderr.on("data", (data) => {
      error += data.toString();
    });

    await new Promise((resolve) => {
      childProcess.on("close", (code) => {
        if (code !== 0) {
          return resolve({
            error: `Child process exited with code ${code}`,
            output,
          });
        }
        resolve({ output, error });
      });
    });

    return { output, error };
  } catch (error: any) {
    return { error: error.message, output: "" };
  }
}

class SocketService {
  private _io: Server;

  constructor(server: HttpServer) {
    this._io = new Server(server, {
      cors: {
        allowedHeaders: ["*"],
        origin: "*",
      },
    });

    this.initListener();
  }

  private initListener() {
    console.log("Init socket listener");
    this._io.on("connection", (socket: Socket) => {
      console.log(`User connected: ${socket.id}`);

      socket.on("code", (code: string) => this.handleExecuteCode(socket, code));

      socket.on("disconnect", () => {
        try {
          this.handleDisconnect(socket);
        } catch (error) {
          console.error(
            `Error handling disconnect for user ${socket.id}: ${error}`
          );
        }
      });
    });
  }

  private async handleExecuteCode(socket: Socket, code: string) {
    try {
      if (!code) throw new Error("No code provided");
      const startTime = process.hrtime();
      const transpiled = await transpileCode(code);
      if (!transpiled.code) throw new Error("Transpiled code not generated");
      const { error, output } = await compileCode(JSON.parse(transpiled.code));
      const endTime = process.hrtime(startTime);
      const timeComplexity = `Time complexity: ${endTime[0]}s ${endTime[1] / 1000000}ms`;
      console.log(timeComplexity);
      this._io.to(socket.id).emit("code", output);
      if (error) {
        this._io.to(socket.id).emit("error", { message: error });
      }
    } catch (error: any) {
      this._io.to(socket.id).emit("error", { message: error.message });
    }
  }

  private handleDisconnect(socket: Socket) {
    console.log(`User ${socket.id} disconnected`);
  }

  get io(): Server {
    return this._io;
  }
}

export default SocketService;
