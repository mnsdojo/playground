import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import { compileCode, transpileCode } from "../lib/exec";

class SocketService {
  private _io: Server;

  constructor(server: HttpServer) {
    this._io = new Server(server, {
      cors: {
        allowedHeaders: ["*"],
        origin: "https://tsplayground.vercel.app",
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
      const transpiled = await transpileCode(code);
      if (!transpiled.code) throw new Error("Transpiled code not generated");
      const { error, output } = await compileCode(JSON.parse(transpiled.code));
      if (error) {
        this._io.to(socket.id).emit("error", { message: error });
      }
      this._io.to(socket.id).emit("code", output);
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
