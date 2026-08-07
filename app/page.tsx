"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6 mx-auto w-full max-w-[390px] border-x border-white/5 font-sans flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-64 bg-indigo-500/10 blur-[100px] pointer-events-none"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center space-y-6 z-10 w-full">
        <div className="inline-block bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">
          ABTalks
        </div>

        <h1 className="text-4xl font-black leading-tight text-white">
          The 60-Day <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
            Coding Challenge
          </span>
        </h1>

        <p className="text-zinc-400 text-sm leading-relaxed px-2">
          Pick a track, build something every day, and maintain a public learning streak to become visible to top recruiters.
        </p>

        <div className="pt-8 space-y-4 w-full">
          <Link href="/dashboard" className="block w-full">
            <button className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-4 rounded-xl font-bold text-[15px] transition-all shadow-[0_0_20px_rgba(99,102,241,0.3)]">
              Start Your Journey
            </button>
          </Link>
          <p className="text-xs text-zinc-500 font-medium">Join thousands of Indian college students.</p>
        </div>
      </motion.div>
    </div>
  );
}