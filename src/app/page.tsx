"use client";

import React from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { motion } from "framer-motion";
import { ArrowRight, Hexagon, Triangle, Circle, Square, Command } from "lucide-react";
import Link from "next/link";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "600", "700"] });
const sans = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function LandingPage() {
  return (
    <div className={`${sans.className} relative min-h-screen w-full bg-[#fdfdfd] overflow-hidden text-slate-900 selection:bg-blue-100`}>
      {/* Decorative Aurora Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Top Left - Soft Blue */}
        <div className="absolute -top-[15%] -left-[10%] w-[70%] h-[70%] rounded-full bg-blue-300/15 blur-[140px] mix-blend-soft-light opacity-60 animate-blob" />

        {/* Top Right - Airy Sky */}
        <div className="absolute top-[5%] -right-[15%] w-[60%] h-[60%] rounded-full bg-sky-200/15 blur-[140px] mix-blend-soft-light opacity-60 animate-blob animation-delay-2000" />

        {/* Bottom Center - Deep Indigo Mist */}
        <div className="absolute -bottom-[25%] left-[15%] w-[80%] h-[80%] rounded-full bg-indigo-200/10 blur-[160px] mix-blend-soft-light opacity-50 animate-blob animation-delay-4000" />
      </div>

      {/* Navigation */}
      <header className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-xl font-bold tracking-tighter">
          <Command className="w-6 h-6 text-blue-600" />
          <span className="tracking-tight">billstack</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[13px] font-semibold uppercase tracking-widest text-slate-500">
          <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-blue-600 transition-colors">Pricing</a>
          <a href="/docs" className="hover:text-blue-600 transition-colors">Docs</a>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" className="px-7 py-2 text-sm font-bold text-blue-700 bg-blue-50 rounded-full hover:bg-blue-100 transition-all">
            Log in
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center pt-20 pb-24 md:pt-32 md:pb-40 px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="flex flex-col items-center w-full max-w-4xl mx-auto"
        >
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-8 border border-blue-200/50 backdrop-blur-sm shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            Now in Public Beta
          </div>

          {/* Main Heading */}
          <h1 className={`${playfair.className} text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 mb-8 leading-[1.05]`}>
            Billing for Indie Makers, <br />
            <span className="italic text-blue-600">Simplified.</span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-md md:text-xl text-slate-500 mb-10 leading-relaxed font-medium">
            Run a secure, ready-made billing system for your tenants. <br />Multi-tenancy with built-in RLS protection.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <Link href="/signup" className="  md:w-1/4 sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-blue-500/25 hover:shadow-2xl hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group">
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Dashboard Image */}
          <div className="mt-16 w-full relative animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both ease-out">
            <div className="absolute inset-0 bg-linear-to-t from-[#fdfdfd] to-transparent z-10 h-32 bottom-0"></div>
            <div className="rounded-2xl border border-slate-200 bg-white/50 backdrop-blur-md shadow-2xl p-2 max-w-5xl mx-auto overflow-hidden">
              <img
                alt="Billstack Dashboard"
                className="rounded-xl w-full grayscale-[0.05] opacity-95"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_GC3GNcFyK482_nMiYEgPDwTUdypKSu1aLRRmrX9WYTlmWnqQ4LDe5bBPmtqlLU2ZbZzbJRDpTUFGglBGdpz37aF4As_QWBf1SEnpOjpTtKrruMWsEU2PJauhPJQmRTWcLHqrbHgDotkg5mFi655g-PizvQUE75G8hzXpGTGFawBi1aV5EDMn6TYEC2yVywQ8IBU8VE9oelrb_1w7oEsy33TVVQpJXOWEwjM-F0VZLhpgMmaNek850TjqG3Y3CtxN_g8Zy7dBW-sS"
              />
            </div>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/60 relative z-10 backdrop-blur-sm border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-12">
              <div className="space-y-4">
                <h2 className={`${playfair.className} text-4xl md:text-5xl font-semibold tracking-tight leading-tight text-slate-900`}>Secure & Scalable <br /> Infrastructure</h2>
                <p className="text-slate-600 text-lg leading-relaxed font-medium">Built for the modern SaaS stack, Billstack takes the complexity out of tenant isolation and domain routing.</p>
              </div>
              <div className="grid gap-8">
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Custom Subdomain</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Give each tenant their own branded workspace effortlessly. We handle the SSL and DNS routing automatically.</p>
                  </div>
                </div>
                <div className="flex gap-6 group">
                  <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm border border-blue-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900">Data Isolation</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Built-in Row Level Security (RLS) protection ensures your data stays private and secure between different accounts.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative animate-in fade-in slide-in-from-right-8 duration-1000 delay-500 fill-mode-both">
              <div className="aspect-square bg-slate-50/80 rounded-3xl p-8 border border-slate-200/60 shadow-inner flex flex-col justify-center gap-4 backdrop-blur-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-100/50 rounded-full blur-3xl -mr-20 -mt-20"></div>

                <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center justify-between relative z-10 transition-transform hover:-translate-y-1 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                    </div>
                    <span className="font-bold text-slate-900">Tenant A Isolation</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400 bg-slate-50 px-2 py-1 rounded">UUID: 829-1X</span>
                </div>

                <div className="bg-white/80 p-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between opacity-60 grayscale-[0.5] relative z-10 transition-all hover:opacity-80 duration-300">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                    </div>
                    <span className="font-bold text-slate-700">Tenant B Data</span>
                  </div>
                  <span className="text-xs font-mono text-red-500/80 bg-red-50 px-2 py-1 rounded font-semibold">Access Denied</span>
                </div>

                <div className="absolute -top-4 -right-4 bg-slate-900 text-white p-4 rounded-2xl shadow-xl z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className={`text-4xl md:text-5xl font-semibold text-slate-900 tracking-tight ${playfair.className}`}>Simple, Transparent Pricing</h2>
            <p className="text-slate-600 font-medium text-lg max-w-xl mx-auto">Scale your SaaS without worrying about unexpected billing costs.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Starter Plan */}
            <div className="bg-white/70 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 overflow-hidden hover:shadow-blue-900/5 transition-shadow duration-500 flex flex-col">
              <div className="p-8 md:p-10 flex flex-col h-full relative overflow-hidden">
                <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-slate-50 to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-100 pb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-900">Starter</h3>
                    <p className="text-slate-500 font-medium">For early stage indie makers</p>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex items-end gap-1">
                    <div className="text-5xl font-black text-slate-900 tracking-tight">₹199</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">/ month</div>
                  </div>
                </div>

                <div className="space-y-5 mb-10 relative z-10 flex-grow">
                  {[
                    "Up to 3 users",
                    "Basic analytics",
                    "Email support"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-white text-slate-900 border-2 border-slate-200 py-3.5 rounded-xl text-lg font-bold hover:border-slate-300 hover:bg-slate-50 transition-all relative z-10">
                  Join Beta
                </button>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl shadow-blue-500/10 border-2 border-blue-500 overflow-hidden hover:shadow-blue-500/20 transition-all duration-500 flex flex-col relative scale-[1.02]">
              {/* Popular Badge */}
              <div className="absolute top-0 inset-x-0 flex justify-center z-20">
                <div className="bg-blue-500 text-white text-xs font-bold uppercase tracking-widest py-1 px-4 rounded-b-xl shadow-sm">
                  Most Popular
                </div>
              </div>

              <div className="p-8 md:p-10 flex flex-col h-full relative overflow-hidden mt-2">
                <div className="absolute top-0 right-0 w-full h-full bg-linear-to-br from-blue-50/50 to-transparent pointer-events-none"></div>

                <div className="flex items-center justify-between mb-8 relative z-10 border-b border-blue-100 pb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-1 text-slate-900">Pro</h3>
                    <p className="text-slate-500 font-medium">For scaling SaaS businesses</p>
                  </div>
                </div>

                <div className="mb-8 relative z-10">
                  <div className="flex items-end gap-1">
                    <div className="text-5xl font-black text-slate-900 tracking-tight">₹499</div>
                    <div className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-2">/ month</div>
                  </div>
                </div>

                <div className="space-y-5 mb-10 relative z-10 flex-grow">
                  {[
                    "Up to 25 users",
                    "Advanced analytics",
                    "Priority support",
                    "Custom domain & SSL",
                    "Built-in RLS"
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                      <div className="shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center shadow-sm shadow-blue-500/30">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                      </div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl text-lg font-bold shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all relative z-10">
                  Get Full Access
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="bg-white/90 backdrop-blur-md border-t border-slate-200 py-12 relative z-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-slate-900" />
              <span className="text-lg font-bold tracking-tight text-slate-900">billstack</span>
            </div>

            <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
              <Link className="hover:text-blue-600 transition-colors" href="#">Terms</Link>
              <Link className="hover:text-blue-600 transition-colors" href="#">Privacy</Link>
              <Link className="hover:text-blue-600 transition-colors" href="mailto:hello@billstack.app">Contact</Link>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm font-medium text-slate-400">© 2026 Billstack Technologies. All rights reserved.</p>
            <div className="flex gap-6 text-slate-400">
              <Link className="hover:text-slate-900 transition-colors" href="#" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
              </Link>
              <Link className="hover:text-slate-900 transition-colors" href="#" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" /><path d="M9 18c-4.51 2-5-2-7-2" /></svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>



    </div>
  );
}
