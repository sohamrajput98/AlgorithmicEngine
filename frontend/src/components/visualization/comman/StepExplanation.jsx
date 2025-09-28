import React from "react";

// named export
export function StepExplanation({ step = {}, index = 0, total = 0 }) {
  // Accept either a string or the step object
  const description =
    typeof step === "string" ? step : (step && step.description) || "No step description.";

  const arraySnapshot = (step && step.array) ? step.array.join(", ") : "";

  return (
    <div className="bg-gray-800 rounded-xl p-4 shadow-inner text-gray-200">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-white">Step Explanation</h3>
        <div className="text-sm text-gray-400">{total ? `${index + 1} / ${total}` : ""}</div>
      </div>
      <p className="text-sm text-gray-300 mb-2">{description}</p>
      {arraySnapshot && (
        <div className="text-xs text-gray-400">Array: [{arraySnapshot}]</div>
      )}
    </div>
  );
}
