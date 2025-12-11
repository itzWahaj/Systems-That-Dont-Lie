"use client";

import { useEffect } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import "aos/dist/aos.css";

// Helper to check reduced motion preference
const prefersReducedMotion = (): boolean => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

export default function AOSInit() {
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        // Skip AOS initialization if reduced motion is preferred
        if (reduceMotion || prefersReducedMotion()) {
            console.log("AOS: Reduced motion detected - skipping initialization");
            return;
        }

        // Dynamic import of AOS to avoid SSR issues
        const initAOS = async () => {
            const AOS = (await import("aos")).default;

            AOS.init({
                duration: 640,
                easing: "ease-out-cubic",
                once: true,
                offset: 100,
                // Disable on mobile if needed
                // disable: 'mobile',
            });

            // Refresh AOS on route changes (Next.js)
            AOS.refresh();
        };

        initAOS();

        // Cleanup
        return () => {
            import("aos").then((AOS) => {
                AOS.default.refresh();
            });
        };
    }, [reduceMotion]);

    return null; // This component doesn't render anything
}
