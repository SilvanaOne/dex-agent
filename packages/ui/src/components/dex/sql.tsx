"use client";

import { useState } from "react";
import { agentSqlRequest } from "@dex-agent/lib";
import Processing from "./ui/processing";

const ALICE_PUBLIC_KEY = process.env.NEXT_PUBLIC_ALICE_PUBLIC_KEY;
interface SqlQueryProps {
  blockNumber: number;
  sequence: number;
}

export default function SqlQuery({ blockNumber, sequence }: SqlQueryProps) {
  const [sqlQuery, setSqlQuery] = useState<string>(
    `SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public' 
AND table_name = 'State'
ORDER BY 
  ordinal_position`
  );
  const [isExecuting, setIsExecuting] = useState<boolean>(false);
  const [results, setResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const executeQuery = async () => {
    setIsExecuting(true);
    setError(null);
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
      if (result.success) {
        setResults(result.data as any);
        setError(null);
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
            onClick={() =>
              insertTemplate(
                "SELECT * FROM orders WHERE operation = 'buy' ORDER BY timestamp DESC LIMIT 10;"
              )
            }
            className="flex-1 py-1 bg-[#02c076] hover:bg-[#02a76a] text-white rounded text-[10px] font-medium transition-colors"
          >
            Buy
          </button>
          <button
            onClick={() =>
              insertTemplate(
                "SELECT * FROM orders WHERE operation = 'sell' ORDER BY timestamp DESC LIMIT 10;"
              )
            }
            className="flex-1 py-1 bg-[#f6465d] hover:bg-[#e0364d] text-white rounded text-[10px] font-medium transition-colors"
          >
            Sell
          </button>
          <button
            onClick={() =>
              insertTemplate(
                "SELECT * FROM proofs ORDER BY timestamp DESC LIMIT 10;"
              )
            }
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
