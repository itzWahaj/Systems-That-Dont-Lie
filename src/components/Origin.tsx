"use client";

import { motion } from "framer-motion";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 0.88, 0.35, 1]
        }
    }
};

const fadeInScale = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.7,
            ease: [0.22, 0.88, 0.35, 1]
        }
    }
};

export default function Origin() {
    const [aboutInfo, setAboutInfo] = useState({
        bio: "",
        skills: [] as string[]
    });

    useEffect(() => {
        const fetchAboutInfo = async () => {
            const { data } = await supabase
                .from('about_page')
                .select('bio, skills')
                .single();

            if (data) {
                setAboutInfo({
                    bio: data.bio || "",
                    skills: data.skills || []
                });
            }
        };
        fetchAboutInfo();
    }, []);

    return (
        <section id="origin" className="min-h-screen w-full flex items-center justify-center py-24 px-6 bg-surface relative">
            <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center relative z-10">
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                    className="space-y-8 will-change-transform"
                >
                    <div className="space-y-2">
                        <span className="text-secondary font-mono text-sm tracking-widest uppercase">Chapter 1 — Origin</span>
                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold leading-tight">
                            The Architect of <span className="text-white">Trust</span>
                        </h2>
                    </div>

                    <div className="space-y-6 text-lg text-gray-400 leading-relaxed font-sans whitespace-pre-wrap">
                        {aboutInfo.bio}
                    </div>

                    <div className="pt-4">
                        <h3 className="text-sm font-mono text-secondary uppercase tracking-wider mb-4">Arsenal</h3>
                        <div className="flex flex-wrap gap-3">
                            {aboutInfo.skills.map((tech, i) => (
                                <motion.span
                                    key={i}
                                    whileHover={{ scale: 1.05, backgroundColor: "rgba(230, 184, 91, 0.1)", borderColor: "rgba(230, 184, 91, 0.5)" }}
                                    className="px-3 py-1 text-xs font-mono text-gray-400 border border-gray-800 rounded-full cursor-crosshair transition-colors"
                                >
                                    {tech}
                                </motion.span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInScale}
                    className="relative h-[400px] md:h-[500px] w-full bg-black/50 border border-white/10 rounded-sm overflow-hidden will-change-transform group"
                >
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-700" />

                    {/* Interactive Terminal-like Display */}
                    <div className="absolute inset-0 p-8 font-mono text-xs md:text-sm text-green-500/80 overflow-hidden">
                        <div className="flex flex-col gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                            <p> &gt; SYSTEM_CHECK_INIT</p>
                            <p> &gt; VERIFYING_INTEGRITY... <span className="text-green-400">OK</span></p>
                            <p> &gt; CONNECTING_TO_MAINNET... <span className="text-green-400">CONNECTED</span></p>
                            <p> &gt; DEPLOYING_CONTRACTS...</p>
                            <div className="pl-4 border-l border-green-500/30 my-2 space-y-1 text-gray-500">
                                <p>0x71C...9A2 deployed</p>
                                <p>0x3B4...1F8 verified</p>
                            </div>
                            <p className="animate-pulse"> &gt; AWAITING_INPUT_</p>
                        </div>

                        {/* Central Interactive Element */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 flex items-center justify-center">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border border-dashed border-gray-700 rounded-full group-hover:border-accent/40 transition-colors duration-500"
                            />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-4 border border-gray-800 rounded-full group-hover:border-secondary/40 transition-colors duration-500"
                            />
                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                <span className="block text-4xl font-bold text-white/20 group-hover:text-white/80 transition-colors">99.9%</span>
                                <span className="text-[10px] uppercase tracking-widest text-gray-600 group-hover:text-accent transition-colors">Uptime</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
