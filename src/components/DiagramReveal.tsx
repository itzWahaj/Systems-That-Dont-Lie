"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DiagramRevealProps {
    src: string; // Image or SVG source
    alt: string;
    className?: string;
}

// Helper to check reduced motion preference
const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function DiagramReveal({ src, alt, className = "" }: DiagramRevealProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isRevealed, setIsRevealed] = useState(false);
    const [imageError, setImageError] = useState(false);
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        if (!containerRef.current) return;

        // If reduced motion, show immediately without animation
        if (reduceMotion || prefersReducedMotion()) {
            setIsRevealed(true);
            return;
        }

        // Use ScrollReveal for mask animation
        const initReveal = async () => {
            const ScrollReveal = (await import("scrollreveal")).default;

            const sr = ScrollReveal({
                distance: "0px",
                duration: 1200,
                opacity: 1,
                scale: 1,
                reset: false,
                beforeReveal: () => {
                    setIsRevealed(true);
                },
            });

            if (containerRef.current) {
                sr.reveal(containerRef.current);
            }
        };

        initReveal();
    }, [reduceMotion]);

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${className}`}
        >
            {/* Mask overlay for reveal effect */}
            {!isRevealed && !reduceMotion && !prefersReducedMotion() && (
                <div
                    className="absolute inset-0 bg-gradient-to-r from-surface via-background to-surface animate-mask-reveal"
                    style={{
                        animation: "maskReveal 1.2s cubic-bezier(0.22, 0.88, 0.35, 1) forwards",
                    }}
                />
            )}

            {/* Image/SVG or Placeholder */}
            {imageError ? (
                <div className="w-full h-full flex items-center justify-center bg-surface/30 border border-gray-800 rounded-sm min-h-[200px]">
                    <div className="text-center text-gray-500 text-sm p-4">
                        <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                        </svg>
                        <p className="text-xs mt-2">Diagram placeholder</p>
                        <p className="text-xs text-gray-600 mt-1">{alt}</p>
                    </div>
                </div>
            ) : (
                <img
                    src={src}
                    alt={alt}
                    onError={() => setImageError(true)}
                    className={`w-full h-auto transition-opacity duration-300 ${isRevealed || reduceMotion || prefersReducedMotion() ? "opacity-100" : "opacity-0"
                        }`}
                />
            )}

            <style jsx>{`
                @keyframes maskReveal {
                    0% {
                        clip-path: inset(0 100% 0 0);
                    }
                    100% {
                        clip-path: inset(0 0 0 0);
                    }
                }
            `}</style>
        </div>
    );
}
