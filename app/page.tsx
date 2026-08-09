"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Rocket, Zap, Flame, ChevronRight, Menu, Folder } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col w-full relative overflow-hidden">
      
      {/* Binary Background Texture */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-50 md:opacity-60">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute top-0 flex flex-col font-mono font-bold text-purple-400/30 text-[14px] leading-[2.5]"
            style={{ left: `${i * 7}%` }}
            animate={{ y: i % 2 === 0 ? ["0%", "-50%"] : ["-50%", "0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="whitespace-pre text-center">
              0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1
            </div>
            <div className="whitespace-pre text-center">
              0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1{"\n"}0{"\n"}1
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Centered Content Container */}
      <div className="mx-auto w-full p-6 md:px-16 md:py-10 lg:px-24 lg:py-12 flex-1 flex flex-col relative z-10">
      
      {/* Header */}
      <div className="flex justify-start items-center w-full relative z-20 mb-8 pt-2">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-white fill-white" />
          <span className="font-bold text-lg tracking-wider">ABTALKS</span>
        </div>
      </div>

      <div 
        className="absolute top-20 right-0 w-40 h-40 bg-purple-600/20 rounded-full blur-[60px] pointer-events-none"
      />
      <div 
        className="absolute bottom-20 left-0 w-40 h-40 bg-indigo-600/20 rounded-full blur-[60px] pointer-events-none"
      />

      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="flex-1 flex flex-col justify-center text-center space-y-6 z-10 w-full max-w-[500px] relative mt-12 mx-auto">
        
        {/* Exclusives Tag - Centered perfectly */}
        <div className="flex justify-center w-full mb-6">
          <div className="inline-flex items-center gap-2 bg-[#120824] border border-purple-500/30 px-3 py-1.5 rounded-full text-[10px] font-bold text-purple-300 uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <Zap className="w-3 h-3 text-purple-400 fill-purple-400" />
            ABTALKS EXCLUSIVES
          </div>
        </div>

        {/* Hero Typography */}
        <div className="space-y-4 w-full text-left">
          <h1 className="text-[2.5rem] md:text-[3.5rem] font-black leading-[1.1] tracking-tight flex flex-col">
            <span className="text-white whitespace-nowrap">The 60-Day</span>
            <span className="text-[#d87aff] whitespace-nowrap">Coding Challenge</span>
          </h1>
          <p className="text-zinc-300 text-[15px] leading-relaxed font-medium pr-4">
            Pick a track, build something every day, and maintain a public learning streak to become visible to top recruiters.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-3 gap-3 w-full pt-4">
            <div className="flex flex-col items-center text-center bg-[#0a0a0a]/80 border border-white/5 rounded-2xl p-4 gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-indigo-400" />
                </div>
                <div className="space-y-1">
                    <div className="text-xs font-bold text-white leading-tight">Build Daily</div>
                    <div className="text-[10px] text-zinc-500 leading-tight">Solve, code &<br/>ship daily</div>
                </div>
            </div>
            
            <div className="flex flex-col items-center text-center bg-[#0a0a0a]/80 border border-white/5 rounded-2xl p-4 gap-3 shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-orange-500/5 opacity-50"></div>
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center relative z-10">
                    <Flame className="w-5 h-5 text-orange-500" />
                </div>
                <div className="space-y-1 relative z-10">
                    <div className="text-xs font-bold text-white leading-tight">Keep Streak</div>
                    <div className="text-[10px] text-zinc-500 leading-tight">Maintain<br/>consistency</div>
                </div>
            </div>
            
            <div className="flex flex-col items-center text-center bg-[#0a0a0a]/80 border border-white/5 rounded-2xl p-4 gap-3 shadow-lg">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                    <Rocket className="w-5 h-5 text-purple-400" />
                </div>
                <div className="space-y-1">
                    <div className="text-xs font-bold text-white leading-tight">Get Hired</div>
                    <div className="text-[10px] text-zinc-500 leading-tight">Get noticed by<br/>top recruiters</div>
                </div>
            </div>
        </div>

        {/* CTA Section */}
        <div className="pt-4 space-y-6 w-full pb-20">
          <Link href="/dashboard" className="block w-full">
            <motion.button 
              whileTap={{ scale: 0.97 }}
              className="w-full bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-white py-4 rounded-xl font-bold text-[15px] shadow-[0_0_20px_rgba(168,85,247,0.3)] flex items-center justify-center gap-2 cursor-pointer"
            >
              Start Your Journey <ChevronRight className="w-5 h-5" />
            </motion.button>
          </Link>
          
          <div className="flex items-center justify-center md:justify-start gap-4">
              <div className="flex -space-x-3">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=transparent" className="w-9 h-9 rounded-full border-2 border-[#050505] bg-black" alt="student" />
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=transparent" className="w-9 h-9 rounded-full border-2 border-[#050505] bg-black" alt="student" />
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mike&backgroundColor=transparent" className="w-9 h-9 rounded-full border-2 border-[#050505] bg-black" alt="student" />
              </div>
              <div className="flex flex-col text-left">
                <p className="text-[10px] text-white font-bold uppercase tracking-wider leading-tight">
                  JOIN 2,400+ STUDENTS*
                </p>
                <p className="text-zinc-500 font-medium normal-case tracking-normal text-[11px] mt-0.5">
                  and start building today
                </p>
              </div>
          </div>
        </div>
      </motion.div>
      </div>
      
      {/* Bottom Wave decoration mimicking the reference */}
      <div className="absolute bottom-0 left-0 w-full h-[200px] pointer-events-none opacity-40">
        <svg viewBox="0 0 390 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M-20 200C50 150 120 180 200 130C280 80 340 100 410 50V250H-20V200Z" fill="url(#paint0_linear)" />
          <path d="M-20 200C30 180 150 120 220 160C290 200 360 120 410 80V250H-20V200Z" fill="url(#paint1_linear)" />
          <defs>
            <linearGradient id="paint0_linear" x1="195" y1="50" x2="195" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4F46E5" stopOpacity="0.15" />
              <stop offset="1" stopColor="#050505" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="paint1_linear" x1="195" y1="80" x2="195" y2="250" gradientUnits="userSpaceOnUse">
              <stop stopColor="#9333EA" stopOpacity="0.15" />
              <stop offset="1" stopColor="#050505" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

    </div>
  );
}