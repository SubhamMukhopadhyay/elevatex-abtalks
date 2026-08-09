"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Snowflake, AlertTriangle, ChevronLeft, ChevronRight, Headphones, Play, Pause, RotateCcw, CloudRain, Sparkles, Coffee } from "lucide-react";
import { useRouter } from "next/navigation";
import data from "../../data.json";

export default function Dashboard() {
    const [viewState, setViewState] = useState(0);
    const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
    const [isCardModalOpen, setIsCardModalOpen] = useState(false);
    const [freezeUsed, setFreezeUsed] = useState(false);
    const [studentState, setStudentState] = useState(data.student);
    const [currentDay, setCurrentDay] = useState(1);
    const [completedDays, setCompletedDays] = useState<number[]>([]);
    const router = useRouter();

    const [timerActive, setTimerActive] = useState(false);
    const [secondsLeft, setSecondsLeft] = useState(25 * 60);
    const [ghostProgress, setGhostProgress] = useState(65);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedTrack, setSelectedTrack] = useState("Lofi Beats to Code to");
    const tracksData: Record<string, string> = {
        "Lofi Beats to Code to": "/lofi.mp3",
        "Midnight Rain": "/rain.mp3",
        "Cyber Synth": "/synth.mp3",
        "Cafe Ambience": "/cafe.mp3"
    };
    const tracks = Object.keys(tracksData);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const getTrackIcon = (track: string) => {
        switch (track) {
            case "Midnight Rain": return <CloudRain className="w-4 h-4 mr-2 text-blue-400" />;
            case "Cyber Synth": return <Sparkles className="w-4 h-4 mr-2 text-purple-400" />;
            case "Cafe Ambience": return <Coffee className="w-4 h-4 mr-2 text-amber-400" />;
            default: return <Headphones className="w-4 h-4 mr-2 text-zinc-400" />;
        }
    };

    const [isDecoded, setIsDecoded] = useState(false);
    const [asciiFrame, setAsciiFrame] = useState(0);

    const asciiFrames = [
        `@ & % # *\n% # * o +\n# * o + -\n* o + - :`,
        `# * o + -\n* o + - :\no + - : .\n+ - : .  `,
        `o + - : .\n+ - : .  \n- : .    \n: .      `
    ];

    // Load state from local storage on mount
    useEffect(() => {
        // Initialize Audio
        audioRef.current = new Audio(tracksData[selectedTrack]);
        audioRef.current.loop = true;

        if ('scrollRestoration' in history) {
            history.scrollRestoration = 'manual';
        }
        window.scrollTo(0, 0);
        
        // Force scroll to top after a tiny delay to beat Next.js internal scroll restoration
        const scrollTimer = setTimeout(() => {
            window.scrollTo(0, 0);
        }, 50);

        const savedData = localStorage.getItem("Elevatex_student");
        if (savedData) {
            const parsed = JSON.parse(savedData);
            if (parsed.student) setStudentState(parsed.student);
            if (parsed.completedDays) setCompletedDays(parsed.completedDays);
            if (parsed.student && parsed.student.currentStreak > 0) {
                setCurrentDay(parsed.student.currentStreak);
            }
            
            // Calculate current day based on completed days
            const maxCompleted = parsed.completedDays?.length ? Math.max(...parsed.completedDays) : 0;
            setCurrentDay(maxCompleted + 1 > 60 ? 60 : maxCompleted + 1);
        } else {
            // Initialize for new user using default mock data
            setStudentState(data.student);
            setCurrentDay(data.student.currentStreak > 0 ? data.student.currentStreak : 1);
        }

        // Mock a real-time progress increase for the Ghost
        const ghostInterval = setInterval(() => {
            setGhostProgress(prev => {
                if (prev < 95) return prev + 1;
                return prev;
            });
        }, 8000); 

        let asciiInterval = setInterval(() => {
            setAsciiFrame(prev => (prev + 1) % asciiFrames.length);
        }, 150);

        let decodeTimeout = setTimeout(() => {
            clearInterval(asciiInterval);
            setIsDecoded(true);
        }, 1200);

        return () => {
            clearInterval(asciiInterval);
            clearInterval(ghostInterval);
            clearTimeout(decodeTimeout);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Handle track changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = tracksData[selectedTrack];
            if (timerActive) {
                audioRef.current.play().catch(e => console.log("Audio playback prevented:", e));
            }
        }
    }, [selectedTrack]);

    useEffect(() => {
        let interval: NodeJS.Timeout | null = null;
        if (timerActive && secondsLeft > 0) {
            if (audioRef.current && audioRef.current.paused) {
                audioRef.current.play().catch(e => console.log("Audio playback prevented:", e));
            }
            interval = setInterval(() => {
                setSecondsLeft(prev => prev - 1);
            }, 1000);
        } else {
            if (audioRef.current && !audioRef.current.paused) {
                audioRef.current.pause();
            }
            if (secondsLeft === 0) {
                setTimerActive(false);
            }
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [timerActive, secondsLeft]);

    const formatTime = (secs: number) => {
        const mins = Math.floor(secs / 60);
        const s = secs % 60;
        return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

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
        const savedData = JSON.parse(localStorage.getItem("Elevatex_student") || "{}");
        localStorage.setItem("Elevatex_student", JSON.stringify({ ...savedData, freezeUsed: true }));
    };

    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div suppressHydrationWarning className="min-h-screen bg-[#050505] text-white p-6 mx-auto w-full max-w-[390px] font-sans relative pb-24 overflow-x-hidden overflow-y-auto">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">

                {/* Header Section */}
                <div className="flex justify-between items-start pt-2">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-zinc-400">
                            <ChevronLeft className="w-5 h-5 pr-0.5" />
                        </Link>
                        <div>
                            <p className="text-zinc-400 text-[13px] font-medium leading-tight">Welcome back,</p>
                            <h1 className="text-[28px] font-bold text-white tracking-tight flex items-center gap-2 mt-0.5">
                                {student.name} <span className="text-2xl">👋</span>
                            </h1>
                        </div>
                    </div>
                    {/* Interactive Avatar */}
                    <div className="relative w-14 h-14 rounded-full overflow-hidden bg-purple-900/40 border-2 border-purple-500/50 flex items-center justify-center group cursor-pointer shadow-[0_0_15px_rgba(168,85,247,0.3)] shrink-0" onClick={() => setIsCardModalOpen(true)}>
                        {!isDecoded ? (
                            <div className="text-[6px] leading-[6px] font-mono text-purple-400 whitespace-pre text-center animate-pulse">
                                {asciiFrames[asciiFrame]}
                            </div>
                        ) : (
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${studentState.name || 'Student'}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 scale-110 translate-y-0.5" />
                        )}
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-lg"
                    >
                        <Flame className={`w-7 h-7 mb-1 ${student.currentStreak > 0 ? "text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" : "text-zinc-600"}`} />
                        <div className="h-8 relative w-full flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={student.currentStreak}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="text-2xl font-black absolute"
                                >
                                    {student.currentStreak}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Day Streak</span>
                    </motion.div>
                    <motion.div 
                        whileTap={{ scale: 0.95 }}
                        className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center relative shadow-lg"
                    >
                        <Trophy className="w-7 h-7 mb-1 text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]" />
                        <div className="h-8 relative w-full flex items-center justify-center overflow-hidden">
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={student.achievements.length}
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -20, opacity: 0 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                    className="text-2xl font-black absolute"
                                >
                                    {student.achievements.length}
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">Badges</span>
                    </motion.div>
                </div>

                {/* Journey Constellation */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-2xl p-5 shadow-lg">
                    <div className="flex justify-between items-end mb-4">
                        <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Journey Constellation</span>
                        <span className="text-lg font-black text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]">{student.progressPercentage}%</span>
                    </div>
                    <div className="relative w-full h-16 rounded-xl flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none">
                            <path d="M 0 32 Q 50 10, 100 32 T 200 32 T 300 32" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" strokeDasharray="3 3" />
                            <motion.path 
                                initial={{ pathLength: 0 }}
                                animate={{ pathLength: student.progressPercentage / 100 }}
                                transition={{ duration: 2, ease: "easeInOut" }}
                                d="M 0 32 Q 50 10, 100 32 T 200 32 T 300 32" 
                                fill="none" 
                                stroke="#a855f7" 
                                strokeWidth="2"
                                className="drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                            />
                        </svg>
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div 
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: (student.progressPercentage / 100) >= (i/4) ? 1 : 0.5 }}
                                transition={{ delay: 1 + i * 0.1 }}
                                className={`absolute w-2 h-2 rounded-full z-10 transition-colors duration-500 ${
                                    (student.progressPercentage / 100) >= (i/4) 
                                    ? (i === 4 ? "bg-yellow-400 shadow-[0_0_10px_rgba(250,204,21,1)]" : "bg-purple-400 shadow-[0_0_10px_rgba(168,85,247,1)]") 
                                    : "bg-zinc-700"
                                }`}
                                style={{
                                    left: `${10 + (i * 20)}%`,
                                    top: i === 1 ? '10px' : i === 3 ? '40px' : '30px'
                                }}
                            />
                        ))}
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

                {/* Streak Freeze */}
                {!freezeUsed ? (
                    <motion.div
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsFreezeModalOpen(true)}
                        className="bg-[#051525] border border-blue-900/30 rounded-2xl p-4 flex items-center gap-4 shadow-lg cursor-pointer transition-colors"
                    >
                        <Snowflake className="w-8 h-8 text-blue-400" />
                        <div className="flex-1">
                            <h3 className="text-[13px] font-bold text-blue-400 flex items-center justify-between">
                                Streak Freeze Available <ChevronRight className="w-4 h-4 text-blue-400/50" />
                            </h3>
                            <p className="text-[11px] text-blue-400/70 mt-0.5 leading-snug pr-4">Click to protect your streak if you can't code today.</p>
                        </div>
                    </motion.div>
                ) : (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center gap-4 opacity-50">
                        <Snowflake className="w-8 h-8 text-zinc-500" />
                        <div>
                            <h3 className="text-[13px] font-bold text-zinc-400">Streak Freeze Used</h3>
                            <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">Your streak is protected for today.</p>
                        </div>
                    </div>
                )}

                {/* Active Challenge Card */}
                <motion.div 
                    className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 shadow-lg"
                >
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-400 px-2.5 py-1 rounded-md uppercase tracking-wider">Day {todayTask.day}</span>
                        <span className="text-[10px] font-bold text-zinc-500">Top 10%</span>
                    </div>
                    
                    <h2 className="text-lg font-bold text-white mb-4">Local Storage</h2>
                    


                    <Link href={`/day/${todayTask.day}`} className="block w-full">
                        <motion.button 
                            whileTap={{ scale: 0.97 }}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-3.5 rounded-xl font-bold text-[14px] shadow-[0_0_20px_rgba(168,85,247,0.3)] flex justify-center items-center gap-2"
                        >
                            Open Today's Challenge <ChevronRight className="w-4 h-4" />
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Night Owl Deck */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <span className="text-purple-400 text-lg">☾</span>
                            <span className="text-[13px] font-bold text-white">Night Owl Deck</span>
                        </div>
                        <span className="text-[10px] font-bold bg-white/5 px-3 py-1.5 rounded-full text-zinc-300 border border-white/10">Focus Mode</span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="text-[10px] font-bold text-zinc-500 tracking-widest mb-1">POMODORO</div>
                            <div className="text-[32px] leading-none font-bold text-white tracking-tight">{formatTime(secondsLeft)}</div>
                        </div>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setTimerActive(!timerActive)}
                                className="h-12 w-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-all shadow-[0_0_15px_rgba(37,99,235,0.4)]"
                            >
                                {timerActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
                            </button>
                            <button 
                                onClick={() => { setTimerActive(false); setSecondsLeft(25 * 60); }}
                                className="h-12 w-12 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                            >
                                <RotateCcw className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className={`w-full bg-black border ${isDropdownOpen ? 'border-white/10 rounded-t-xl rounded-b-none' : 'border-transparent rounded-xl'} p-4 text-[13px] font-medium text-zinc-300 outline-none flex justify-between items-center transition-all z-20 relative`}
                        >
                            <span className="flex items-center">{getTrackIcon(selectedTrack)} {selectedTrack}</span>
                            <ChevronLeft className={`w-4 h-4 text-zinc-500 transition-transform ${isDropdownOpen ? 'rotate-90' : '-rotate-90'}`} />
                        </button>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="absolute top-full left-0 right-0 bg-black border border-t-0 border-white/10 rounded-b-xl overflow-hidden z-20 shadow-xl"
                                >
                                    {tracks.map((track, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedTrack(track); setIsDropdownOpen(false); }}
                                            className="w-full flex items-center text-left px-4 py-3.5 text-[13px] font-medium text-zinc-400 hover:text-white transition-colors"
                                        >
                                            {getTrackIcon(track)} {track}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>

                {/* Live Ghost Sprint */}
                <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 shadow-lg">
                    <div className="flex justify-between items-center mb-5">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-[13px] font-bold text-white">Live Ghost Sprint</span>
                        </div>
                        <span className="text-[10px] font-bold bg-orange-950/40 border border-orange-500/20 text-orange-400 px-2.5 py-1 rounded-md">Day {todayTask.day} Race</span>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <div className="h-12 w-12 rounded-full overflow-hidden bg-purple-900/30 border-2 border-purple-500/30 shrink-0 flex items-center justify-center p-1">
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Rival99&backgroundColor=transparent`} alt="rival" className="w-full h-full object-cover scale-110" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-[14px] font-bold text-white">ShadowCoder_99</span>
                                <span className="text-[10px] text-zinc-500 font-medium">Compiling...</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative">
                                <motion.div
                                    animate={{ width: `${ghostProgress}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.8)]"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-[11px] text-zinc-500 leading-snug">Submit your challenge before they do<br/>to win a Sprint Badge!</p>
                    
                    {/* Your Trophies Section - Included in Ghost Sprint card based on reference */}
                    {student.achievements.length > 0 && (() => {
                        let tierProgress = Math.min(100, Math.round((currentDay / 15) * 100));
                        return (
                            <div className="mt-8 space-y-3">
                                <div className="flex justify-between items-end">
                                    <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest">Your Trophies</h3>
                                    <span className="text-[11px] font-bold text-blue-400">80% to Tier II</span>
                                </div>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative mb-4">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: '80%' }}
                                        transition={{ duration: 1.5, delay: 0.5 }}
                                        className="h-full bg-gradient-to-r from-blue-600 to-purple-500 rounded-full"
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-[11px] font-bold bg-transparent border border-white/10 px-3 py-1.5 rounded-full text-zinc-300 flex items-center gap-1.5">
                                        <Trophy className="w-3 h-3 text-yellow-500" /> Week 1 Warrior
                                    </span>
                                    <span className="text-[11px] font-bold bg-transparent border border-white/10 px-3 py-1.5 rounded-full text-zinc-300 flex items-center gap-1.5">
                                        <Trophy className="w-3 h-3 text-yellow-500" /> Early Bird
                                    </span>
                                </div>
                            </div>
                        );
                    })()}
                </div>
            </motion.div>

            {/* Profile Modal */}
            <AnimatePresence>
                {isCardModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm" onClick={() => setIsCardModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-[#0a0a0a] border border-white/10 rounded-[32px] p-8 w-full max-w-[340px] shadow-2xl relative overflow-hidden"
                        >
                            <div className="text-center relative z-10 flex flex-col items-center">
                                <div className="w-24 h-24 rounded-full border-2 border-purple-500/50 overflow-hidden shadow-[0_0_20px_rgba(168,85,247,0.4)] mb-5 bg-purple-900/30 flex items-center justify-center p-2">
                                    <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=${student.name}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover scale-110" />
                                </div>
                                <h2 className="text-[28px] font-bold text-white tracking-tight">{student.name}</h2>
                                <p className="text-purple-400 font-bold text-[11px] tracking-[0.2em] uppercase mt-1">Elevatex Hacker</p>
                            </div>

                            <div className="flex gap-3 mt-6 relative z-10 justify-center">
                                <div className="flex flex-col items-center flex-1 bg-[#101010] border border-white/5 rounded-2xl py-4 shadow-sm">
                                    <Flame className="w-6 h-6 mb-2 text-orange-500" strokeWidth={1.5} />
                                    <div className="text-[20px] font-bold text-white leading-none">{student.currentStreak}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mt-1.5">Day Streak</div>
                                </div>
                                <div className="flex flex-col items-center flex-1 bg-[#101010] border border-white/5 rounded-2xl py-4 shadow-sm">
                                    <Trophy className="w-6 h-6 mb-2 text-yellow-500" strokeWidth={1.5} />
                                    <div className="text-[20px] font-bold text-white leading-none">{student.achievements.length}</div>
                                    <div className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold mt-1.5">Badges</div>
                                </div>
                            </div>
                            
                            <div className="mt-5 relative z-10">
                                <button className="w-full bg-[#382bf0] hover:bg-[#2f23d1] text-white py-3.5 rounded-xl font-medium text-[14px] flex justify-center items-center gap-2 transition-all">
                                    <div className="bg-white text-[#382bf0] rounded-[3px] p-0.5"><span className="font-serif text-[11px] px-1 font-bold leading-none">in</span></div>
                                    Download for LinkedIn
                                </button>
                            </div>

                            <div className="mt-8">
                                <div className="flex items-center gap-4 text-center">
                                    <div className="flex-1 h-px bg-white/5"></div>
                                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">About Me</span>
                                    <div className="flex-1 h-px bg-white/5"></div>
                                </div>
                                <p className="text-[12px] text-zinc-300 text-left mt-4 leading-relaxed font-medium">
                                    Just a builder who loves solving problems, shipping code, and learning in public.
                                </p>
                                <div className="flex justify-between mt-6 pt-6 text-center">
                                    <div className="flex-1 text-left">
                                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Joined On</div>
                                        <div className="text-[13px] font-medium text-zinc-300">24 May 2024</div>
                                    </div>
                                    <div className="w-px bg-white/5 h-8 self-center"></div>
                                    <div className="flex-1 text-left pl-6">
                                        <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5">Country</div>
                                        <div className="text-[13px] font-medium text-zinc-300 flex items-center justify-start gap-1.5">
                                            <span>🇮🇳</span> India
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Streak Freeze Modal */}
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

            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-40">
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
                        className={`text-[11px] uppercase font-bold tracking-wide px-4 py-2.5 rounded-full transition-all ${
                            viewState === state.id 
                            ? "bg-[#2563eb] text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]" 
                            : "bg-[#161616] text-zinc-400 hover:text-zinc-200"
                        }`}
                    >
                        {state.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
