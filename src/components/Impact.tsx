"use client";

import { motion } from "framer-motion";
import { CheckCircle, Clock, Database } from "lucide-react";
import AnimeStagger from "./AnimeStagger";

export default function Impact() {
    return (
        <section id="impact" className="min-h-screen w-full flex items-center justify-center py-24 px-6 bg-background relative">
            <div className="max-w-5xl w-full">
                <div className="mb-16 text-center">
                    <span className="text-secondary font-mono text-sm tracking-widest uppercase">Chapter 4 — Evidence</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4">The Weight of Proof</h2>
                </div>

                <AnimeStagger className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "rgba(199, 58, 49, 0.5)" }}
                        className="anime-item p-8 border border-gray-800 bg-surface/50 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Database className="w-6 h-6 text-accent" />
                            </div>
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-mono group-hover:text-accent transition-colors duration-300">Forever</div>
                            <div className="text-accent font-bold uppercase tracking-widest text-sm mb-2">Auditability Window</div>
                            <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">Immutable on-chain records.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "rgba(199, 58, 49, 0.5)" }}
                        className="anime-item p-8 border border-gray-800 bg-surface/50 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <Clock className="w-6 h-6 text-accent" />
                            </div>
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-mono group-hover:text-accent transition-colors duration-300">&lt; 2s</div>
                            <div className="text-accent font-bold uppercase tracking-widest text-sm mb-2">Time-to-Tally</div>
                            <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">Automated smart contract execution.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        whileHover={{ scale: 1.05, borderColor: "rgba(199, 58, 49, 0.5)" }}
                        className="anime-item p-8 border border-gray-800 bg-surface/50 transition-all duration-300 group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="relative z-10">
                            <div className="flex justify-center mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                <CheckCircle className="w-6 h-6 text-accent" />
                            </div>
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 font-mono group-hover:text-accent transition-colors duration-300">99.9%</div>
                            <div className="text-accent font-bold uppercase tracking-widest text-sm mb-2">Match Rate</div>
                            <p className="text-gray-500 text-sm group-hover:text-gray-300 transition-colors">Biometric identity binding.</p>
                        </div>
                    </motion.div>
                </AnimeStagger>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                    className="mt-16 text-center max-w-2xl mx-auto"
                >
                    <p className="text-gray-400 italic">
                        "In a trustless system, the only thing that matters is what you can prove.
                        My code doesn't just run; it stands as evidence."
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
