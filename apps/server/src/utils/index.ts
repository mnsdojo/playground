import ts from "typescript";

import { Server } from "socket.io";
import { spawn } from "node:child_process";
export async function transpileCode(sourceCode: string) {
  const result = ts.transpileModule(sourceCode, {
    compilerOptions: { module: ts.ModuleKind.CommonJS },
  });

  return JSON.stringify(result);
}

export async function compileCode(code: string) {
  const res = await transpileCode(code);
}
