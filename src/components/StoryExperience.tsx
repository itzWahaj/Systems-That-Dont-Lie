"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { useReducedMotion } from "@/hooks/useReducedMotion";

import GSAPHero from "@/components/GSAPHero";
import Origin from "@/components/Origin";
import Trials from "@/components/Trials";
import Craft from "@/components/Craft";
import Impact from "@/components/Impact";
import Contact from "@/components/Contact";

export default function StoryExperience() {
    const containerRef = useRef<HTMLDivElement>(null);
    const panelsRef = useRef<(HTMLElement | null)[]>([]);
    const { reduceMotion } = useReducedMotion();
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };

        checkMobile();
        window.addEventListener("resize", checkMobile);

        return () => window.removeEventListener("resize", checkMobile);
    }, []);

    useEffect(() => {
        // Skip animations if reduced motion is enabled or on mobile
        if (reduceMotion || isMobile) {
            return;
        }
        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 1,
        });

        // Synchronize Lenis with GSAP
        lenis.on('scroll', ScrollTrigger.update);

        // Define update function for GSAP ticker
        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        // Initialize GSAP ScrollTrigger
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(() => {
            const panels = panelsRef.current;
            const totalPanels = panels.length;

            if (totalPanels === 0) return;

            // Master Timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: "top top",
                    end: "+=600%", // Explicitly set scroll distance (6 panels * 100%)
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                    pinSpacing: true,
                    // Allow scrolling within pinned content
                    onUpdate: (self) => {
                        // Check if we should allow inner scrolling
                        const activePanel = panels.find((panel, idx) => {
                            if (idx === 0) return false;
                            const progress = self.progress;
                            const panelStart = (idx - 1) / (totalPanels - 1);
                            const panelEnd = idx / (totalPanels - 1);
                            return progress >= panelStart && progress < panelEnd;
                        });

                        if (activePanel) {
                            const scrollContainer = activePanel.querySelector("div[class*='overflow-y-auto']");
                            if (scrollContainer) {
                                // Allow native scrolling within the panel
                                (scrollContainer as HTMLElement).style.pointerEvents = "auto";
                            }
                        }
                    }
                }
            });

            // Iterate through panels to create the "video" sequence
            panels.forEach((panel, i) => {
                if (i === 0) return; // Skip first panel

                const isEven = i % 2 === 0;

                // Set initial state
                gsap.set(panel, {
                    zIndex: i,
                    clipPath: isEven ? "circle(0% at 50% 50%)" : "inset(100% 0 0 0)",
                    autoAlpha: 1
                });

                // Ensure scrollable content inside panel is accessible
                const scrollContainer = panel?.querySelector("div[class*='overflow-y-auto']");
                if (scrollContainer) {
                    gsap.set(scrollContainer, {
                        overflow: "auto",
                        height: "100%"
                    });
                }

                // Animate previous panel out
                tl.to(panels[i - 1], {
                    scale: 0.9,
                    filter: "blur(10px)",
                    duration: 0.5,
                    ease: "none"
                }, ">");

                // Animate current panel in
                tl.to(panel, {
                    clipPath: isEven ? "circle(150% at 50% 50%)" : "inset(0% 0 0 0)",
                    duration: 1,
                    ease: "power2.inOut",
                    onComplete: () => {
                        // Remove clipPath after animation to allow full content display
                        gsap.set(panel, { clearProps: "clipPath" });
                    }
                }, "<");

                // Animate content (exclude hero panel content which has its own animations)
                if (i !== 0) {
                    const content = panel?.querySelectorAll("h1, h2, h3, p, .anime-item, .sr-elem");
                    if (content && content.length > 0) {
                        tl.fromTo(content,
                            { y: 50, opacity: 0 },
                            { y: 0, opacity: 1, stagger: 0.05, duration: 0.5 },
                            "-=0.5"
                        );
                    }
                }
            });

        }, containerRef);

        return () => {
            gsap.ticker.remove(update);
            ctx.revert();
            lenis.destroy();
        };
    }, [reduceMotion, isMobile]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !panelsRef.current.includes(el)) {
            panelsRef.current.push(el);
        }
    };

    // When reduced motion is enabled or on mobile, render sections normally (stacked)
    if (reduceMotion || isMobile) {
        return (
            <div className="flex flex-col w-full">
                <GSAPHero />
                <Origin />
                <Trials />
                <Craft />
                <Impact />
                <Contact />
            </div>
        );
    }

    // When motion is enabled, use the scroll-based panel system
    return (
        <div ref={containerRef} className="relative w-full h-screen overflow-hidden bg-black">
            {/* Panel 1: Hero */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-0 bg-background">
                <div className="w-full h-full overflow-hidden">
                    <GSAPHero />
                </div>
            </section>

            {/* Panel 2: Origin */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-10 bg-background invisible">
                <div className="w-full h-full overflow-y-auto scroll-container" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="w-full min-h-full flex items-center justify-center py-12">
                        <Origin />
                    </div>
                </div>
            </section>

            {/* Panel 3: Trials */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-20 bg-background invisible">
                <div className="w-full h-full overflow-y-auto scroll-container" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="w-full min-h-full flex items-center justify-center py-12">
                        <Trials />
                    </div>
                </div>
            </section>

            {/* Panel 4: Craft */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-30 bg-surface invisible">
                <div className="w-full h-full overflow-y-auto scroll-container" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="w-full min-h-full flex items-center justify-center py-12">
                        <Craft />
                    </div>
                </div>
            </section>

            {/* Panel 5: Impact */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-40 bg-background invisible">
                <div className="w-full h-full overflow-y-auto scroll-container" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="w-full min-h-full flex items-center justify-center py-12">
                        <Impact />
                    </div>
                </div>
            </section>

            {/* Panel 6: Contact */}
            <section ref={addToRefs} className="absolute inset-0 w-full h-full z-50 bg-black invisible">
                <div className="w-full h-full overflow-y-auto scroll-container" style={{ WebkitOverflowScrolling: 'touch' }}>
                    <div className="w-full min-h-full flex items-center justify-center py-12">
                        <Contact />
                    </div>
                </div>
            </section>
        </div>
    );
}
