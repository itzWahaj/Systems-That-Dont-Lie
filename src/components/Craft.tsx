"use client";

import { motion } from "framer-motion";
import { ArrowRight, GitMerge, RefreshCw, ShieldCheck } from "lucide-react";
import Link from "next/link";

import AnimeStagger from "./AnimeStagger";

export default function Craft() {
  return (
    <section id="craft" className="w-full flex items-center justify-center py-12 px-4 md:px-6 bg-surface relative">
      <div className="max-w-6xl w-full space-y-8 md:space-y-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-secondary font-mono text-sm tracking-widest uppercase">Chapter 3 — The Craft</span>
          <h2 className="text-3xl md:text-5xl font-serif font-bold mt-2 md:mt-4 mb-4 md:mb-8">The Iteration of Truth</h2>
          <p className="text-lg md:text-xl text-gray-300 leading-relaxed font-light">
            My process isn't linear. It's a loop: <span className="text-white font-mono">Problem → Hypothesis → Fail → Learn → Fix.</span>
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Project Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="group relative bg-background border border-gray-800 rounded-sm overflow-hidden hover:border-accent/50 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="h-48 md:h-64 bg-gray-900 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 group-hover:scale-105 transition-transform duration-700 z-10" />
              <img
                src="/og/bbvs.png"
                alt="BBVS Project"
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
            </div>

            <div className="p-6 md:p-8 relative z-20 space-y-4 md:space-y-6">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-white font-serif mb-2">BlockVote – Decentralized Election System</h3>
                <p className="text-gray-400 text-xs md:text-sm font-mono">Polygon Testnet • Solidity • Biometric Auth</p>
              </div>

              <p className="text-gray-300 text-sm md:text-base leading-relaxed">
                A decentralized voting platform that eliminates single points of failure.
                Automated elections via smart contracts, gated by biometric WebAuthn fingerprints.
              </p>

              <div className="space-y-4 border-t border-gray-800 pt-4 md:pt-6">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-accent shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold text-sm">The Hard Failure</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Gas costs spiked during high-throughput simulation.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <RefreshCw className="w-5 h-5 text-secondary shrink-0 mt-1" />
                  <div>
                    <h4 className="text-white font-bold text-sm">The Fix</h4>
                    <p className="text-gray-400 text-xs md:text-sm">Implemented Merkle tree batching to reduce on-chain writes by 90%.</p>
                  </div>
                </div>
              </div>

              <Link
                href="/projects/bbvs"
                className="inline-flex items-center gap-2 text-accent hover:text-white transition-colors font-mono text-xs md:text-sm uppercase tracking-wider"
              >
                View Case Study <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* Process / Philosophy Side */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-8 md:space-y-12 pl-0 lg:pl-12"
          >
            <div className="space-y-6">
              <h3 className="text-2xl font-serif font-bold text-white">Engineering Philosophy</h3>
              <AnimeStagger>
                <ul className="space-y-6">
                  <li className="anime-item flex gap-4">
                    <div className="w-12 h-12 bg-surface border border-gray-800 flex items-center justify-center shrink-0 text-secondary font-mono font-bold">01</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Trust No One</h4>
                      <p className="text-gray-400 text-sm">Assume the client is compromised, the network is hostile, and the database is leaking.</p>
                    </div>
                  </li>
                  <li className="anime-item flex gap-4">
                    <div className="w-12 h-12 bg-surface border border-gray-800 flex items-center justify-center shrink-0 text-secondary font-mono font-bold">02</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Fail Loudly</h4>
                      <p className="text-gray-400 text-sm">Silent failures are the enemy. Systems should scream when they break so they can be fixed.</p>
                    </div>
                  </li>
                  <li className="anime-item flex gap-4">
                    <div className="w-12 h-12 bg-surface border border-gray-800 flex items-center justify-center shrink-0 text-secondary font-mono font-bold">03</div>
                    <div>
                      <h4 className="text-white font-bold mb-1">Simplify ruthlessly</h4>
                      <p className="text-gray-400 text-sm">Complexity is where bugs hide. If it can be done with less code, do it.</p>
                    </div>
                  </li>
                </ul>
              </AnimeStagger>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
