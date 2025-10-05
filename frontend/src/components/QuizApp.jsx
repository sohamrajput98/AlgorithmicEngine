import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

// --- SUB-COMPONENT: Polished Score Ring ---
const ScoreRing = ({ score }) => {
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="relative w-36 h-36">
            <svg className="w-full h-full" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#6366F1" />
                    </linearGradient>
                </defs>
                <circle className="text-slate-700" strokeWidth="10" stroke="currentColor" fill="transparent" r={radius} cx="60" cy="60" />
                <motion.circle
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeLinecap="round"
                    stroke="url(#scoreGradient)"
                    fill="transparent"
                    r={radius}
                    cx="60"
                    cy="60"
                    transform="rotate(-90 60 60)"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />
            </svg>
            <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
            >
                <span className="text-3xl font-bold text-white">{`${score}%`}</span>
            </motion.div>
        </div>
    );
};


// --- MAIN QUIZ COMPONENT ---
const QuizApp = ({ quizData, initialTime = 10, onRestart }) => {
    // --- LOGIC: Unchanged. Your original logic is preserved. ---
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState(null);
    const [answers, setAnswers] = useState({});
    const [correct, setCorrect] = useState(0);
    const [wrong, setWrong] = useState(0);
    const [timer, setTimer] = useState(initialTime * 60);
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    setIsFinished(true);
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleAnswer = (idx) => {
        if (selectedAnswer !== null) return;
        const newAnswers = { ...answers, [currentQuestion]: idx };
        setAnswers(newAnswers);
        setSelectedAnswer(idx);
        if (idx === quizData[currentQuestion].answer) {
            setCorrect(correct + 1);
        } else {
            setWrong(wrong + 1);
        }
    };

    const handleNext = () => {
        if (currentQuestion < quizData.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(answers[currentQuestion + 1] ?? null);
        }
    };

    const handleSubmit = () => setIsFinished(true);

    const isLastQuestion = currentQuestion === quizData.length - 1;
    const progressPercentage = ((currentQuestion + 1) / quizData.length) * 100;

    // --- UI POLISHED: Results Screen ---
    if (isFinished) {
        const score = Math.round((correct / quizData.length) * 100);
        const attempted = Object.keys(answers).length;

        return (
            <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
                <motion.div 
                    className="w-full max-w-2xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg p-6 sm:p-8 text-white"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 mb-4">Quiz Completed!</h2>
                    <div className="flex flex-col items-center my-6">
                        <ScoreRing score={score} />
                        <p className="mt-6 text-xl text-slate-300">{`You scored ${correct} out of ${quizData.length}`}</p>
                    </div>
                    
                    {/* Polished Summary Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center my-8">
                        <div>
                            <p className="text-2xl font-bold text-green-400">{correct}</p>
                            <p className="text-sm text-slate-400">Correct</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-red-400">{wrong}</p>
                            <p className="text-sm text-slate-400">Wrong</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-blue-400">{attempted}</p>
                            <p className="text-sm text-slate-400">Attempted</p>
                        </div>
                    </div>

                    <div className="flex justify-center gap-4 mt-8">
                        <button onClick={onRestart} className="gradient-button">
                            Take Another Quiz
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // --- UI POLISHED: Active Quiz Screen ---
    return (
        <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-4">
            <div className="w-full max-w-3xl bg-slate-800/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-lg overflow-hidden">
                <div className="w-full bg-slate-900/50 h-2.5">
                    <motion.div 
                        className="h-2.5 bg-gradient-to-r from-purple-600 to-indigo-500" 
                        initial={{ width: `${((currentQuestion) / quizData.length) * 100}%` }}
                        animate={{ width: `${progressPercentage}%` }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-center mb-6">
                        <span className="font-mono text-sm font-semibold text-purple-400 bg-slate-700/50 px-3 py-1.5 rounded-full">{`Question ${currentQuestion + 1}/${quizData.length}`}</span>
                        <span className="font-mono text-lg font-bold text-slate-300 bg-slate-700/50 px-4 py-1.5 rounded-full">{formatTime(timer)}</span>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-8 min-h-[6rem] flex items-center">
                        {quizData[currentQuestion].question}
                    </h2>
                    <div className="space-y-4 mb-8">
                        {quizData[currentQuestion].options.map((opt, idx) => {
                            const isSelected = selectedAnswer === idx;
                            const isCorrect = idx === quizData[currentQuestion].answer;
                            let buttonClass = "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 text-slate-200 ";

                            if (selectedAnswer !== null) {
                                if (isCorrect) buttonClass += "bg-green-500/20 border-green-500 font-semibold";
                                else if (isSelected && !isCorrect) buttonClass += "bg-red-500/20 border-red-500";
                                else buttonClass += "bg-slate-800/40 border-slate-700 text-slate-400";
                            } else {
                                buttonClass += "bg-slate-800/70 border-slate-700 hover:border-purple-500 hover:bg-slate-800 cursor-pointer";
                            }
                            return <button key={idx} className={buttonClass} onClick={() => handleAnswer(idx)} disabled={selectedAnswer !== null}>{opt}</button>;
                        })}
                    </div>
                    <div className="flex justify-end items-center">
                        {isLastQuestion ? (
                            <button onClick={handleSubmit} disabled={selectedAnswer === null} className="gradient-button px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                Submit
                            </button>
                        ) : (
                            <button onClick={handleNext} disabled={selectedAnswer === null} className="gradient-button px-8 py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed">
                                Next
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuizApp;