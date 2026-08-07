"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Trophy, Snowflake, AlertTriangle, ChevronLeft, Headphones, Play, Pause, RotateCcw, CloudRain, Sparkles, Coffee } from "lucide-react";
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

        const savedData = localStorage.getItem("hyperfusion_student");
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
        const savedData = JSON.parse(localStorage.getItem("hyperfusion_student") || "{}");
        localStorage.setItem("hyperfusion_student", JSON.stringify({ ...savedData, freezeUsed: true }));
    };

    const isDev = process.env.NODE_ENV === 'development';

    return (
        <div suppressHydrationWarning className="min-h-screen bg-zinc-950 text-white p-6 mx-auto w-full max-w-[390px] border-x border-white/5 font-sans relative pb-24 overflow-hidden">
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

                <div className="pt-2">
                    <button onClick={() => router.back()} className="text-zinc-500 hover:text-white transition-colors text-sm flex items-center gap-2 font-medium w-fit">
                        <ChevronLeft className="w-4 h-4" /> Back
                    </button>
                </div>

                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400 text-sm font-medium">Welcome back,</p>
                        <h1 className="text-2xl font-bold text-white">{student.name}</h1>
                    </div>
                    {/* Interactive Avatar with ASCII Decode */}
                    <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black border-2 border-indigo-500/50 flex items-center justify-center group cursor-pointer" onClick={() => setIsCardModalOpen(true)}>
                        {!isDecoded ? (
                            <div className="text-[8px] leading-[8px] font-mono text-indigo-500 whitespace-pre text-center animate-pulse">
                                {asciiFrames[asciiFrame]}
                            </div>
                        ) : (
                            <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${studentState.name || 'Student'}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        )}
                        <div className="absolute inset-0 bg-indigo-500/20 group-hover:bg-transparent transition-colors duration-300 pointer-events-none"></div>
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
                            <motion.div
                                animate={student.currentStreak > 0 ? { scale: [1, 1.1, 1, 1.05, 1], rotate: [0, -3, 3, -1, 0] } : {}}
                                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Flame className={`w-8 h-8 mb-2 z-10 ${student.currentStreak > 0 ? "text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]" : "text-zinc-600"}`} />
                            </motion.div>
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={student.currentStreak}
                                    initial={{ opacity: 0, y: -20, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="text-2xl font-black z-10 inline-block"
                                >
                                    {student.currentStreak}
                                </motion.span>
                            </AnimatePresence>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1 z-10">Day Streak</span>
                        </motion.div>
                        <motion.div 
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.95, rotate: [0, -3, 3, -3, 0] }}
                            className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center relative overflow-hidden cursor-default shadow-lg"
                        >
                            <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/10 rounded-full blur-xl"></div>
                            <Trophy className="w-8 h-8 mb-2 z-10 text-yellow-400" />
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={student.achievements.length}
                                    initial={{ opacity: 0, y: -20, scale: 0.5 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="text-2xl font-black z-10 inline-block"
                                >
                                    {student.achievements.length}
                                </motion.span>
                            </AnimatePresence>
                            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mt-1 z-10">Badges</span>
                        </motion.div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <div className="flex justify-between items-end mb-4">
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Journey Constellation</span>
                            <AnimatePresence mode="popLayout">
                                <motion.span 
                                    key={student.progressPercentage}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                >
                                    {student.progressPercentage}%
                                </motion.span>
                            </AnimatePresence>
                        </div>
                        <div className="relative w-full h-24 bg-[#0a0a0a] rounded-xl border border-white/5 overflow-hidden flex items-center justify-center shadow-inner">
                            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                                <path d="M 0 50 Q 100 0, 200 50 T 400 50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeDasharray="4 4" />
                                <motion.path 
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: student.progressPercentage / 100 }}
                                    transition={{ duration: 2, ease: "easeInOut" }}
                                    d="M 0 50 Q 100 0, 200 50 T 400 50" 
                                    fill="none" 
                                    stroke="url(#glowGradient)" 
                                    strokeWidth="3"
                                    className="drop-shadow-[0_0_8px_rgba(99,102,241,0.8)]"
                                />
                                <defs>
                                    <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            {[0, 1, 2, 3, 4].map((i) => (
                                <motion.div 
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: (student.progressPercentage / 100) >= (i/4) ? 1 : 0.4 }}
                                    transition={{ delay: 1 + i * 0.1 }}
                                    className={`absolute w-2.5 h-2.5 rounded-full z-10 transition-colors duration-500 ${
                                        (student.progressPercentage / 100) >= (i/4) ? "bg-white shadow-[0_0_15px_rgba(255,255,255,1)]" : "bg-zinc-700"
                                    }`}
                                    style={{
                                        left: `${10 + (i * 20)}%`,
                                        top: i === 1 || i === 3 ? '30%' : '50%'
                                    }}
                                />
                            ))}
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

                <motion.div 
                    animate={{ y: [0, -4, 0], rotateX: [0, 2, -2, 0], rotateY: [0, -2, 2, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                    style={{ transformStyle: "preserve-3d" }}
                    className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-6 space-y-5 relative overflow-hidden shadow-[0_10px_30px_rgba(99,102,241,0.15)]"
                >
                    <motion.div 
                        animate={{ x: ["-100%", "200%"] }} 
                        transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 3 }}
                        className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 z-0 pointer-events-none" 
                    />
                    <div className="flex justify-between items-center relative z-10" style={{ transform: "translateZ(10px)" }}>
                        <span className="text-xs font-bold bg-indigo-500/20 text-indigo-300 px-3 py-1.5 rounded-lg uppercase shadow-sm">Day {todayTask.day}</span>
                        <span className="text-xs font-medium text-zinc-400 bg-black/20 px-3 py-1.5 rounded-lg">{student.standing}</span>
                    </div>
                    <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
                        <h2 className="text-xl font-bold text-white mb-2 drop-shadow-md">{todayTask.title}</h2>
                        <p className="text-sm text-zinc-400 leading-relaxed">{todayTask.description}</p>
                    </div>
                    <Link href={`/day/${todayTask.day}`} className="block w-full relative z-10" style={{ transform: "translateZ(30px)" }}>
                        <motion.button 
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95, rotate: [0, -2, 2, -2, 0] }}
                            className="w-full bg-white text-black hover:bg-zinc-200 py-3.5 rounded-xl font-bold text-sm shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                        >
                            Open Today's Challenge
                        </motion.button>
                    </Link>
                </motion.div>

                {/* Night Owl Deck */}
                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 relative shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Headphones className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Night Owl Deck</span>
                        </div>
                        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full text-zinc-300">Focus Mode</span>
                    </div>
                    
                    <div className="flex items-center justify-between bg-black/40 rounded-2xl p-4 border border-white/5 mb-4">
                        <div>
                            <div className="text-[10px] font-bold text-zinc-500 tracking-widest mb-1">POMODORO</div>
                            <div className="text-2xl font-black text-white font-mono">{formatTime(secondsLeft)}</div>
                        </div>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setTimerActive(!timerActive)}
                                className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 hover:bg-indigo-500/30 transition-all"
                            >
                                {timerActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                            </button>
                            <button 
                                onClick={() => { setTimerActive(false); setSecondsLeft(25 * 60); }}
                                className="h-10 w-10 rounded-full bg-white/5 text-zinc-400 flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full bg-black/40 border border-white/5 rounded-xl p-3 text-xs font-bold text-zinc-300 outline-none flex justify-between items-center hover:bg-white/5 transition-colors z-20 relative"
                        >
                            <span className="flex items-center">{getTrackIcon(selectedTrack)} {selectedTrack}</span>
                            <ChevronLeft className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-90' : '-rotate-90'}`} />
                        </button>
                        {isDropdownOpen && (
                            <>
                                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-xl overflow-hidden z-20 shadow-xl shadow-black"
                                >
                                    {tracks.map((track, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setSelectedTrack(track); setIsDropdownOpen(false); }}
                                            className="w-full flex items-center text-left px-4 py-3 text-xs font-bold text-zinc-300 hover:bg-indigo-500/20 hover:text-indigo-300 transition-colors border-b border-white/5 last:border-0"
                                        >
                                            {getTrackIcon(track)} {track}
                                        </button>
                                    ))}
                                </motion.div>
                            </>
                        )}
                    </div>
                </div>

                <div className="bg-[#111] border border-white/5 rounded-3xl p-5 relative overflow-hidden shadow-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                            <Flame className="w-4 h-4 text-orange-500" />
                            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Live Ghost Sprint</span>
                        </div>
                        <span className="text-[10px] font-bold bg-white/10 px-2 py-1 rounded-full text-zinc-300">Day {todayTask.day} Race</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full overflow-hidden bg-white/5 border border-white/10 shrink-0">
                            <img src={`https://api.dicebear.com/7.x/bottts/svg?seed=Rival99`} alt="rival" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 space-y-2">
                            <div className="flex justify-between items-end">
                                <span className="text-sm font-bold text-white">ShadowCoder_99</span>
                                <span className="text-[10px] text-zinc-500">Status: Compiling...</span>
                            </div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative">
                                <motion.div
                                    animate={{ width: `${ghostProgress}%` }}
                                    transition={{ duration: 1 }}
                                    className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                                />
                            </div>
                        </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4 text-center">Submit your challenge before they do to win a Sprint Badge!</p>
                </div>

                {student.achievements.length > 0 && (() => {
                    let nextTier = "Tier II";
                    let tierProgress = 0;
                    if (currentDay < 15) {
                        nextTier = "Tier II";
                        tierProgress = Math.round((currentDay / 15) * 100);
                    } else if (currentDay < 30) {
                        nextTier = "Tier III";
                        tierProgress = Math.round(((currentDay - 15) / 15) * 100);
                    } else if (currentDay < 60) {
                        nextTier = "Master Tier";
                        tierProgress = Math.round(((currentDay - 30) / 30) * 100);
                    } else {
                        nextTier = "Max Level";
                        tierProgress = 100;
                    }

                    return (
                        <div className="space-y-3 pb-8">
                            <div className="flex justify-between items-end mb-1">
                                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Your Trophies</h3>
                                <span className="text-[10px] font-bold text-indigo-400">{tierProgress}% to {nextTier}</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden border border-white/5 relative mb-4">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${tierProgress}%` }}
                                    transition={{ duration: 1.5, delay: 0.5 }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                                />
                            </div>
                            <div className="flex flex-wrap gap-2">
                            {student.achievements.map((badge, i) => (
                                <span key={i} className="text-xs font-medium bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-zinc-300 flex items-center gap-2">
                                    <Trophy className="w-3 h-3 text-yellow-500" /> {badge}
                                </span>
                            ))}
                                </div>
                            </div>
                    );
                })()}
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

            <AnimatePresence>
                {isCardModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={() => setIsCardModalOpen(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
                            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotateY: -90 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            style={{ transformStyle: "preserve-3d" }}
                            className="bg-zinc-900 border border-white/20 rounded-3xl p-6 w-full max-w-[320px] shadow-[0_0_50px_rgba(99,102,241,0.3)] relative overflow-hidden"
                        >
                            <motion.div 
                                animate={{ x: ["-100%", "200%"] }} 
                                transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
                                className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 z-0 pointer-events-none" 
                            />
                            
                            <div className="text-center relative z-10" style={{ transform: "translateZ(40px)" }}>
                                <div className="w-24 h-24 mx-auto rounded-full border-2 border-indigo-500 overflow-hidden shadow-[0_0_20px_rgba(99,102,241,0.5)] mb-4 bg-zinc-900 flex items-center justify-center">
                                    <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${student.name}&backgroundColor=transparent`} alt="avatar" className="w-full h-full object-cover scale-125 translate-y-1" />
                                </div>
                                <h2 className="text-2xl font-black text-white drop-shadow-md">{student.name}</h2>
                                <p className="text-indigo-400 font-bold text-sm tracking-widest uppercase mt-1">HyperFusion Hacker</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-8 relative z-10" style={{ transform: "translateZ(20px)" }}>
                                <div className="bg-black/50 rounded-xl p-3 text-center border border-white/5">
                                    <Flame className="w-6 h-6 mx-auto mb-1 text-orange-500" />
                                    <div className="text-xl font-bold">{student.currentStreak}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Streak</div>
                                </div>
                                <div className="bg-black/50 rounded-xl p-3 text-center border border-white/5">
                                    <Trophy className="w-6 h-6 mx-auto mb-1 text-yellow-400" />
                                    <div className="text-xl font-bold">{student.achievements.length}</div>
                                    <div className="text-[10px] text-zinc-500 uppercase font-bold">Badges</div>
                                </div>
                            </div>
                            
                            <div className="mt-8 relative z-10" style={{ transform: "translateZ(30px)" }}>
                                <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-3 rounded-xl font-bold text-sm transition-all shadow-[0_0_15px_rgba(99,102,241,0.5)]">
                                    Download for LinkedIn
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