import { spawn } from 'child_process';
import * as ts from 'typescript'
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
