"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronLeft } from "lucide-react";
import data from "../../../data.json";

export default function ChallengeDay({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dayId = parseInt(id, 10);
    const router = useRouter();

    const [todayTask, setTodayTask] = useState(data.tasks.find(t => t.day === dayId) || data.tasks[0]);
    const [github, setGithub] = useState("");
    const [linkedin, setLinkedin] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        // If the task wasn't found in our mock data (e.g. day > 15), fallback
        if (!data.tasks.find(t => t.day === dayId)) {
            setTodayTask({
                day: dayId,
                title: `Challenge Day ${dayId}`,
                description: "This is a placeholder for future challenges. Implement your feature and submit the proof of work."
            });
        }
    }, [dayId]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            
            // Save progress to local storage
            const savedData = JSON.parse(localStorage.getItem("hyperfusion_student") || "{}");
            const completedDays = savedData.completedDays || [];
            
            if (!completedDays.includes(dayId)) {
                completedDays.push(dayId);
                const currentStreak = savedData.student ? savedData.student.currentStreak + 1 : data.student.currentStreak + 1;
                const progressPercentage = Math.min(100, Math.round((completedDays.length / 60) * 100));
                
                localStorage.setItem("hyperfusion_student", JSON.stringify({
                    ...savedData,
                    student: {
                        ...(savedData.student || data.student),
                        currentStreak,
                        progressPercentage,
                    },
                    completedDays
                }));
            }

            confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#6366f1', '#a855f7', '#10b981']
            });
        }, 1500);
    };

    return (
        <div suppressHydrationWarning className="min-h-screen bg-zinc-950 text-white p-6 mx-auto w-full max-w-[390px] border-x border-white/5 font-sans flex flex-col relative overflow-hidden">

            <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/5 blur-[100px] pointer-events-none"></div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-6 pt-4 relative z-10 w-full">

                <Link href="/dashboard" className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-2 font-medium w-fit">
                    <ChevronLeft className="w-4 h-4" /> Back to Dashboard
                </Link>

                <div className="space-y-2 pt-2">
                    <span className="text-indigo-400 font-bold tracking-widest uppercase text-xs bg-indigo-500/10 px-3 py-1.5 rounded-lg">
                        Day {todayTask.day}
                    </span>
                    <h1 className="text-2xl font-extrabold text-white leading-tight mt-3">
                        {todayTask.title}
                    </h1>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-2xl p-5 shadow-lg backdrop-blur-sm">
                    <h3 className="text-sm font-bold text-zinc-300 mb-2">What you need to build:</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                        {todayTask.description}
                    </p>
                </div>

                {!submitted ? (
                    <form onSubmit={handleSubmit} className="space-y-5 pt-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">GitHub Commit URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://github.com/..."
                                value={github}
                                onChange={(e) => setGithub(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 focus:bg-white/5 transition-all text-[15px] placeholder:text-zinc-600 shadow-inner"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider ml-1">LinkedIn Post URL</label>
                            <input
                                type="url"
                                required
                                placeholder="https://linkedin.com/posts/..."
                                value={linkedin}
                                onChange={(e) => setLinkedin(e.target.value)}
                                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 focus:bg-white/5 transition-all text-[15px] placeholder:text-zinc-600 shadow-inner"
                            />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-500/50 text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)] flex justify-center items-center"
                            >
                                {isSubmitting ? (
                                    <span className="flex items-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                        Verifying...
                                    </span>
                                ) : (
                                    "Submit Proof of Work"
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-8 text-center space-y-4 mt-8 backdrop-blur-sm shadow-2xl">
                        <div className="text-5xl mb-4 drop-shadow-[0_0_15px_rgba(16,185,129,0.4)]">🎉</div>
                        <h3 className="text-xl font-bold text-emerald-400">Submission Accepted!</h3>
                        <p className="text-sm text-emerald-400/70 leading-relaxed">Your proof of work has been recorded. Your streak is safe.</p>
                        <Link href="/dashboard" className="block pt-6">
                            <button className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 py-3.5 rounded-xl font-bold text-sm transition-all border border-emerald-500/30">
                                Return to Dashboard
                            </button>
                        </Link>
                    </motion.div>
                )}

            </motion.div>
        </div>
    );
}
