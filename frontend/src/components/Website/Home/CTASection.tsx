import React from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-br from-[#0642f0] via-[#0533c4] to-[#04298a] relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] -translate-y-1/3 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c63634]/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.3) 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 border border-white/25 text-white font-semibold text-sm mb-8 backdrop-blur-sm">
          <TrendingUp size={15} /> Start Trading Smarter Today
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight tracking-tighter mb-6 max-w-4xl mx-auto">
          The Markets Never Sleep.
          <br />
          <span className="text-white/80">Neither Should Your Data.</span>
        </h2>

        <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto leading-relaxed">
          Join thousands of traders using UpDownLive for real-time insights, expert analysis,
          and up-to-the-minute financial news.
        </p>

        <div className="flex flex-wrap gap-4 justify-center">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-[#0642f0] font-extrabold text-base shadow-xl shadow-black/20 hover:bg-white/90 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200"
          >
            Explore News <ArrowRight size={18} />
          </Link>
          <Link
            href="/forex"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white font-bold text-base hover:bg-white/15 hover:border-white hover:-translate-y-1 transition-all duration-200 backdrop-blur-sm"
          >
            View Forex Markets
          </Link>
        </div>
      </div>
    </section>
  );
}
