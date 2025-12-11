"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function GSAPHero() {
    const heroRef = useRef<HTMLDivElement>(null);
    const timelineRef = useRef<any>(null);
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        // Skip all GSAP animations if user prefers reduced motion
        if (reduceMotion) {
            console.log("Reduced motion detected - skipping GSAP animations");
            // Ensure elements are visible when motion is reduced
            if (heroRef.current) {
                const title = heroRef.current.querySelector(".g-hero-title");
                const sub = heroRef.current.querySelector(".g-hero-sub");
                const cta = heroRef.current.querySelector(".g-hero-cta");
                if (title) (title as HTMLElement).style.opacity = "1";
                if (sub) (sub as HTMLElement).style.opacity = "1";
                if (cta) (cta as HTMLElement).style.opacity = "1";
            }
            return;
        }

        // Dynamic import of GSAP to avoid SSR issues
        const initGSAP = async () => {
            const gsap = (await import("gsap")).default;
            const { ScrollTrigger } = await import("gsap/ScrollTrigger");

            // Register ScrollTrigger plugin
            gsap.registerPlugin(ScrollTrigger);

            // Small delay to ensure DOM is ready and avoid conflicts
            await new Promise(resolve => setTimeout(resolve, 50));

            // Use gsap.context for proper cleanup in React, scoped to heroRef
            const ctx = gsap.context(() => {
                if (!heroRef.current) return;

                // Create timeline for sequential reveals
                const tl = gsap.timeline({
                    defaults: {
                        ease: "power3.out",
                    }
                });

                // Set initial states first (scoped to heroRef)
                const title = heroRef.current.querySelector(".g-hero-title");
                const sub = heroRef.current.querySelector(".g-hero-sub");
                const cta = heroRef.current.querySelector(".g-hero-cta");

                if (title) gsap.set(title, { opacity: 0, y: 40 });
                if (sub) gsap.set(sub, { opacity: 0, y: 30 });
                if (cta) gsap.set(cta, { opacity: 0, y: 20, scale: 0.95 });

                // Staggered reveal sequence: H1 → Subhead → CTA
                if (title) {
                    tl.to(title, {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                    });
                }
                if (sub) {
                    tl.to(sub, {
                        opacity: 1,
                        y: 0,
                        duration: 0.7,
                    }, "-=0.4"); // Overlap slightly
                }
                if (cta) {
                    tl.to(cta, {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.15, // Stagger between buttons
                    }, "-=0.3");
                }

                // Ensure elements are visible after animation completes
                tl.call(() => {
                    if (title) gsap.set(title, { clearProps: "opacity,y" });
                    if (sub) gsap.set(sub, { clearProps: "opacity,y" });
                    if (cta) gsap.set(cta, { clearProps: "opacity,y,scale" });
                });

                // Parallax background with ScrollTrigger
                gsap.to(".g-hero-bg", {
                    scrollTrigger: {
                        trigger: heroRef.current,
                        start: "top top",
                        end: "bottom top",
                        scrub: 0.6,
                    },
                    y: 150,
                    scale: 1.1,
                    ease: "none",
                });

                timelineRef.current = tl;
            }, heroRef); // Scope to heroRef

            return () => ctx.revert(); // Cleanup
        };

        const cleanupPromise = initGSAP();

        // Cleanup function for the effect
        return () => {
            cleanupPromise.then(cleanup => cleanup && cleanup());
        };
    }, [reduceMotion]);

    return (
        <section
            id="hero"
            ref={heroRef}
            className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-background text-main"
        >
            {/* Parallax Background */}
            <div
                className="g-hero-bg absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-surface/30 via-background to-background opacity-60"
                style={{ willChange: "transform, opacity" }}
            />

            {/* Content */}
            <div className="relative z-10 max-w-5xl w-full text-center px-6 space-y-8">
                {/* H1 - Main Headline */}
                <h1
                    className="g-hero-title text-5xl md:text-7xl lg:text-8xl font-serif font-bold tracking-tight leading-tight"
                    style={{ willChange: "transform, opacity", opacity: reduceMotion ? 1 : undefined }}
                >
                    I build systems that <span className="text-accent">refuse to be cheated.</span>
                </h1>

                {/* Subhead */}
                <div
                    className="g-hero-sub max-w-3xl mx-auto"
                    style={{ willChange: "transform, opacity", opacity: reduceMotion ? 1 : undefined }}
                >
                    <h2 className="text-xl md:text-2xl text-muted font-mono leading-relaxed">
                        Python for logic. React for clarity. Solidity for truth. Every layer built to resist failure.
                    </h2>
                </div>

                {/* CTA Buttons */}
                <div
                    className="g-hero-cta flex flex-col sm:flex-row gap-4 justify-center items-center pt-8"
                    style={{ willChange: "transform, opacity", opacity: reduceMotion ? 1 : undefined }}
                >
                    <Link
                        href="/projects"
                        className="px-8 py-4 bg-accent text-white font-bold tracking-wider hover:bg-accent/80 shadow-[0_0_20px_rgba(139,30,30,0.3)] hover:shadow-[0_0_30px_rgba(139,30,30,0.5)] transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                    >
                        View Projects
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-12 animate-bounce">
                <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
            </div>
        </section>
    );
}
