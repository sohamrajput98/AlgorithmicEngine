import React, { useEffect, useMemo, useState } from "react";
import ArrayBlock from "./comman/ArrayBlock";
import Controls from "./comman/Controls";
import StepExplanation from "./comman/StepExplanation";
import NotesPanel from "./comman/NotesPanel";
import { bubbleSortSteps, twoPointersSteps, binarySearchSteps } from "./utils/algorithm";
import { aiResponses } from "./utils/aiResponses";

const algorithmMap = {
  "bubble-sort": bubbleSortSteps,
  "two-pointers": twoPointersSteps,
  "binary-search": binarySearchSteps,
};

export default function VisualizerWindow() {
  const [selectedAlgo, setSelectedAlgo] = useState("bubble-sort");
  const [rawInput, setRawInput] = useState("");
  const [baseArray, setBaseArray] = useState([5, 3, 8, 4, 2]);
  const [steps, setSteps] = useState([]);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(500);
  const [notesOpen, setNotesOpen] = useState(true);
  const [notes, setNotes] = useState(() => localStorage.getItem("visualizer.notes") || "");
  const [aiText, setAiText] = useState("");
  const [comparisonMode, setComparisonMode] = useState(false);

  // Compute steps whenever algorithm or array changes
  useEffect(() => {
    const fn = algorithmMap[selectedAlgo];
    const parsedArray = Array.isArray(baseArray) ? baseArray.map(v => Number(v)) : [];
    const computedSteps = fn(parsedArray);
    setSteps(computedSteps.length ? computedSteps : [parsedArray.map(v => ({ value: v }))]);
    setCurrentStepIdx(0);
    setIsPlaying(false);
  }, [selectedAlgo, baseArray]);

  // Play timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setCurrentStepIdx(prev => {
        if (prev < steps.length - 1) return prev + 1;
        clearInterval(timer);
        return prev;
      });
    }, speedMs);
    return () => clearInterval(timer);
  }, [isPlaying, steps, speedMs]);

  // Handlers
  const handleApplyInput = () => {
    if (!rawInput.trim()) return;
    const arr = rawInput
      .split(",")
      .map(s => s.trim())
      .filter(Boolean)
      .map(n => {
        const parsed = Number(n);
        return Number.isNaN(parsed) ? n : parsed;
      });
    setBaseArray(arr);
  };

  const handleRandomize = (len = 8, max = 50) => {
    const arr = Array.from({ length: len }, () => Math.floor(Math.random() * max) + 1);
    setBaseArray(arr);
    setRawInput(arr.join(","));
  };

  const handleStepForward = () => {
    setCurrentStepIdx(s => Math.min(s + 1, steps.length - 1));
    setIsPlaying(false);
  };
  const handleStepBack = () => {
    setCurrentStepIdx(s => Math.max(s - 1, 0));
    setIsPlaying(false);
  };
  const handleReset = () => {
    setCurrentStepIdx(0);
    setIsPlaying(false);
  };

  const handleAiHint = () => {
    setAiText(aiResponses[selectedAlgo] || "No hint available for this algorithm.");
  };

  const currentStep = useMemo(() => {
    if (!steps || steps.length === 0) return baseArray.map(v => ({ value: v }));
    return steps[currentStepIdx] || steps[0];
  }, [steps, currentStepIdx, baseArray]);

  useEffect(() => {
    localStorage.setItem("visualizer.notes", notes);
  }, [notes]);

  return (
    <div className="min-h-[70vh] w-full p-6">
      <div className="flex flex-col items-center mb-6">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">Algorithm Visualizer</h1>
        <p className="text-sm text-gray-300">Single interactive window — select algorithm, feed input, play steps.</p>
      </div>

      {/* Top Controls */}
      <Controls
        selectedAlgo={selectedAlgo}
        setSelectedAlgo={setSelectedAlgo}
        rawInput={rawInput}
        setRawInput={setRawInput}
        onApplyInput={handleApplyInput}
        onRandomize={handleRandomize}
        isPlaying={isPlaying}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onStepForward={handleStepForward}
        onStepBack={handleStepBack}
        onReset={handleReset}
        speedMs={speedMs}
        setSpeedMs={setSpeedMs}
        comparisonMode={comparisonMode}
        setComparisonMode={setComparisonMode}
        notesOpen={notesOpen}
        setNotesOpen={setNotesOpen}
        handleAiHint={handleAiHint}
      />

      {/* Main content */}
      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[1fr,320px] gap-6">
        {/* Visualization panel */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg p-6 shadow-lg">
          <div className="h-64 flex items-end justify-center gap-3 transition-all">
            {currentStep.map((cell, i) => (
              <ArrayBlock key={i} value={cell.value} highlight={cell.highlight} index={i} />
            ))}
          </div>

          <div className="mt-6">
            <Controls
              isPlaying={isPlaying}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onStepForward={handleStepForward}
              onStepBack={handleStepBack}
              onReset={handleReset}
              currentStepIdx={currentStepIdx}
              totalSteps={steps.length}
              isInline // separate prop to render smaller inline controls
            />
          </div>

          <div className="mt-4 text-sm text-gray-300 flex justify-between">
            <div>Step: {currentStepIdx + 1} / {Math.max(steps.length, 1)}</div>
            <div>Algorithm: <span className="font-semibold">{selectedAlgo}</span></div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-4">
          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white">Info</h3>
            <p className="text-sm text-gray-300 mt-2">
              {selectedAlgo === "bubble-sort" && "Bubble Sort • Time: O(n²) • Space: O(1)"}
              {selectedAlgo === "two-pointers" && "Two Pointers • Typical: O(n) • Space: O(1)"}
              {selectedAlgo === "binary-search" && "Binary Search • Time: O(log n) • Space: O(1)"}
            </p>
          </div>

          <StepExplanation currentStepIndex={currentStepIdx} steps={steps} />

          {notesOpen && <NotesPanel notes={notes} onChange={setNotes} />}

          <div className="p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold text-white">AI Hint</h3>
            <p className="text-sm text-gray-300 mt-2">{aiText || "Click AI Hint to load a quick explanation."}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
