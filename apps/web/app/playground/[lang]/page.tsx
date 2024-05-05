"use client";

import { useEffect, useState } from "react";
import { useSocket } from "@/provider/socket-provider";
import CodeEditor from "@/components/editor/CodeEditor";
function Page() {
  const [code, setCode] = useState("");

  const { socket } = useSocket();

  return (
    <div className="min-h-screen  p-4 overflow-hidden grid grid-cols-3 gap-4 bg-gradient-to-br from-[#1e293b] to-[#0f172a]  text-white">
      <div className=" ring-gray-400 col-span-2  relative ring-1 ring-gray-900/5 p-4 h-full overflow-auto shadow-md rounded-md ">
        <CodeEditor value={code} onChange={(e) => setCode(e || "")} />
      </div>
      <div className="col-span-1  ring-gray-300 ring-1 p-4   rounded-md shadow-md ">
        <h1>Result</h1>
      </div>
      <div className="absolute inset-0 -z-10  bg-cover bg-center blur-2xl opacity-30" />
    </div>
  );
}

export default Page;
