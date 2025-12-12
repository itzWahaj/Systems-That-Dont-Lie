"use client";

import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

import { useState } from "react";
import BookDemoModal from "./BookDemoModal";

interface BBVSHeroProps {
    title?: string;
    subtitle?: string;
    demoUrl?: string;
    repoUrl?: string;
    category?: string;
}

export function BBVSHero({ title = "", subtitle = "", demoUrl, repoUrl, category = "Project" }: BBVSHeroProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <section className="relative h-[80vh] w-full flex flex-col items-center justify-center px-6 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface/30 via-background to-background opacity-60" />

            <div className="max-w-5xl w-full text-center space-y-8 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    style={{ opacity: 1 }} // Fallback for reduced motion
                >
                    <span className="text-secondary font-mono text-sm tracking-widest uppercase">{category}</span>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif font-bold mt-4 mb-6 leading-tight">
                        {title}
                    </h1>
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="text-xl md:text-2xl text-muted max-w-3xl mx-auto font-light leading-relaxed"
                    style={{ opacity: 1 }} // Fallback for reduced motion
                >
                    {subtitle}
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                    className="flex flex-wrap gap-4 justify-center pt-8"
                    style={{ opacity: 1 }} // Fallback for reduced motion
                >
                    {demoUrl && (
                        <a
                            href={demoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 bg-accent text-white hover:bg-accent/80 shadow-[0_0_20px_rgba(139,30,30,0.3)] hover:shadow-[0_0_30px_rgba(139,30,30,0.5)] transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                        >
                            <ExternalLink className="w-5 h-5" /> View Live Demo
                        </a>
                    )}
                    {repoUrl && (
                        <a
                            href={repoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-3 border border-border text-main hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                        >
                            <Github className="w-5 h-5" /> GitHub Repo
                        </a>
                    )}
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-3 border border-border text-main hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                    >
                        <ExternalLink className="w-5 h-5" /> Book a Demo
                    </button>
                </motion.div>
            </div>

            <BookDemoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                projectTitle={title || "BlockVote"}
            />
        </section>
    );
}
