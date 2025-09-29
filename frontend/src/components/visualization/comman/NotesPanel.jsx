import React, { useState, useRef } from "react";
import { FiTrash2, FiSave, FiMinimize2, FiMaximize2, FiCopy, FiChevronsDown } from 'react-icons/fi';

/**
 * NotesPanel Component
 * This version ensures the docked panel's height matches its container.
 */
export function NotesPanel({
  algorithm = "notes",
  draggable = false,
  onClose,
  onMakeDraggable,
}) {
  const key = `visualizer.notes.${algorithm}`;
  const [notes, setNotes] = useState(() => localStorage.getItem(key) || "");
  const [position, setPosition] = useState({ top: 150, left: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const dragRef = useRef(null);
  const offsetRef = useRef({ x: 0, y: 0 });

  const onMouseDown = (e) => {
    if (!draggable || !dragRef.current) return;
    document.body.style.userSelect = 'none';
    setIsDragging(true);
    const rect = dragRef.current.getBoundingClientRect();
    offsetRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    e.currentTarget.style.cursor = 'grabbing';
  };

  const onMouseMove = (e) => {
    if (!isDragging || !dragRef.current) return;
    let newTop = e.clientY - offsetRef.current.y;
    let newLeft = e.clientX - offsetRef.current.x;

    const rect = dragRef.current.getBoundingClientRect();
    const winWidth = window.innerWidth;
    const winHeight = window.innerHeight;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + rect.width > winWidth) newLeft = winWidth - rect.width;
    if (newTop + rect.height > winHeight) newTop = winHeight - rect.height;

    setPosition({ top: newTop, left: newLeft });
  };

  const onMouseUp = (e) => {
    document.body.style.userSelect = '';
    setIsDragging(false);
    if (e.currentTarget) e.currentTarget.style.cursor = 'move';
  };

  const handleSave = () => {
    localStorage.setItem(key, notes);
  };

  const handleDelete = () => {
    localStorage.removeItem(key);
    setNotes("");
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(notes);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value);
  };

  const saveButtonStyles = "flex-1 px-3 py-1.5 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-[#6b21a8] to-[#4338ca] hover:from-[#581c87] hover:to-[#3730a3] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-gray-800";
  const deleteButtonStyles = "flex-1 px-3 py-1.5 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-800";


  if (draggable) {
    return (
      <div
        ref={dragRef}
        className={`fixed z-50 rounded-xl shadow-2xl w-80 transition-all duration-300 backdrop-blur-sm ${minimized ? "h-12" : "h-auto"} bg-gray-900/50 border border-purple-500/30`}
        style={{ top: position.top, left: position.left }}
        onMouseMove={isDragging ? onMouseMove : undefined}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <div className="flex items-center justify-between p-2 cursor-move text-white" onMouseDown={onMouseDown}>
          <span className="font-semibold text-sm">Notes — {algorithm}</span>
          <div className="flex gap-2 items-center">
            <button onClick={() => onMakeDraggable && onMakeDraggable(false)} className="hover:text-purple-400" title="Dock Panel"><FiChevronsDown /></button>
            <button onClick={() => setMinimized((s) => !s)} className="hover:text-purple-400" title={minimized ? "Maximize" : "Minimize"}>{minimized ? <FiMaximize2 /> : <FiMinimize2 />}</button>
            <button onClick={onClose} className="hover:text-red-400" title="Close">✕</button>
          </div>
        </div>
        {!minimized && (
          <div className="p-3">
            <textarea
              className="w-full h-40 p-2 rounded bg-gray-800/80 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={notes}
              onChange={handleNotesChange}
              placeholder="Your notes..."
            />
            <div className="flex gap-3 mt-2">
              <button onClick={handleDelete} className={deleteButtonStyles}>Delete</button>
              <button onClick={handleSave} className={saveButtonStyles}>Save</button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // --- Docked Panel View (Corrected for matching height) ---
  return (
    <div className="flex flex-col h-full"> {/* ADDED: Flex container */}
      <div className="flex justify-between items-center mb-2 flex-shrink-0"> {/* ADDED: flex-shrink-0 */}
        <span className="font-semibold text-white">Notes — {algorithm}</span>
        <div className="flex gap-2">
          <button onClick={handleCopy} className="px-2 py-1 bg-gray-700 rounded text-white text-xs hover:bg-gray-600" title="Copy Notes">{showCopied ? 'Copied!' : 'Copy'}</button>
          <button onClick={() => onMakeDraggable && onMakeDraggable(true)} className="px-2 py-1 bg-purple-600 rounded text-white text-xs hover:bg-purple-500">Open as overlay</button>
        </div>
      </div>
      <textarea
        className="w-full flex-grow p-2 rounded bg-gray-900 text-white resize-none focus:outline-none focus:ring-2 focus:ring-purple-500" // CHANGED: h-36 to flex-grow
        value={notes}
        onChange={handleNotesChange}
        placeholder="Your notes..."
      />
      <div className="flex gap-3 mt-2 flex-shrink-0"> {/* ADDED: flex-shrink-0 */}
        <button onClick={handleDelete} className={deleteButtonStyles}>Delete</button>
        <button onClick={handleSave} className={saveButtonStyles}>Save</button>
      </div>
    </div>
  );
}