"use client";

import { useState } from "react";
import CodeEditor from "@/components/editor/CodeEditor";

function Page() {
  const [code, setCode] = useState("");

  return (
    <div className="min-h-screen  p-4 overflow-hidden grid grid-cols-3 gap-4 ">
      <div className="col-span-2  relative ring-1 ring-gray-900/5 p-4 h-full overflow-auto shadow-md rounded-md ">
        <CodeEditor value={code} onChange={(e) => setCode(e || "")} />
      </div>
      <div className="col-span-1  ring-gray-900/5 ring-1 p-4  rounded-md shadow-md ">
        <h1>Result</h1>
      </div>
    </div>
  );
}

export default Page;
