// src/pages/Visualizer.jsx
import React, { Suspense, lazy } from "react";

const VisualizerWindow = lazy(() =>
  import("../components/visualization/VisualizerWindow").then((mod) => ({
    default: mod.VisualizerWindow,
  }))
);

const Visualizer = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Algorithm Visualizer
      </h1>

      <Suspense
        fallback={
          <div className="animate-pulse p-6 bg-gray-800 rounded-lg text-gray-400">
            Loading visualizer...
          </div>
        }
      >
        <VisualizerWindow />
      </Suspense>
    </div>
  );
};

export default Visualizer;