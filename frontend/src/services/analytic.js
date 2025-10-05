/**
 * @file analytic.js
 * @description Provides supplemental and utility functions for processing analytics data.
 */

const getSubmissionHistory = () => {
  const history = [];
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    let submissionCount = 0;
    if (Math.random() > (isWeekend ? 0.75 : 0.4)) {
      submissionCount = Math.floor(Math.random() * 8) + 1;
    }
    if (submissionCount > 0) {
      history.push({ date: date.toISOString().split('T')[0], count: submissionCount });
    }
  }
  return history;
};

const getProblemStats = () => [
    { difficulty: 1, accepted: 43 },
    { difficulty: 2, accepted: 26 },
    { difficulty: 3, accepted: 37 },
    { difficulty: 4, accepted: 17 },
    { difficulty: 5, accepted: 11 },
];

export const supplementalAnalytics = {
  problem_stats: getProblemStats(),
  submission_history: getSubmissionHistory(),
};
