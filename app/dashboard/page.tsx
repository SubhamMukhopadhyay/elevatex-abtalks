"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Snowflake, AlertTriangle, ChevronLeft } from "lucide-react";
import data from "../../data.json";

export default function Dashboard() {
    const [viewState, setViewState] = useState(0);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [freezeUsed, setFreezeUsed] = useState(false);
    const [studentState, setStudentState] = useState(data.student);
    const [currentDay, setCurrentDay] = useState(1);
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    
    // Load state from local storage on mount
    useEffect(() => {
        const savedData = localStorage.getItem("hyperfusion_student");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            setStudentState(parsed.student);
            setCompletedDays(parsed.completedDays || []);
            setFreezeUsed(parsed.freezeUsed || false);
            
            // Calculate current day based on completed days
            const maxCompleted = parsed.completedDays?.length ? Math.max(...parsed.completedDays) : 0;
            setCurrentDay(maxCompleted + 1 > 60 ? 60 : maxCompleted + 1);
        } else {
            // Initialize for new user using default mock data
            setStudentState(data.student);
            setCurrentDay(data.student.currentStreak > 0 ? data.student.currentStreak : 1);
        }
    }, []);

    // Get today's task from data.json based on currentDay
    const todayTask = data.tasks.find(t => t.day === currentDay) || data.tasks[0];

    const student = {
        name: viewState === 3 ? "New Student" : studentState.name,
        currentStreak: viewState !== 0 ? 0 : studentState.currentStreak,
        progressPercentage: viewState === 3 ? 0 : studentState.progressPercentage,
        standing: viewState === 3 ? "Unranked" : viewState === 2 ? "Needs Recovery" : studentState.standing,
        achievements: viewState === 3 ? [] : studentState.achievements,
    };

    const handleUseFreeze = () => {
        setFreezeUsed(true);
        setIsFreezeModalOpen(false);
        const savedData = JSON.parse(localStorage.getItem("hyperfusion_student") || "{}");
        localStorage.setItem("hyperfusion_student", JSON.stringify({ ...savedData, freezeUsed: true }));
    };

    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div suppressHydrationWarning className="min-h-screen bg-zinc-950 text-white p-6 mx-auto w-full max-w-[390px] border-x border-white/5 font-sans relative pb-24 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                <div className="pt-2">
                    <Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-2 font-medium w-fit">
                        <ChevronLeft className="w-4 h-4" /> Back to Home
                    </Link>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400 text-sm font-medium">Welcome back,</p>
                        <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                    </div>
                    <div className="h-11 w-11 bg-indigo-500/20 rounded-full flex items-center justify-center border border-indigo-500/30 overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`} alt="avatar" className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95, rotate: [0, -3, 3, -3, 0] }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden cursor-default shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-full blur-xl"></div>
                            <Flame className={`w-8 h-8 mb-2 z-10 ${student.currentStreak > 0 ? "text-orange-500" : "text-zinc-600"}`} />
                            <span className="text-2xl font-black z-10">{student.currentStreak}</span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1 z-10">Day Streak</span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95, rotate: [0, -3, 3, -3, 0] }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden cursor-default shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                            <Trophy className="w-8 h-8 mb-2 z-10 text-yellow-400" />
                            <span className="text-2xl font-black z-10">{student.achievements.length}</span>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1 z-10">Badges</span>
                        </motion.div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Challenge Progress</span>
                            <span className="text-sm font-black text-indigo-400">{student.progressPercentage}%</span>
                        </div>
                        <div className="h-3 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${student.progressPercentage}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full relative"
                            >
                                <div className="absolute inset-0 bg-white/20 w-full animate-pulse"></div>
                            </motion.div>
                        </div>
                    </div>
                </div>

                {viewState === 2 && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-4 flex items-center gap-4">
                        <AlertTriangle className="w-8 h-8 text-red-500" />
                        <div>
                            <h3 className="text-sm font-bold text-red-400">Streak Lost</h3>
                            <p className="text-xs text-red-400/70 mt-0.5">You missed yesterday. Complete today's task to start fresh.</p>
                        </div>
                    </div>
                )}

                {!freezeUsed ? (
                    <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsFreezeModalOpen(true)}
                        className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer transition-colors hover:bg-blue-500/20"
                    >
                        <Snowflake className="w-8 h-8 text-blue-400" />
                        <div>
                            <h3 className="text-sm font-bold text-blue-400">Streak Freeze Available</h3>
                            <p className="text-xs text-blue-400/70 mt-0.5">Click to protect your streak if you can't code today.</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 opacity-50">
                        <Snowflake className="w-8 h-8 text-zinc-500" />
                        <div>
                            <h3 className="text-sm font-bold text-zinc-400">Streak Freeze Used</h3>
                            <p className="text-xs text-zinc-500 mt-0.5">Your streak is protected for today.</p>
                        </div>
                    </div>
                )}

                <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 space-y-5 relative overflow-hidden shadow-xl">
                    <div className="flex justify-between items-center relative z-10">
                        <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg uppercase">Day {todayTask.day}</span>
                        <span className="text-xs font-medium text-zinc-400 bg-black/20 px-3 py-1.5 rounded-lg">{student.standing}</span>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-xl font-bold text-white mb-2">{todayTask.title}</h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">{todayTask.description}</p>
                    </div>
                    <Link href={`/day/${todayTask.day}`} className="block w-full relative z-10">
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95, rotate: [0, -2, 2, -2, 0] }}
                            className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                        >
                            Open Today's Challenge
                        </motion.button>
                    </Link>
                </div>

                {student.achievements.length > 0 && (
                    <div className="space-y-3 pb-8">
                        <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Trophies</h3>
                        <div className="flex flex-wrap gap-2">
                            {student.achievements.map((badge, i) => (
                                <span key={i} className="text-xs font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-zinc-300 flex items-center gap-2">
                                    <Trophy className="w-3 h-3 text-yellow-500" /> {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </motion.div>

            <AnimatePresence>
                {isFreezeModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-zinc-900 border border-white/10 rounded-3xl p-6 w-full max-w-[340px] shadow-2xl relative"
                        >
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-5xl drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <Snowflake className="w-16 h-16 text-blue-400 bg-zinc-900 rounded-full p-2" />
                            </div>
                            <div className="pt-6 text-center space-y-3">
                                <h2 className="text-xl font-bold text-white">Use Streak Freeze?</h2>
                                <p className="text-sm text-zinc-400 leading-relaxed">
                                    This will consume your token and protect your streak for 24 hours. You cannot undo this.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3 mt-6">
                                <button
                                    onClick={() => setIsFreezeModalOpen(false)}
                                    className="py-3 rounded-xl font-bold text-sm bg-white/5 hover:bg-white/10 text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleUseFreeze}
                                    className="py-3 rounded-xl font-bold text-sm bg-blue-500 hover:bg-blue-600 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all"
                                >
                                    Confirm Use
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#111] border border-white/10 p-1.5 rounded-full flex gap-1 shadow-2xl z-40">
                {[
                    { id: 0, label: "Normal" },
                    { id: 1, label: "Day 1" },
                    { id: 2, label: "Missed" },
                    { id: 3, label: "Empty" }
                ].map((state) => (
                    <button
                        key={state.id}
                        onClick={() => {
                            setViewState(state.id);
                            setFreezeUsed(false);
                        }}
                        className={`text-[10px] uppercase font-bold tracking-wider px-4 py-2 rounded-full transition-all ${viewState === state.id ? "bg-indigo-500 text-white" : "text-zinc-500 hover:text-zinc-300"
                            }`}
                    >
                        {state.label}
                    </button>
                ))}
            </div>
        </div>
    );
}