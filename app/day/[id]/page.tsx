"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { ChevronLeft, Play, Check, Flame, ShieldCheck, ArrowRight } from "lucide-react";
import data from "../../../data.json";

const GithubIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
);

export default function ChallengeDay({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const dayId = parseInt(id, 10);
    const router = useRouter();

    const getInitialTask = () => {
        const found = data.tasks.find(t => t.day === dayId);
        if (found) return found;
        return {
            day: dayId,
            title: `Challenge Day ${dayId}`,
            description: "This is a placeholder for future challenges. Implement your feature and submit the proof of work."
        };
    };

    const [todayTask, setTodayTask] = useState(getInitialTask());
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleRunTests = () => {
        setIsSubmitting(true);

        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitted(true);
            
            // Save progress to local storage
            const savedData = JSON.parse(localStorage.getItem("elevatex_student") || "{}");
            const completedDays = savedData.completedDays || [];
            
            if (!completedDays.includes(dayId)) {
                completedDays.push(dayId);
                const currentStreak = savedData.student ? savedData.student.currentStreak + 1 : data.student.currentStreak + 1;
                const progressPercentage = Math.min(100, Math.round((completedDays.length / 60) * 100));
                
                localStorage.setItem("elevatex_student", JSON.stringify({
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
        }, 2000);
    };

    return (
        <div suppressHydrationWarning className="min-h-screen bg-[#050505] text-white font-sans relative overflow-hidden flex flex-col w-full">
            <div className="mx-auto w-full px-6 md:px-16 lg:px-24 flex flex-col flex-1">
            
            {/* Header */}
            <div className="px-5 md:px-12 pt-8 pb-4 flex items-center justify-between z-10 relative">
                <div 
                    onClick={() => router.back()}
                    className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400 cursor-pointer shadow-sm"
                >
                    <ChevronLeft className="w-5 h-5 pr-0.5" />
                </div>
            </div>

            {/* Content */}
            <motion.div 
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                className="px-5 md:px-12 pb-8 flex-1 overflow-y-auto"
            >
               <div className="md:flex md:gap-16 md:items-start">
                  {/* Left Column */}
                  <div className="md:flex-1 md:max-w-lg">
                      <div className="inline-block bg-purple-500/10 text-purple-400 text-[10px] font-bold px-2 py-1 rounded mb-4 tracking-wider">
                          DAY {todayTask.day}
                      </div>
                      
                      <h1 className="text-[22px] md:text-[32px] font-bold text-white mb-6 md:mb-8 tracking-tight">
                          {todayTask.title}
                      </h1>
      
                      {/* Info Card */}
                      <div className="bg-[#0d0d12] border border-white/5 rounded-2xl p-5 mb-8">
                          <h2 className="text-[14px] md:text-[16px] font-bold text-white mb-2 md:mb-3">What you need to build:</h2>
                          <p className="text-[13px] md:text-[15px] text-zinc-400 leading-relaxed">
                              {todayTask.description}
                          </p>
                      </div>

                      {/* Illustration Space (Desktop Only) */}
                      <div className="mt-8 mb-4 hidden md:flex justify-center items-center overflow-hidden">
                          <img 
                              src="/illustration.png" 
                              alt="3D Folder Challenge" 
                              className="w-96 h-auto object-cover"
                              style={{
                                  maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 65%)',
                                  WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 65%)',
                                  transform: 'scale(1.1)'
                              }}
                          />
                      </div>
                  </div>

                  {/* Right Column */}
                  <div className="md:flex-1 md:bg-[#0a0a0a]/80 md:border md:border-white/5 md:p-8 md:rounded-3xl md:shadow-xl md:backdrop-blur-sm mt-8 md:mt-0">
                      {/* Form Fields */}
                <div className="space-y-5">
                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                            GITHUB COMMIT URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <GithubIcon className="w-4 h-4 text-zinc-400" />
                            </div>
                            <input 
                                type="text"
                                placeholder="https://github.com/username/repo/commit/..."
                                className="w-full bg-[#111111] border border-white/5 text-white text-[13px] rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2">
                            LINKEDIN POST URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <LinkedinIcon className="w-4 h-4 text-zinc-400" />
                            </div>
                            <input 
                                type="text"
                                placeholder="https://linkedin.com/posts/username/..."
                                className="w-full bg-[#111111] border border-white/5 text-white text-[13px] rounded-2xl pl-11 pr-4 py-4 focus:outline-none focus:border-purple-500/50 transition-colors placeholder:text-zinc-600"
                            />
                        </div>
                    </div>
                </div>

                {/* Why we ask */}
                <div className="bg-[#0a0714] border border-purple-500/20 rounded-2xl p-5 mt-6 mb-8 flex gap-3">
                    <ShieldCheck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="text-[14px] font-bold text-white mb-1">Why we ask?</h3>
                        <p className="text-[12px] text-zinc-400 leading-relaxed">
                            We verify your work to ensure authenticity and help you get noticed.
                        </p>
                    </div>
                </div>

                {/* Submit Button */}
                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={handleRunTests}
                    disabled={isSubmitting || submitted}
                    className="w-full bg-gradient-to-r from-[#421cf8] to-[#ed3f7a] text-white py-4 rounded-xl font-bold text-[15px] flex justify-center items-center gap-2 transition-all relative overflow-hidden shadow-lg"
                >
                    {isSubmitting ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Submitting...
                        </>
                    ) : (
                        <>
                            Submit Proof of Work <ArrowRight className="w-4 h-4" />
                        </>
                    )}
                </motion.button>
                
                {/* Illustration Space (Mobile Only) */}
                <div className="mt-8 mb-4 flex md:hidden justify-center items-center overflow-hidden">
                    <img 
                        src="/illustration.png" 
                        alt="3D Folder Challenge" 
                        className="w-72 h-auto object-cover"
                        style={{
                            maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 65%)',
                            WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 65%)',
                            transform: 'scale(1.1)'
                        }}
                    />
                </div>
                </div>
              </div>
            </motion.div>
        </div>

            {/* Success Overlay Modal */}
            <AnimatePresence>
                {submitted && (
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 bg-[#0a0515]/95 backdrop-blur-xl"
                    >
                        {/* Radial Glow */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.15)_0%,transparent_70%)] pointer-events-none"></div>

                        <motion.div 
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
                            className="text-center w-full max-w-[320px] md:max-w-md relative z-10"
                        >
                            {/* Checkmark icon */}
                            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(34,197,94,0.5)] border-4 border-black">
                                <Check className="w-12 h-12 text-black" strokeWidth={4} />
                            </div>
                            
                            <h2 className="text-[32px] font-black text-white mb-6 tracking-tight leading-[1.1]">
                                CHALLENGE<br/>COMPLETED
                            </h2>
                            
                            <div className="flex justify-center gap-3 mb-10">
                                <span className="text-[12px] font-bold bg-indigo-500/20 text-indigo-400 px-3.5 py-1.5 rounded-md uppercase tracking-wider">
                                    Day {todayTask.day}
                                </span>
                                <span className="text-[12px] font-bold bg-orange-500/20 text-orange-400 px-3.5 py-1.5 rounded-md uppercase tracking-wider flex items-center gap-1.5">
                                    <Flame className="w-3.5 h-3.5" /> +1 STREAK
                                </span>
                            </div>

                            <div className="space-y-3">
                                <motion.button 
                                    whileTap={{ scale: 0.97 }}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-[13px] tracking-wider flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all"
                                >
                                    <div className="bg-white text-blue-600 rounded-sm p-0.5">
                                        <span className="font-serif text-[10px] px-1 font-bold">in</span>
                                    </div>
                                    SHARE TO LINKEDIN
                                </motion.button>
                                <motion.button 
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => router.push('/dashboard')}
                                    className="w-full bg-[#111] border border-white/10 hover:bg-white/5 text-zinc-300 py-4 rounded-xl font-bold text-[13px] tracking-wider transition-all"
                                >
                                    RETURN TO DASHBOARD
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}
