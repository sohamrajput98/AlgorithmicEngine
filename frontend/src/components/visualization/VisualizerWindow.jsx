import React, { useState, Suspense, lazy, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAlgorithmSteps } from "./utils/algorithmService";
import { getAIResponse } from "./utils/aiResponses";

import { ArrayBlock } from "./comman/ArrayBlock";
import { StepExplanation } from "./comman/StepExplanation";
import { Controls } from "./comman/Controls";
import { NotesPanel } from "./comman/NotesPanel";
import { Charts } from "./comman/Charts";

const AIChatPanel = lazy(() => import("./comman/AIChatPanel"));

const ALGORITHM_TYPES = {
  Sorting: ["Bubble Sort", "Insertion Sort", "Merge Sort"],
  Searching: ["Linear Search", "Binary Search"],
  "Two Pointers": ["Pair Sum", "Slow Fast"],
};

export const VisualizerWindow = () => {
  // UI state
  const [algorithmType, setAlgorithmType] = useState("Sorting");
  const [algorithmName, setAlgorithmName] = useState(ALGORITHM_TYPES["Sorting"][0]);
  const [baseArray, setBaseArray] = useState([5, 3, 8, 1, 2]);
  const [array, setArray] = useState([...baseArray]);
  const [stepIndex, setStepIndex] = useState(0);

  // controls
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  // AI & tabs
  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [rightTab, setRightTab] = useState("ai"); // "ai" or "notes"
  const [notesDraggable, setNotesDraggable] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true); // notes shown in panel by default

  // fetch steps (react-query) - synchronous function allowed
  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["algorithmSteps", algorithmName, array],
    queryFn: () => getAlgorithmSteps(algorithmName, array),
    retry: false,
  });

  // ai fetch
  const fetchAIResponse = async () => {
    const r = await getAIResponse(aiQuery, algorithmName);
    setAiResponse(r);
  };

  if (isLoading) return <div className="p-6 text-gray-400">Loading steps...</div>;

  const currentStep = steps[stepIndex] || {};
  const activeIndices = currentStep.activeIndices || [];

  // ---------- play/pause logic without useEffect ----------
  const play = async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);

    while (isPlayingRef.current && stepIndex < steps.length - 1) {
      // wait
      await new Promise((r) => setTimeout(r, speed));
      // advance
      setStepIndex((s) => {
        const next = Math.min(s + 1, steps.length - 1);
        // update array snapshot each step (so Charts and ArrayBlock reflect)
        if (steps[next] && Array.isArray(steps[next].array)) setArray([...steps[next].array]);
        return next;
      });
    }
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const pause = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
  };

  const reset = () => {
    pause();
    setStepIndex(0);
    setArray([...baseArray]); // reset to base
  };

  const forward = () => {
    pause();
    setStepIndex((s) => {
      const next = Math.min(s + 1, steps.length - 1);
      if (steps[next] && Array.isArray(steps[next].array)) setArray([...steps[next].array]);
      return next;
    });
  };

  const rewind = () => {
    pause();
    setStepIndex((s) => {
      const prev = Math.max(s - 1, 0);
      if (steps[prev] && Array.isArray(steps[prev].array)) setArray([...steps[prev].array]);
      return prev;
    });
  };

  // algorithm switching
  const handleTypeChange = (e) => {
    const t = e.target.value;
    setAlgorithmType(t);
    const first = ALGORITHM_TYPES[t][0];
    setAlgorithmName(first);
    setArray([...baseArray]);
    setStepIndex(0);
  };

  const handleAlgChange = (e) => {
    setAlgorithmName(e.target.value);
    setArray([...baseArray]);
    setStepIndex(0);
  };

  // Notes overlay mode toggler (parent controls)
  const handleMakeNotesDraggable = (shouldBeDraggable) => {
    setNotesDraggable(Boolean(shouldBeDraggable));
    // if opening as overlay, hide the embedded version
    if (shouldBeDraggable) setNotesOpen(false);
    else setNotesOpen(true);
  };

  // open notes tab from AI
  const openNotesTab = () => {
    setRightTab("notes");
    setNotesOpen(true);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 max-w-7xl mx-auto">
      {/* LEFT: visual + controls */}
      <div className="flex-1 space-y-6">
        {/* selection */}
        <div className="flex gap-3 mb-2">
          <select className="p-2 rounded bg-gray-700 text-white" value={algorithmType} onChange={handleTypeChange}>
            {Object.keys(ALGORITHM_TYPES).map((t) => <option key={t} value={t}>{t}</option>)}
          </select>

          <select className="p-2 rounded bg-gray-700 text-white" value={algorithmName} onChange={handleAlgChange}>
            {ALGORITHM_TYPES[algorithmType].map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* info */}
        <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white p-4 rounded-2xl shadow-lg">
          <h2 className="text-xl font-bold">{algorithmName}</h2>
          <p className="text-sm mt-1">Time: {currentStep.timeComplexity || "N/A"} | Space: {currentStep.spaceComplexity || "N/A"}</p>
          <p className="text-xs mt-1">{currentStep.description || "Step-by-step explanation below."}</p>
        </div>

        {/* array */}
        <div className="flex flex-wrap gap-3 bg-gray-900 p-4 rounded-2xl shadow-inner">
          {array.map((v, i) => <ArrayBlock key={i} index={i} value={v} isActive={activeIndices.includes(i)} />)}
        </div>

        {/* step explanation */}
        <StepExplanation step={currentStep} index={stepIndex} total={steps.length} />

        {/* controls */}
        <Controls
          isPlaying={isPlaying}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onForward={forward}
          onRewind={rewind}
          speed={speed}
          setSpeed={setSpeed}
        />

        {/* charts */}
        <Suspense fallback={<div className="text-gray-400">Loading chart...</div>}>
          <Charts data={array} />
        </Suspense>
      </div>

      {/* RIGHT: AI + Notes Tab Card */}
      <div className="w-full md:w-1/3 flex flex-col gap-3">
        {/* TAB HEADER */}
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setRightTab("ai")}
            className={`px-3 py-2 rounded-md ${rightTab === "ai" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}
          >
            AI
          </button>
          <button
            onClick={() => setRightTab("notes")}
            className={`px-3 py-2 rounded-md ${rightTab === "notes" ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" : "bg-gray-800 text-gray-200"}`}
          >
            Notes
          </button>

          {/* compact AI trigger (fixed small) */}
          <div className="ml-auto">
            <button className="px-2 py-1 bg-gradient-to-r from-green-500 to-teal-400 rounded text-white" onClick={() => setRightTab("ai")}>
              Open AI
            </button>
          </div>
        </div>

        {/* CARD BODY */}
        <div className="bg-gray-800 rounded-2xl p-4 shadow-lg min-h-[200px]">
          <Suspense fallback={<div className="text-gray-400">Loading AI...</div>}>
            {rightTab === "ai" && (
              <AIChatPanel
                algorithm={algorithmName}
                query={aiQuery}
                setQuery={setAiQuery}
                response={aiResponse}
                fetchResponse={fetchAIResponse}
                collapsed={false}
                onToggleExpand={() => {}}
                onOpenNotesTab={openNotesTab}
              />
            )}

            {rightTab === "notes" && !notesDraggable && notesOpen && (
              <NotesPanel
                algorithm={algorithmName}
                draggable={false}
                onClose={() => setNotesOpen(false)}
                onMakeDraggable={handleMakeNotesDraggable}
              />
            )}

            {/* if notes are draggable, we hide the embedded version and show overlay below */}
            {!notesOpen && notesDraggable && (
              <div className="text-sm text-gray-400">Notes open as draggable overlay.</div>
            )}
          </Suspense>
        </div>
      </div>

      {/* Draggable notes overlay (if enabled) */}
      {notesDraggable && (
        <NotesPanel
          algorithm={algorithmName}
          draggable={true}
          onClose={() => {
            setNotesDraggable(false);
            setNotesOpen(true);
          }}
          onMakeDraggable={handleMakeNotesDraggable}
        />
      )}
    </div>
  );
};
