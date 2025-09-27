import React from "react";

/**
 * StepExplanation
 * - steps: array returned from algorithm.js (each step can include description)
 * - currentStepIndex: index
 *
 * We show either the description in the current step or a generated text.
 */
export default function StepExplanation({ currentStepIndex = 0, steps = [] }) {
  const step = steps[currentStepIndex] || [];
  // if step is an array of cells with `description` on the root, use that
  const desc = step?.description || step?.[0]?.description || null;

  return (
    <div className="p-4 bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white">Step-by-step</h3>
      <div className="text-sm text-gray-300 mt-2">
        {desc ? (
          <p>{desc}</p>
        ) : (
          <>
            {Array.isArray(step) && step.length ? (
              <ol className="list-decimal list-inside space-y-1">
                <li className="text-gray-300">Active highlights show the operation (compare/swap/pointer).</li>
                <li className="text-gray-300">Use Play to animate through these steps.</li>
              </ol>
            ) : (
              <p className="text-gray-400">Step details will appear here when you play the animation.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
