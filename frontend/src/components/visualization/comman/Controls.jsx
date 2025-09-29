import React from "react";
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaUndo } from 'react-icons/fa';

const speedSettings = [
  { label: '0.25x', value: 1500 },
  { label: '0.5x', value: 1000 },
  { label: '0.75x', value: 750 },
  { label: '1x', value: 500 },
  { label: '1.25x', value: 350 },
  { label: '1.5x', value: 250 },
  { label: '1.75x', value: 150 },
  { label: '2x', value: 100 },
];

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
  const currentSpeedIndex = speedSettings.findIndex(s => s.value === speed);
  const sliderValue = currentSpeedIndex !== -1 ? currentSpeedIndex : 3;

  const handleSpeedChange = (e) => {
    const newIndex = Number(e.target.value);
    const newSpeed = speedSettings[newIndex]?.value;
    if (newSpeed) {
      setSpeed(newSpeed);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#1f2937] to-[#111827] p-3 rounded-xl shadow-lg flex flex-col gap-4 border border-gray-700">
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button onClick={onRewind} className="p-3 text-white rounded-full bg-gray-700 hover:bg-purple-600 transition-colors duration-200" title="Rewind">
          <FaStepBackward />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="p-4 text-white rounded-full bg-gradient-to-r from-[#6b21a8] to-[#4338ca] hover:opacity-90 transition-opacity shadow-md text-xl"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
        <button onClick={onForward} className="p-3 text-white rounded-full bg-gray-700 hover:bg-purple-600 transition-colors duration-200" title="Forward">
          <FaStepForward />
        </button>
        <button onClick={onReset} className="p-3 text-white rounded-full bg-red-700 hover:bg-red-600 transition-colors duration-200" title="Reset">
          <FaUndo />
        </button>
      </div>
      <div className="flex items-center gap-3 px-2">
        <label className="text-sm font-medium text-gray-300">Speed</label>
        <input
          type="range"
          min="0"
          max={speedSettings.length - 1}
          step="1"
          value={sliderValue}
          onChange={handleSpeedChange}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer range-lg dark:bg-gray-600"
        />
        <div className="text-xs font-mono text-gray-300 w-16 text-center bg-gray-700 rounded-md py-1">
          {speedSettings[sliderValue]?.label || '1x'}
        </div>
      </div>
    </div>
  );
}