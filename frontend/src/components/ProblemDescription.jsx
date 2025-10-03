import React from 'react';

const StarIcon = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className={className}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
  </svg>
);

// StarRating component logic is preserved, using the SVG icon.
const StarRating = ({ stars = 0 }) => (
  <div className="flex items-center gap-1">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} className={`w-5 h-5 transition-colors ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-600 fill-transparent'}`} />
    ))}
  </div>
);

export const ProblemDescription = ({ problem, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100 border border-gray-700 animate-pulse">
        <div className="h-8 bg-gray-700/50 rounded w-3/4 mb-5"></div>
        <div className="h-6 bg-gray-700/50 rounded w-1/2 mb-8"></div>
        <div className="space-y-4">
          <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-700/50 rounded w-full"></div>
          <div className="h-4 bg-gray-700/50 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100 border border-red-500/30">
        <h2 className="text-2xl font-bold text-red-400 mb-2">Error</h2>
        <p className="text-red-300">Could not load problem details. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-900 rounded-2xl shadow-xl text-gray-100 border border-gray-700">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4 tracking-wide">{problem.title}</h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm">
          <StarRating stars={problem.stars} />
          <div className="hidden sm:block h-5 border-l border-gray-600/50"></div>
          <div className="flex flex-wrap gap-2">
            {problem.tags?.map(tag => (
             <span
  key={tag}
  className="px-2 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
  style={{
    background: 'linear-gradient(135deg, #bc7ffeff, #af5effff, #551f8aff, #330561ff)',
    border: '1px solid #9441e3ff',
  }}
>
  {tag}
</span>
            ))}
          </div>
        </div>

        {/* Gradient separator line */}
        <div
  className="my-6 h-[2px] w-full rounded-full"
  style={{
    background: 'linear-gradient(to right, #a859f7ff, #5aabf8ff, #f940d7ff, #f13434ff)',
  }}
></div>
      </div>

      {/* Body */}
      <div className="prose prose-sm md:prose-base prose-invert max-w-none text-gray-300 prose-code:text-pink-300 prose-code:bg-gray-800 prose-code:p-1 prose-code:rounded-md prose-pre:bg-transparent prose-pre:p-0">
        <div dangerouslySetInnerHTML={{ __html: problem.statement.replace(/\n/g, '<br />') }} />
      </div>
    </div>
  );
};