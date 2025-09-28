import React, { useState } from "react";

// Default export for lazy import
export default function AIChatPanel({
  algorithm,
  query,
  setQuery,
  response,
  fetchResponse,
  collapsed = false,
  onToggleExpand,
  onOpenNotesTab,
}) {
  const [local, setLocal] = useState(query || "");

  const handleSend = async () => {
    if (!local.trim()) return;
    setQuery(local);
    await fetchResponse();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between">
        <div className="font-semibold text-white">AI — {algorithm}</div>
        <div className="flex gap-2">
          <button onClick={onOpenNotesTab} className="px-2 py-1 bg-purple-600 rounded text-white text-sm">Notes</button>
          <button onClick={onToggleExpand} className="px-2 py-1 bg-indigo-600 rounded text-white text-sm">
            {collapsed ? "Open" : "Min"}
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto mt-3 p-2 bg-gray-900 rounded">
        <div className="text-sm text-gray-300">{response || "Ask a question about this algorithm..."}</div>
      </div>

      <div className="mt-3 flex gap-2">
        <input
          value={local}
          onChange={(e) => setLocal(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
          className="flex-1 px-3 py-2 rounded bg-gray-800 text-white"
          placeholder="Ask about the algorithm..."
        />
        <button onClick={handleSend} className="px-3 py-2 bg-gradient-to-r from-green-500 to-teal-400 rounded text-white">Send</button>
      </div>
    </div>
  );
}
