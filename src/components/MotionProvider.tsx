"use client";

import { MotionConfig } from "framer-motion";
import { createContext, useContext, useEffect, useState } from "react";

const MotionContext = createContext({
    reduceMotion: false,
    toggleMotion: () => { },
});

export const useMotion = () => useContext(MotionContext);

export function MotionProvider({ children }: { children: React.ReactNode }) {
    const [reduceMotion, setReduceMotion] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("reduceMotion");
        if (stored) {
            setReduceMotion(JSON.parse(stored));
        } else {
            const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            setReduceMotion(mediaQuery.matches);
        }
    }, []);

    const toggleMotion = () => {
        setReduceMotion((prev) => {
            const newValue = !prev;
            localStorage.setItem("reduceMotion", JSON.stringify(newValue));
            return newValue;
        });
    };

    return (
        <MotionContext.Provider value={{ reduceMotion, toggleMotion }}>
            <MotionConfig reducedMotion={reduceMotion ? "always" : "never"}>
                {children}
            </MotionConfig>
        </MotionContext.Provider>
    );
}
