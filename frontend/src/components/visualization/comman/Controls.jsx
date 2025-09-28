import React from "react";

/**
 * Controls UI (named export)
 * Props:
 *  - isPlaying (bool)
 *  - onPlay, onPause, onReset, onForward, onRewind (functions)
 *  - speed, setSpeed (ms)
 */

export function Controls({
  isPlaying,
  onPlay,
  onPause,
  onReset,
  onForward,
  onRewind,
  speed,
  setSpeed,
}) {
  return (
    <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-3 rounded-2xl shadow-md flex flex-col gap-3">
      {/* Button row */}
      <div className="flex items-center justify-center gap-3">
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="px-3 py-2 rounded-lg text-white bg-gradient-to-r from-green-500 to-teal-400 hover:opacity-90"
          title="Play / Pause"
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <button
          onClick={onRewind}
          className="px-3 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90"
          title="Rewind"
        >
          ⬅
        </button>

        <button
          onClick={onForward}
          className="px-3 py-2 rounded-lg text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:opacity-90"
          title="Forward"
        >
          ➡
        </button>

        <button
          onClick={onReset}
          className="px-3 py-2 rounded-lg text-white bg-gradient-to-r from-red-600 to-red-400 hover:opacity-90"
          title="Reset"
        >
          ⟲
        </button>
      </div>

      {/* Speed slider */}
      <div className="flex items-center gap-3 px-2">
        <label className="text-sm text-gray-300">Speed</label>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={speed}
          onChange={(e) => setSpeed(Number(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-gray-300 w-12 text-right">{speed}ms</div>
      </div>
    </div>
  );
}
