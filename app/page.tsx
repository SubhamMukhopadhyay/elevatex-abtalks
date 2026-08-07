"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { Code2, Rocket, Zap, Flame, ChevronRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 mx-auto w-full max-w-[390px] border-x border-white/5 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-purple-500/5 to-transparent blur-[80px] pointer-events-none"
      />
      
      <motion.div 
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 right-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-[50px] pointer-events-none"
      />
      <motion.div 
        animate={{ y: [0, 30, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-40 left-10 w-32 h-32 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"
      />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-8 z-10 w-full relative">
        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2 backdrop-blur-md shadow-[0_0_15px_rgba(99,102,241,0.2)]">
          <Zap className="w-4 h-4 text-yellow-400" />
          ABTalks Exclusives
        </div>

        <div className="space-y-4">
          <h1 className="text-[2.5rem] font-black leading-[1.1] text-white tracking-tight drop-shadow-md">
            The 60-Day <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              Coding Challenge
            </span>
          </h1>
          <p className="text-zinc-400 text-sm leading-relaxed px-4 font-medium">
            Pick a track, build something every day, and maintain a public learning streak to become visible to top recruiters.
          </p>
        </div>

        {/* Feature Pills */}
        <div className="flex justify-center gap-3 pt-2">
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300">
                <Code2 className="w-3 h-3 text-indigo-400" /> Build Daily
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300">
                <Flame className="w-3 h-3 text-orange-400" /> Keep Streak
            </div>
            <div className="flex items-center gap-1.5 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg text-[10px] font-bold text-zinc-300">
                <Rocket className="w-3 h-3 text-purple-400" /> Get Hired
            </div>
        </div>

        <div className="pt-8 space-y-5 w-full">
          <Link href="/dashboard" className="block w-full">
            <motion.button 
              whileHover={{ scale: 1.03, boxShadow: "0px 0px 30px rgba(99,102,241,0.6)" }}
              whileTap={{ scale: 0.95, rotate: [0, -2, 2, -2, 0] }}
              transition={{ duration: 0.3 }}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-4 rounded-xl font-bold text-[15px] shadow-[0_0_20px_rgba(99,102,241,0.4)] relative overflow-hidden group border border-white/10"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <motion.div 
                  animate={{ x: ["-100%", "200%"] }} 
                  transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
                  className="absolute top-0 -left-1/4 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0 pointer-events-none" 
              />
              <span className="relative z-10 flex items-center justify-center gap-2">
                  Start Your Journey <ChevronRight className="w-4 h-4" />
              </span>
            </motion.button>
          </Link>
          <div className="flex items-center justify-center gap-2 pt-2">
              <div className="flex -space-x-2">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=John&backgroundColor=transparent" className="w-7 h-7 rounded-full border border-black bg-indigo-500/20" alt="student" />
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sarah&backgroundColor=transparent" className="w-7 h-7 rounded-full border border-black bg-purple-500/20" alt="student" />
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Mike&backgroundColor=transparent" className="w-7 h-7 rounded-full border border-black bg-pink-500/20" alt="student" />
              </div>
              <p className="text-[11px] text-zinc-500 font-bold tracking-wide">JOIN 2,400+ STUDENTS</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}