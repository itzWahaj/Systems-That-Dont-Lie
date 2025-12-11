"use client";

import { useEffect, useRef, ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimeStaggerProps {
    children: ReactNode;
    className?: string;
}

// Helper to check reduced motion preference
const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function AnimeStagger({ children, className = "" }: AnimeStaggerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        if (!containerRef.current) return;

        const items = containerRef.current.querySelectorAll(".anime-item");

        // If reduced motion is preferred, set final styles immediately
        if (reduceMotion || prefersReducedMotion()) {
            items.forEach((item) => {
                (item as HTMLElement).style.opacity = "1";
                (item as HTMLElement).style.transform = "none";
            });
            return;
        }

        // Dynamic import of anime.js to avoid SSR issues
        const initAnime = async () => {
            try {
                // anime.js v4 exports as a namespace
                const animeModule = await import("animejs");
                
                // Get the animate and stagger functions
                // In ES module imports, these are named exports
                const animate = animeModule.animate;
                const stagger = animeModule.stagger;

                if (!animate || typeof animate !== "function") {
                    console.error("anime.js animate function not found. Available:", Object.keys(animeModule));
                    return;
                }

                if (!stagger || typeof stagger !== "function") {
                    console.error("anime.js stagger function not found. Available:", Object.keys(animeModule));
                    return;
                }

                // Run staggered animation using v4 API
                // animate(targets, parameters)
                animate(items, {
                    translateY: [18, 0],
                    opacity: [0, 1],
                    delay: stagger(80), // 80ms stagger between items
                    duration: 520,
                    easing: "cubicBezier(.22,.88,.35,1)",
                });
            } catch (error) {
                console.error("Failed to load anime.js:", error);
            }
        };

        initAnime();

        // Cleanup: animations will complete naturally
        // In v4, we could store animation references and call .stop() if needed
    }, [reduceMotion]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
