import React from "react";

export default function Controls({
  selectedAlgo,
  setSelectedAlgo,
  rawInput,
  setRawInput,
  onApplyInput,
  onRandomize,
  isPlaying,
  onPlay,
  onPause,
  onStepForward,
  onStepBack,
  onReset,
  speedMs,
  setSpeedMs,
  comparisonMode,
  setComparisonMode,
  notesOpen,
  setNotesOpen,
  handleAiHint,
  currentStepIdx,
  totalSteps,
  isInline = false, // renders smaller inline controls if true
}) {
  const baseClass = isInline
    ? "px-2 py-1 text-sm rounded bg-gray-700 text-white"
    : "px-3 py-2 rounded bg-gray-800 text-white";

  return (
    <div className={`flex flex-wrap gap-2 items-center justify-center ${isInline ? "mt-2" : "mb-5"}`}>
      {!isInline && (
        <>
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value)}
            className={`${baseClass} border border-gray-600`}
          >
            <option value="bubble-sort">Bubble Sort</option>
            <option value="two-pointers">Two Pointers</option>
            <option value="binary-search">Binary Search</option>
          </select>

          <input
            type="text"
            placeholder="Comma-separated input (e.g. 5,3,8)"
            value={rawInput}
            onChange={(e) => setRawInput(e.target.value)}
            className={`${baseClass} w-64 border border-gray-600`}
          />
          <button onClick={onApplyInput} className={`${baseClass} bg-blue-600 hover:bg-blue-700`}>
            Apply
          </button>
          <button onClick={() => onRandomize()} className={`${baseClass} bg-green-600 hover:bg-green-700`}>
            Randomize
          </button>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300 mr-1">Speed</label>
            <input
              type="range"
              min="100"
              max="1200"
              step="50"
              value={speedMs}
              onChange={(e) => setSpeedMs(Number(e.target.value))}
              className="w-36"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-300">Compare</label>
            <input
              type="checkbox"
              checked={comparisonMode}
              onChange={(e) => setComparisonMode(e.target.checked)}
            />
          </div>

          <button onClick={() => setNotesOpen((s) => !s)} className={`${baseClass} bg-indigo-600 hover:bg-indigo-700`}>
            Notes
          </button>
          <button onClick={handleAiHint} className={`${baseClass} bg-purple-600 hover:bg-purple-700`}>
            AI Hint
          </button>
        </>
      )}

      {/* Play / Pause / Step / Reset */}
      <button
        onClick={onPlay}
        className={`${baseClass} ${isPlaying ? "bg-gray-600" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        Play
      </button>
      <button
        onClick={onPause}
        className={`${baseClass} bg-yellow-600 hover:bg-yellow-700`}
      >
        Pause
      </button>
      <button onClick={onStepForward} className={`${baseClass} bg-green-600 hover:bg-green-700`}>
        Step →
      </button>
      <button onClick={onStepBack} className={`${baseClass} bg-green-600 hover:bg-green-700`}>
        ← Step
      </button>
      <button onClick={onReset} className={`${baseClass} bg-red-600 hover:bg-red-700`}>
        Reset
      </button>

      {isInline && (
        <div className="text-sm text-gray-300 ml-2">
          Step: {currentStepIdx + 1} / {totalSteps}
        </div>
      )}
    </div>
  );
}
