import { useState } from 'react';
import QuizApp from '../components/QuizApp';

// --- QUIZ DATA IMPORTS ---
import os1 from '../quizzes/os_quiz/os1.json';
import os2 from '../quizzes/os_quiz/os2.json';
import os3 from '../quizzes/os_quiz/os3.json';
import os4 from '../quizzes/os_quiz/os4.json';
import os5 from '../quizzes/os_quiz/os5.json';
import dbms1 from '../quizzes/dbms_quiz/dbms1.json';
import dbms2 from '../quizzes/dbms_quiz/dbms2.json';
import dbms3 from '../quizzes/dbms_quiz/dbms3.json';
import dbms4 from '../quizzes/dbms_quiz/dbms4.json';
import dbms5 from '../quizzes/dbms_quiz/dbms5.json';
import cn1 from '../quizzes/cn_quiz/cn1.json';
import cn2 from '../quizzes/cn_quiz/cn2.json';
import cn3 from '../quizzes/cn_quiz/cn3.json';
import cn4 from '../quizzes/cn_quiz/cn4.json';
import cn5 from '../quizzes/cn_quiz/cn5.json';
import aptitude1 from '../quizzes/aptitude_quiz/aptitude1.json';
import aptitude2 from '../quizzes/aptitude_quiz/aptitude2.json';
import aptitude3 from '../quizzes/aptitude_quiz/aptitude3.json';
import aptitude4 from '../quizzes/aptitude_quiz/aptitude4.json';
import aptitude5 from '../quizzes/aptitude_quiz/aptitude5.json';
import english1 from '../quizzes/english_quiz/english1.json';
import english2 from '../quizzes/english_quiz/english2.json';
import english3 from '../quizzes/english_quiz/english3.json';
import english4 from '../quizzes/english_quiz/english4.json';
import english5 from '../quizzes/english_quiz/english5.json';

const subjects = {
  os: [os1, os2, os3, os4, os5],
  dbms: [dbms1, dbms2, dbms3, dbms4, dbms5],
  cn: [cn1, cn2, cn3, cn4, cn5],
  aptitude: [aptitude1, aptitude2, aptitude3, aptitude4, aptitude5],
  english: [english1, english2, english3, english4, english5],
};

export default function QuizSelection() {
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedQuiz, setSelectedQuiz] = useState('');
  const [timer, setTimer] = useState(15);
  const [startQuiz, setStartQuiz] = useState(false);

  const handleStart = () => {
    if (selectedSubject && selectedQuiz) setStartQuiz(true);
    else alert('Select both subject and quiz number.');
  };

  const handleRestart = () => {
    setStartQuiz(false);
    setSelectedSubject('');
    setSelectedQuiz('');
  };

  if (startQuiz) {
    const quizFile = subjects[selectedSubject][parseInt(selectedQuiz) - 1];
    return <QuizApp quizData={quizFile} initialTime={timer} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg p-6 sm:p-8">
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-2">
          Test Your Knowledge
        </h1>
        <p className="text-slate-400 text-center mb-8">Select a quiz to begin</p>

        <div className="space-y-6">
          {/* Subject Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-400">Subject</label>
            <div className="relative">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                <option value="">-- Select Subject --</option>
                {Object.keys(subjects).map((sub) => (
                  <option key={sub} value={sub}>{sub.toUpperCase()}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Quiz Number Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-400">Quiz Number</label>
            <div className="relative">
              <select
                value={selectedQuiz}
                onChange={(e) => setSelectedQuiz(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                <option value="">-- Select Quiz --</option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>{`Quiz ${num}`}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Timer Selector */}
          <div>
            <label className="block mb-2 text-sm font-medium text-slate-400">Timer (minutes)</label>
            <div className="relative">
              <select
                value={timer}
                onChange={(e) => setTimer(parseInt(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg py-3 pl-4 pr-10 text-slate-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 appearance-none"
              >
                {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button onClick={handleStart} className="w-full gradient-button">
            Start Quiz
          </button>
        </div>
      </div>
    </div>
  );
}