import React, { useState, useEffect } from "react";

/**
 * NotesPanel
 * - algorithm: name used for localStorage key
 * - draggable: if true render as fixed draggable overlay
 * - onClose: called when user wants to close (for overlay)
 * - onMakeDraggable: callback to request switching modes (used by parent)
 */
export function NotesPanel({ algorithm = "notes", draggable = false, onClose, onMakeDraggable }) {
  const key = `visualizer.notes.${algorithm}`;
  const [notes, setNotes] = useState(() => localStorage.getItem(key) || "");
  const [position, setPosition] = useState({ top: 140, left: 120 });
  const [dragging, setDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);

  useEffect(() => {
    localStorage.setItem(key, notes);
  }, [notes, key]);

  // drag handlers (simple)
  const onMouseDown = (e) => {
    if (!draggable) return;
    setDragging(true);
    e.currentTarget.dataset.offsetX = e.clientX - position.left;
    e.currentTarget.dataset.offsetY = e.clientY - position.top;
  };
  const onMouseMove = (e) => {
    if (!dragging) return;
    const offsetX = Number(e.currentTarget.dataset.offsetX || 0);
    const offsetY = Number(e.currentTarget.dataset.offsetY || 0);
    setPosition({ left: e.clientX - offsetX, top: e.clientY - offsetY });
  };
  const onMouseUp = () => setDragging(false);

  const handleDelete = () => {
    setNotes("");
    localStorage.removeItem(key);
  };

  return (
    <>
      {draggable ? (
        <div
          className={`fixed z-50 bg-gray-900 text-white rounded-xl shadow-2xl w-80 ${minimized ? "h-12" : ""}`}
          style={{ top: position.top, left: position.left }}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
        >
          <div
            className="flex items-center justify-between p-2 cursor-move"
            onMouseDown={onMouseDown}
            onMouseUp={onMouseUp}
          >
            <div className="font-semibold">Notes — {algorithm}</div>
            <div className="flex gap-2">
              <button onClick={() => setMinimized((s) => !s)} className="px-2">—</button>
              <button onClick={handleDelete} className="px-2 text-red-400">🗑</button>
              <button onClick={onClose} className="px-2">✕</button>
            </div>
          </div>

          {!minimized && (
            <div className="p-3">
              <textarea
                className="w-full h-40 p-2 rounded bg-gray-800 text-white resize-none"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Write notes..."
              />
              <div className="flex gap-2 mt-2">
                <button onClick={() => onMakeDraggable && onMakeDraggable(false)} className="px-3 py-1 bg-indigo-600 rounded">Dock</button>
                <button onClick={handleDelete} className="px-3 py-1 bg-red-600 rounded">Delete</button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-xl shadow-md">
          <div className="flex justify-between items-center mb-2">
            <div className="font-semibold text-white">Notes — {algorithm}</div>
            <div className="flex gap-2">
              <button onClick={() => onMakeDraggable && onMakeDraggable(true)} className="px-2 py-1 bg-purple-600 rounded text-white">Open as overlay</button>
            </div>
          </div>
          <textarea
            className="w-full h-36 p-2 rounded bg-gray-900 text-white resize-none"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Write notes..."
          />
          <div className="flex gap-2 mt-2">
            <button onClick={() => setNotes(notes)} className="px-3 py-1 bg-indigo-600 rounded text-white">Save</button>
            <button onClick={handleDelete} className="px-3 py-1 bg-red-600 rounded text-white">Delete</button>
          </div>
        </div>
      )}
    </>
  );
}
