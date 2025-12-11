"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export default function CustomCursor() {
    const { reduceMotion } = useReducedMotion();
    const [isVisible, setIsVisible] = useState(false);
    const [isHovering, setIsHovering] = useState(false);
    const [isText, setIsText] = useState(false);
    const [isTouch, setIsTouch] = useState(false);

    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring for the follower
    const springConfig = { damping: 25, stiffness: 120 };
    const cursorX = useSpring(mouseX, springConfig);
    const cursorY = useSpring(mouseY, springConfig);

    useEffect(() => {
        // Check for touch device
        if (typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches) {
            setIsTouch(true);
        }
    }, []);

    useEffect(() => {
        if (reduceMotion || isTouch) return;

        const moveMouse = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
            if (!isVisible) setIsVisible(true);
        };

        const checkHover = (e: MouseEvent) => {
            const target = e.target as HTMLElement;

            // Check for clickable elements
            const isClickable = target.closest("a, button, [role='button'], .cursor-pointer, .hover-trigger");
            setIsHovering(!!isClickable);

            // Check for text inputs
            const isTextInput = target.closest("input, textarea, [contenteditable='true']");
            setIsText(!!isTextInput);
        };

        window.addEventListener("mousemove", moveMouse);
        window.addEventListener("mouseover", checkHover);

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            window.removeEventListener("mouseover", checkHover);
        };
    }, [mouseX, mouseY, isVisible, reduceMotion, isTouch]);

    if (reduceMotion || isTouch) return null;

    return (
        <>
            {/* Main Dot - The "Brass Dot" */}
            <motion.div
                className="fixed top-0 left-0 w-2 h-2 bg-[#e6b85b] rounded-full pointer-events-none z-[10001]"
                style={{
                    x: mouseX,
                    y: mouseY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 1 : 0,
                }}
            />

            {/* Follower Ring - The "Brass Glow/Ring" */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 border border-[#e6b85b] rounded-full pointer-events-none z-[10000]"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: "-50%",
                    translateY: "-50%",
                    opacity: isVisible ? 0.5 : 0,
                    scale: isHovering ? 1.5 : 1,
                    backgroundColor: isHovering ? "rgba(230, 184, 91, 0.1)" : "transparent",
                }}
                transition={{ duration: 0.2 }}
            />
        </>
    );
}
