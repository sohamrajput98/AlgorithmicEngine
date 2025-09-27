import React from "react";

/**
 * NotesPanel: simple textarea with value + onChange
 * - notes saved in parent via localStorage
 */
export default function NotesPanel({ notes = "", onChange = () => {} }) {
  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white">Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Write your notes here. Notes are stored locally in this browser."
        className="mt-2 w-full h-28 bg-gray-700 rounded p-2 text-sm text-white resize-none"
      />
      <div className="text-xs text-gray-400 mt-2">Saved locally in localStorage.</div>
    </div>
  );
}

