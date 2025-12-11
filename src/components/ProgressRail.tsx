"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { useMotion } from "@/components/MotionProvider";
import { Zap, ZapOff } from "lucide-react";

const chapters = [
    { id: "hero", label: "Start" },
    { id: "origin", label: "Origin" },
    { id: "trials", label: "Trials" },
    { id: "craft", label: "Craft" },
    { id: "impact", label: "Impact" },
    { id: "contact", label: "The Ask" },
];

export default function ProgressRail() {
    const [activeChapter, setActiveChapter] = useState("hero");
    const { scrollYProgress } = useScroll();
    const scaleY = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            const viewportHeight = window.innerHeight;

            // Calculate active index based on scroll position relative to viewport height
            // Each section takes up roughly 100vh of scroll distance in the pinned timeline
            const activeIndex = Math.floor((scrollPosition + viewportHeight / 3) / viewportHeight);

            // Clamp index to bounds
            const safeIndex = Math.min(Math.max(activeIndex, 0), chapters.length - 1);

            setActiveChapter(chapters[safeIndex].id);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="fixed left-6 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-4 z-50">
            <div className="absolute left-[7px] top-0 bottom-0 w-[2px] bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                    className="w-full bg-accent origin-top"
                    style={{ scaleY, height: "100%" }}
                />
            </div>

            {chapters.map((chapter) => (
                <div key={chapter.id} className="relative flex items-center group">
                    <div
                        className={`w-4 h-4 rounded-full border-2 transition-colors duration-300 z-10 ${activeChapter === chapter.id
                            ? "bg-accent border-accent"
                            : "bg-background border-gray-600 group-hover:border-white"
                            }`}
                    />
                    <span
                        className={`absolute left-8 text-xs font-mono uppercase tracking-widest transition-all duration-300 ${activeChapter === chapter.id
                            ? "opacity-100 translate-x-0 text-white"
                            : "opacity-0 -translate-x-2 text-gray-500 group-hover:opacity-100 group-hover:translate-x-0"
                            }`}
                    >
                        {chapter.label}
                    </span>
                </div>
            ))}

            <div className="mt-8 pl-1">
                <MotionToggle />
            </div>
        </div>
    );
}

function MotionToggle() {
    const { reduceMotion, toggleMotion } = useMotion();
    return (
        <button
            onClick={toggleMotion}
            className="p-2 text-gray-500 hover:text-white transition-colors"
            title={reduceMotion ? "Enable Motion" : "Reduce Motion"}
        >
            {reduceMotion ? <ZapOff className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
        </button>
    );
}
