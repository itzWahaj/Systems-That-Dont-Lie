"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface ScrollRevealWrapperProps {
    children: React.ReactNode;
    className?: string;
}

// Helper to check reduced motion preference
const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function ScrollRevealWrapper({ children, className = "" }: ScrollRevealWrapperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        if (!containerRef.current) return;

        // Skip ScrollReveal if reduced motion is preferred
        if (reduceMotion || prefersReducedMotion()) {
            // Set all .sr-elem to visible immediately
            const elements = containerRef.current.querySelectorAll(".sr-elem");
            elements.forEach((el) => {
                (el as HTMLElement).style.opacity = "1";
                (el as HTMLElement).style.transform = "none";
            });
            return;
        }

        // Dynamic import of ScrollReveal
        const initScrollReveal = async () => {
            const ScrollReveal = (await import("scrollreveal")).default;

            const sr = ScrollReveal({
                distance: "24px",
                duration: 600,
                interval: 80,
                origin: "bottom",
                reset: false,
                mobile: true,
                opacity: 0,
                scale: 1,
                easing: "cubic-bezier(0.22, 0.88, 0.35, 1)",
            });

            // Reveal all elements with .sr-elem class
            const elements = containerRef.current?.querySelectorAll(".sr-elem");
            if (elements && elements.length > 0) {
                sr.reveal(elements);
            }
        };

        initScrollReveal();
    }, [reduceMotion]);

    return (
        <div ref={containerRef} className={className}>
            {children}
        </div>
    );
}
