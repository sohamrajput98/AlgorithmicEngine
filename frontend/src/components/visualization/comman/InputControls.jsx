import React, { useState } from 'react';
import { FiRefreshCw } from 'react-icons/fi';

// Helper to generate a random array
const generateRandomArray = () => {
  const size = Math.floor(Math.random() * 8) + 5; // 5-12 elements
  return Array.from({ length: size }, () => Math.floor(Math.random() * 50) + 1);
};

// Helper to get the initial state from the algorithm's default inputs
const getInitialInputs = (algorithm) => {
  const initialInputs = {};
  if (!algorithm || !algorithm.inputs) return initialInputs;
  algorithm.inputs.forEach(input => {
    initialInputs[input.name] = Array.isArray(input.default)
      ? input.default.join(', ')
      : input.default;
  });
  return initialInputs;
};

export function InputControls({ algorithm, onUpdate }) {
  // The state is now initialized directly from the prop.
  // The 'key' prop in the parent will ensure this component remounts with fresh state when the algorithm changes.
  const [inputs, setInputs] = useState(() => getInitialInputs(algorithm));

  const handleInputChange = (name, value) => {
    setInputs(prev => ({ ...prev, [name]: value }));
  };

  const handleRandomize = () => {
    const arrayInput = algorithm.inputs.find(i => i.type === 'array');
    if (arrayInput) {
      const randomArray = generateRandomArray();
      setInputs(prev => ({ ...prev, [arrayInput.name]: randomArray.join(', ') }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!algorithm || !algorithm.inputs) return;

    const parsedInputs = {};
    algorithm.inputs.forEach(input => {
      const value = inputs[input.name];
      if (input.type === 'array') {
        parsedInputs[input.name] = String(value).split(',').map(s => Number(s.trim())).filter(n => !isNaN(n));
      } else if (input.type === 'number') {
        parsedInputs[input.name] = Number(value);
      } else {
        parsedInputs[input.name] = value;
      }
    });
    onUpdate(parsedInputs);
  };

  if (!algorithm || !algorithm.inputs) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-800 p-4 rounded-xl shadow-md space-y-4">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        {algorithm.inputs.map(input => (
          <div key={input.name} className="flex-1 w-full">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              {input.label || input.name.charAt(0).toUpperCase() + input.name.slice(1)}
            </label>
            <input
              type={input.type === 'array' ? 'text' : 'number'}
              value={inputs[input.name] || ''}
              onChange={(e) => handleInputChange(input.name, e.target.value)}
              className="w-full bg-gray-900 text-white rounded-md p-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-3">
        {algorithm.inputs.some(i => i.type === 'array') && (
           <button
            type="button"
            onClick={handleRandomize}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gray-700 hover:bg-gray-600"
          >
            <FiRefreshCw size={14} /> Randomize
          </button>
        )}
        <button
          type="submit"
          className="flex-1 px-3 py-1.5 text-white font-semibold rounded-lg shadow-md transition-all duration-300 bg-gradient-to-r from-[#6b21a8] to-[#4338ca] hover:opacity-90"
        >
          Update & Run
        </button>
      </div>
    </form>
  );
}