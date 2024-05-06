"use client";
import { useSocket, useSocketEvent } from "socket.io-react-hook";
import { useCallback, useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";

const PlayGround: React.FC = () => {
  const { socket, error: socketError } = useSocket("http://localhost:8080", {
    enabled: true,
  });

  const [code, setCode] = useState("");
  const [result, setResult] = useState("");

  const { sendMessage } = useSocketEvent<string>(socket, "code", {
    onMessage: (message) => {
      setResult(message);
    },
  });
  const [eventError, setEventError] = useState("");
  const { error } = useSocketEvent(socket, "error", {
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
      <div className="container px-4 md:px-6 grid grid-cols-3 gap-4 py-4">
        <div className="col-span-2 border border-green-300">
          <CodeEditor value={code} onChange={(e) => sendMessage(e)} />
        </div>
        <div className="col-span-1 border border-green-300 p-2">
          {result && (
            <code className="text-green-400 text-pretty ">{result}</code>
          )}
          {eventError && <code>{eventError}</code>}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-cover bg-center blur-2xl opacity-30" />
    </section>
  );
};

export default PlayGround;
