"use client";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";

const PlayGround: React.FC = () => {
  const { socket } = useSocket(process.env.WEBSOCKET_URL!, {
    enabled: true,
  });

  const [code] = useState("");
  const [result, setResult] = useState("");

  const { sendMessage } = useSocketEvent<string>(socket, "code", {
    onMessage: (message) => {
      setResult(message);
    },
  });
  const [eventError, setEventError] = useState("");
  const { lastMessage } = useSocketEvent(socket, "error", {
    onMessage(error) {
      setEventError(error);
    },
  });

  if (!socket.connected) {
    return (
      <div>
        <h1>Wait....</h1>
      </div>
    );
  }
  return (
    <section className="flex h-screen  bg-gradient-to-br from-[#1e293b] to-[#0f172a] text-white">
      <div className="grid grid-cols-3 gap-4  w-full h-full p-2">
        <div className="col-span-2 border border-green-300 shadow-md shadow-green-400">
          <CodeEditor value={code} onChange={(e) => sendMessage(e)} />
        </div>
        <div className="col-span-1 border border-green-300 p-2 shadow-md shadow-green-400">
          {result && (
            <code className="text-green-400 text-pretty ">{result}</code>
          )}
          {(lastMessage || eventError) && (
            <code className="text-red-500 text-preetty">
              {eventError || lastMessage}
            </code>
          )}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-cover bg-center blur-2xl opacity-30" />
    </section>
  );
};

export default PlayGround;
