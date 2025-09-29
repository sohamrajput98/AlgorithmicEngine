import React, { useState, Suspense, lazy, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { algorithms, getAlgorithmSteps } from "./utils/algorithmService";
import { getAIResponse } from "./utils/aiResponses";

import { VisualizerHeader } from "./comman/VisualizerHeader";
import { InputControls } from './comman/InputControls';
import { ArrayBlock } from "./comman/ArrayBlock";
import { StepExplanation } from "./comman/StepExplanation";
import { Controls } from "./comman/Controls";
import { NotesPanel } from "./comman/NotesPanel";
import { Charts } from "./comman/VCharts";

const AIChatPanel = lazy(() => import("./comman/AIChatPanel"));

// Helper to get default inputs for an algorithm
const getDefaultInputs = (algorithm) => {
  const defaultInputs = {};
  if (!algorithm || !algorithm.inputs) return defaultInputs;
  algorithm.inputs.forEach(input => {
    defaultInputs[input.name] = Array.isArray(input.default) ? [...input.default] : input.default;
  });
  return defaultInputs;
};

export const VisualizerWindow = () => {
  const categories = Object.keys(algorithms);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(algorithms[categories[0]][0].key);

  const [inputValues, setInputValues] = useState(() => getDefaultInputs(algorithms[categories[0]][0]));
  const [array, setArray] = useState(inputValues.array || []);
  const [stepIndex, setStepIndex] = useState(0);
  const [speed, setSpeed] = useState(500);
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);

  const [aiQuery, setAiQuery] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [rightTab, setRightTab] = useState("ai");
  const [notesDraggable, setNotesDraggable] = useState(false);
  const [notesOpen, setNotesOpen] = useState(true);

  const currentAlgorithm = algorithms[selectedCategory]?.find(a => a.key === selectedAlgorithm) || {};
  const algorithmName = currentAlgorithm.name || "Select an Algorithm";

  const handleAlgorithmChange = (newKey) => {
    const newAlgo = algorithms[selectedCategory]?.find(a => a.key === newKey) || {};
    setSelectedAlgorithm(newKey);
    setInputValues(getDefaultInputs(newAlgo));
  };

  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);
    const newAlgo = algorithms[newCategory]?.[0] || {};
    setSelectedAlgorithm(newAlgo.key);
    setInputValues(getDefaultInputs(newAlgo));
  };

  const { data: steps = [], isLoading } = useQuery({
    queryKey: ["algorithmSteps", selectedAlgorithm, inputValues],
    queryFn: () => getAlgorithmSteps(selectedAlgorithm, inputValues),
    staleTime: Infinity,
    enabled: !!(inputValues.array || inputValues.items),
    onSuccess: (newSteps) => {
      pause();
      setStepIndex(0);
      const initialArray = newSteps?.[0]?.array || inputValues.array || [];
      setArray([...initialArray]);
    },
  });

  const currentStep = steps[stepIndex] || {};
  const activeIndices = currentStep.activeIndices || [];

  const play = async () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    let currentIndex = stepIndex;

    while (isPlayingRef.current && currentIndex < steps.length - 1) {
      await new Promise((r) => setTimeout(r, speed));
      if (!isPlayingRef.current) break;

      currentIndex++;
      const nextStep = steps[currentIndex];
      if (nextStep?.array) setArray([...nextStep.array]);
      setStepIndex(currentIndex);
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
    const initialArray = steps?.[0]?.array || inputValues.array || [];
    setArray([...initialArray]);
  };

  const forward = () => {
    pause();
    setStepIndex((s) => {
      const next = Math.min(s + 1, steps.length - 1);
      if (steps[next]?.array) setArray([...steps[next].array]);
      return next;
    });
  };

  const rewind = () => {
    pause();
    setStepIndex((s) => {
      const prev = Math.max(s - 1, 0);
      if (steps[prev]?.array) setArray([...steps[prev].array]);
      return prev;
    });
  };

  const fetchAIResponse = async () => {
    const r = await getAIResponse(aiQuery, algorithmName);
    setAiResponse(r);
  };

  const handleMakeNotesDraggable = (shouldBeDraggable) => {
    setNotesDraggable(Boolean(shouldBeDraggable));
    setNotesOpen(!shouldBeDraggable);
  };

  const openNotesTab = () => {
    setRightTab("notes");
    setNotesOpen(true);
  };

  if (isLoading && !steps.length) return <div className="p-6 text-gray-400">Loading steps...</div>;

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white overflow-hidden">
      <main className="flex-grow flex flex-col md:flex-row gap-4 p-4 overflow-hidden">
        
        {/* LEFT: Visualizer Core (Now scrolls internally) */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto pr-2">
          <VisualizerHeader
            algorithmName={algorithmName}
            categories={categories}
            selectedCategory={selectedCategory}
            setSelectedCategory={handleCategoryChange}
            algorithms={algorithms}
            selectedAlgorithm={selectedAlgorithm}
            setSelectedAlgorithm={handleAlgorithmChange}
          />

          <InputControls
            key={selectedAlgorithm}
            algorithm={currentAlgorithm}
            onUpdate={(newInputs) => {
              setInputValues(newInputs);
            }}
          />

          <div className="flex flex-wrap gap-3 bg-gray-900 p-4 rounded-2xl shadow-inner min-h-[80px]">
            {array.map((v, i) => (
              <ArrayBlock key={i} index={i} value={v} isActive={activeIndices.includes(i)} />
            ))}
          </div>

          <StepExplanation step={currentStep} index={stepIndex} total={steps.length} />

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

          <Suspense fallback={<div className="text-gray-400">Loading chart...</div>}>
            <Charts data={array} />
          </Suspense>
        </div>

        {/* RIGHT: AI + Notes */}
        <div className="w-full md:w-[400px] lg:w-[450px] flex-shrink-0 flex flex-col gap-3">
          <div className="flex-shrink-0 flex items-center gap-1 p-1 bg-gray-900/50 rounded-lg border border-gray-700">
            <button
              onClick={() => setRightTab("ai")}
              className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${rightTab === "ai" ? "bg-gradient-to-r from-[#6b21a8] to-[#4338ca] text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}
            >
              AI
            </button>
            <button
              onClick={() => setRightTab("notes")}
              className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-all duration-300 ${rightTab === "notes" ? "bg-gradient-to-r from-[#6b21a8] to-[#4338ca] text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-300"}`}
            >
              Notes
            </button>
          </div>
          <div className="bg-gray-800 rounded-2xl p-4 shadow-lg flex-grow flex flex-col min-h-0">
            <Suspense fallback={<div className="text-gray-400">Loading...</div>}>
              {rightTab === "ai" && (
                <AIChatPanel
                  algorithm={algorithmName}
                  query={aiQuery}
                  setQuery={setAiQuery}
                  response={aiResponse}
                  fetchResponse={fetchAIResponse}
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
              {!notesOpen && notesDraggable && (
                <div className="text-sm text-gray-400 m-auto">Notes open as draggable overlay.</div>
              )}
            </Suspense>
          </div>
        </div>
      </main>

      {/* Draggable Notes Overlay */}
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