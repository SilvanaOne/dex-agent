"use client";

import { useState, useEffect } from "react";
import {
  agentSqlRequest,
  prepareOrderPayload,
  ActionBidRequest,
  Operation,
  convertOrderPayloadToActionRequest,
  LastTransactionData,
  LastTransactionErrors,
  ActionStatus,
  dexProverResult,
  sleep,
} from "@dex-agent/lib";
import Processing from "./ui/processing";
import { signSqlRequest } from "@/lib/dex/sql";
import { nanoid } from "nanoid";
import { shortenString } from "@/lib/short";
import { daUrl } from "@/lib/chain";

const agent = nanoid();

const ALICE_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALICE_PUBLIC_KEY;
interface SqlQueryProps {
  blockNumber: number;
  sequence: number;
  price?: number;
  amount?: number;
  setTxData: (
    txData: LastTransactionData | LastTransactionErrors | null
  ) => void;
}

export default function SqlQuery({
  blockNumber,
  sequence,
  price = 1500,
  amount = 0.1,
  setTxData,
}: SqlQueryProps) {
  const [sqlQuery, setSqlQuery] =
    useState<string>(`SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'State' ORDER BY ordinal_position`);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [proof, setProof] = useState<string | null>(null);

  useEffect(() => {
    if (jobId) {
      setProof("Calculating proof...");
      const fetchProof = async () => {
        let received: string | undefined = undefined;
        let failed = false;
        let result = await dexProverResult({ jobId });
        console.log("result", result?.result);
        while (!received && !failed) {
          await sleep(5000);
          result = await dexProverResult({ jobId });
          console.log("result", result?.result);
          try {
            if (result?.result) {
              const { success, blobId } = JSON.parse(result.result);
              if (success && blobId) {
                received = blobId;
              } else {
                failed = true;
              }
            }
          } catch (error: any) {
            console.error("Error parsing result:", error.message);
            failed = true;
          }
        }
        setProof(received ?? null);
      };
      fetchProof();
    }
  }, [jobId]);

  const executeQuery = async () => {
    setIsExecuting(true);
    setError(null);
    setProof(null);
    setJobId(null);
    try {
      //const result = await sqlActionRequestQuery(sqlQuery);
      console.time("agentSqlRequest");
      const result = await agentSqlRequest({
        query: sqlQuery,
        blockNumber,
        sequence,
      });
      console.timeEnd("agentSqlRequest");
      console.log("agentSqlRequest", result);
      if (result.success && result.queryResult) {
        setResults(result.queryResult as any);
        setError(null);
        if (
          result.processedResult &&
          Array.isArray(result.processedResult) &&
          result.processedResult.length > 0
        ) {
          if ("jobId" in result.processedResult[0]) {
            setJobId(result.processedResult[0].jobId);
          } else {
            setTxData(result.processedResult[0]);
          }
        }
      } else {
        setError("Error executing query: " + result.error);
        setResults(null);
      }
    } catch (err) {
      setError(
        "Error executing query: " +
          (err instanceof Error ? err.message : String(err))
      );
      setResults(null);
    } finally {
      setIsExecuting(false);
    }
  };

  const insertTemplate = (template: string) => {
    setSqlQuery(template);
  };

  const proveAccount = async () => {
    if (!ALICE_PUBLIC_KEY) return;
    const address = ALICE_PUBLIC_KEY;
    const sqlQuery = `INSERT INTO "ActionRequest"
("operation", "blockNumber", "sequence", "publicKeyBase58")
VALUES 
('PROOF',  ${blockNumber}, ${sequence}, '${address}')`;
    insertTemplate(sqlQuery);
  };

  const order = async (type: "buy" | "sell") => {
    if (!ALICE_PUBLIC_KEY) return;

    const orderPayload = await prepareOrderPayload({
      user: ALICE_PUBLIC_KEY,
      amount,
      price,
      type,
      currency: "WETH",
    });
    const signedPayload = await signSqlRequest(orderPayload);
    console.log("Alice signature", signedPayload.signature);
    const actionRequest = await convertOrderPayloadToActionRequest({
      payload: orderPayload,
      signature: signedPayload.signature,
    });
    console.log("actionRequest", actionRequest);
    const sqlQuery: string = `INSERT INTO "ActionRequest" (
  "operation", 
  ${
    actionRequest.operation === 1
      ? `
  "address",
  "poolPublicKey",
  "publicKey",
  "publicKeyBase58",
  "name",
  "role",
  "image",
  "baseBalance",
  "quoteBalance",`
      : ""
  }
  ${
    actionRequest.operation === 2 || actionRequest.operation === 3
      ? `
  "poolPublicKey",
  "userPublicKey",
  "baseTokenAmount",
  "price",
  "isSome",
  "nonce",
  "userSignatureR",
  "userSignatureS",`
      : ""
  }
  ${
    actionRequest.operation === 6
      ? `
  "sequence",
  "publicKeyBase58",`
      : ""
  }
  "agent"
) VALUES (
  '${
    actionRequest.operation === 1
      ? "CREATE_ACCOUNT"
      : actionRequest.operation === 2
      ? "BID"
      : actionRequest.operation === 3
      ? "ASK"
      : actionRequest.operation === 4
      ? "TRADE"
      : actionRequest.operation === 5
      ? "TRANSFER"
      : actionRequest.operation === 6
      ? "PROOF"
      : "UNKNOWN"
  }', 
  ${
    actionRequest.operation === 1
      ? `
  '${(actionRequest as any).address}',
  '${(actionRequest as any).poolPublicKey}',
  '${(actionRequest as any).publicKey}',
  '${(actionRequest as any).publicKeyBase58}',
  '${(actionRequest as any).name}',
  '${(actionRequest as any).role}',
  '${(actionRequest as any).image}',
  '${(actionRequest as any).baseBalance.toString()}',
  '${(actionRequest as any).quoteBalance.toString()}',`
      : ""
  }
  ${
    actionRequest.operation === 2 || actionRequest.operation === 3
      ? `
  '${(actionRequest as any).poolPublicKey}',
  '${(actionRequest as any).userPublicKey}',
  '${(actionRequest as any).baseTokenAmount.toString()}',
  '${(actionRequest as any).price.toString()}',
  ${(actionRequest as any).isSome},
  '${(actionRequest as any).nonce.toString()}',
  '${(actionRequest as any).userSignature.r.toString()}',
  '${(actionRequest as any).userSignature.s.toString()}',`
      : ""
  }
  ${
    actionRequest.operation === 6
      ? `
  '${(actionRequest as any).sequence.toString()}',
  '${(actionRequest as any).publicKeyBase58}',`
      : ""
  }
  '${agent}'
) RETURNING *;`.replace(/\n\s*\n/g, "\n");
    insertTemplate(sqlQuery);
  };

  return (
    <div className="h-full p-1 flex flex-col">
      <div className="flex flex-col space-y-1 mb-1">
        <div className="flex space-x-1">
          <button
            onClick={() =>
              insertTemplate(
                `SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'`
              )
            }
            className="flex-1 py-1 bg-[#2a2e37] hover:bg-[#3a3e47] text-[#848e9c] hover:text-white rounded text-[10px] font-medium transition-colors"
          >
            Tables
          </button>
          <button
            onClick={() =>
              insertTemplate(
                `SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'State' ORDER BY ordinal_position`
              )
            }
            className="flex-1 py-1 bg-[#2a2e37] hover:bg-[#3a3e47] text-[#848e9c] hover:text-white rounded text-[10px] font-medium transition-colors"
          >
            Schema
          </button>
          <button
            onClick={() =>
              insertTemplate(
                `SELECT * 
FROM "State" 
WHERE sequence = '${sequence}' AND address = '${ALICE_PUBLIC_KEY ?? ""}';`
              )
            }
            className="flex-1 py-1 bg-[#2a2e37] hover:bg-[#3a3e47] text-[#848e9c] hover:text-white rounded text-[10px] font-medium transition-colors"
          >
            Account
          </button>
        </div>

        <div className="flex space-x-1">
          <button
            onClick={() => order("buy")}
            className="flex-1 py-1 bg-[#02c076] hover:bg-[#02a76a] text-white rounded text-[10px] font-medium transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() => order("sell")}
            className="flex-1 py-1 bg-[#f6465d] hover:bg-[#e0364d] text-white rounded text-[10px] font-medium transition-colors"
          >
            Sell
          </button>
          <button
            onClick={proveAccount}
            className="flex-1 py-1 bg-[#8358FF] hover:bg-[#7048df] text-white rounded text-[10px] font-medium transition-colors"
          >
            Prove
          </button>
        </div>

        {/* SQL Query Input */}
        <div>
          <div className="flex justify-between items-center mb-0.5">
            <label className="text-[10px] text-[#848e9c]">SQL Query</label>
          </div>
          <textarea
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            rows={5}
            className="w-full bg-[#2a2e37] border border-[#3a3e47] rounded py-2 px-1 text-white text-[10px] focus:border-accent focus:outline-none font-mono leading-none"
          />
        </div>

        {/* Execute Button */}
        <button
          onClick={executeQuery}
          disabled={isExecuting}
          className="bg-[#1E80FF] hover:bg-[#1a70e0] text-white rounded py-1 text-[10px] flex items-center justify-center font-medium transition-colors disabled:opacity-50"
        >
          {isExecuting ? (
            <>
              <Processing /> Executing...
            </>
          ) : (
            "Execute Query"
          )}
        </button>
      </div>

      {/* Results Section */}
      <div className="flex-1 overflow-auto bg-[#1a1d23] rounded border border-[#2a2e37] p-1">
        <h4 className="text-[10px] font-semibold text-[#848e9c] mb-1">
          Results
        </h4>
        {jobId && (
          <div className="flex justify-between text-[9px]">
            <span className="text-[#848e9c]">Prove account Job ID:</span>
            {jobId ? (
              <a
                href={`https://silvascan.io/testnet/agent-job/${jobId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#1E80FF] hover:underline"
              >
                {shortenString(jobId ?? "", 10)}
              </a>
            ) : (
              <span className="font-medium">-</span>
            )}
          </div>
        )}
        {proof && (
          <div className="flex justify-between text-[9px]">
            <span className="text-[#848e9c]">Proof:</span>
            {proof !== "Calculating proof..." && (
              <a
                href={daUrl(proof ?? "")}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-[#1E80FF] hover:underline"
              >
                {shortenString(proof ?? "", 10)}
              </a>
            )}
            {proof === "Calculating proof..." && (
              <span className="font-medium">{proof}</span>
            )}
          </div>
        )}

        {isExecuting && (
          <div className="flex items-center justify-center h-full">
            <div className="text-[10px] text-[#848e9c]">Executing query...</div>
          </div>
        )}

        {error && !isExecuting && (
          <div className="text-[10px] text-[#f6465d] p-1 bg-[#2a1a1d] rounded">
            {error}
          </div>
        )}

        {results && !isExecuting && !error && (
          <div className="text-[9px]">
            {/* Table Headers */}
            {results.length > 0 && (
              <div className="grid grid-cols-4 gap-1 mb-0.5 font-medium text-[#848e9c]">
                {Object.keys(results[0]).map((key) => (
                  <div key={key} className="truncate">
                    {key}
                  </div>
                ))}
              </div>
            )}

            {/* Table Rows */}
            {results.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-4 gap-1 py-0.5 border-t border-[#2a2e37] text-white"
              >
                {Object.values(row).map((value: any, colIndex) => (
                  <div key={colIndex} className="truncate">
                    {String(value)}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {!results && !isExecuting && !error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-[10px] text-[#848e9c]">
              Execute a query to see results
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
