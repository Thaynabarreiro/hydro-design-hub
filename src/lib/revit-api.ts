/**
 * Revit API REST Bridge for Hydro Design Hub.
 * Communicates with pyRevit running on http://localhost:48884/revit_mcp/execute_code/
 */

const REVIT_BRIDGE_URL = "http://localhost:48884/revit_mcp/execute_code/";

export interface RevitResponse {
  status: "success" | "error";
  output: string;
  error?: string;
}

export async function runRevitScript(
  scriptName: string,
  description: string,
  useTransaction = true
): Promise<RevitResponse> {
  const code = `import hydro; print(hydro.rodar("${scriptName}"))`;
  try {
    const res = await fetch(REVIT_BRIDGE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code,
        description,
        use_transaction: useTransaction,
      }),
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}: ${res.statusText}`);
    }
    return await res.json();
  } catch (err: any) {
    return {
      status: "error",
      output: "",
      error: err.message || "Não foi possível conectar ao Revit pyRevit REST server (localhost:48884).",
    };
  }
}
