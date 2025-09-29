import React from 'react';
import { FiSend, FiEdit } from 'react-icons/fi';

/**
 * AIChatPanel Component (Restyled)
 * A styled chat panel for interacting with the AI.
 */
export function AIChatPanel({
  algorithm,
  query,
  setQuery,
  response,
  fetchResponse,
  onOpenNotesTab,
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      fetchResponse();
    }
  };

  const createNoteFromResponse = () => {
    if (response) {
      navigator.clipboard.writeText(response);
      alert("AI response copied to clipboard. Paste it in your notes!");
      onOpenNotesTab();
    }
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="flex-grow overflow-y-auto pr-2 mb-4">
        <h3 className="text-lg font-semibold mb-3 text-purple-300">Ask AI about {algorithm}</h3>
        {response ? (
          <div className="bg-gray-900/50 p-3 rounded-lg text-sm whitespace-pre-wrap border border-gray-700">
            {response}
          </div>
        ) : (
          <div className="text-gray-400 text-sm p-3 bg-gray-900/50 rounded-lg">
            Ask a question like "What is the time complexity?" or "Explain this step."
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2">
        {response && (
          <button
            onClick={createNoteFromResponse}
            className="flex items-center justify-center gap-2 w-full px-3 py-1.5 text-xs font-semibold bg-gray-700 text-white rounded-md hover:bg-gray-600 transition-colors"
          >
            <FiEdit />
            Create Note from Response
          </button>
        )}
        <div className="flex items-center gap-2">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Your question..."
            rows="2"
            className="flex-grow p-2 bg-gray-900 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
          />
          <button
            onClick={fetchResponse}
            className="p-3 self-stretch text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-[#6b21a8] to-[#4338ca] hover:opacity-90 disabled:opacity-50"
            title="Ask AI"
            disabled={!query}
          >
            <FiSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default AIChatPanel; // Keep the default export for lazy loading