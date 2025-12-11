"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

interface ReducedMotionContextType {
    reduceMotion: boolean;
    toggleMotion: () => void;
}

const ReducedMotionContext = createContext<ReducedMotionContextType>({
    reduceMotion: false,
    toggleMotion: () => { },
});

export const useReducedMotion = () => useContext(ReducedMotionContext);

export function ReducedMotionProvider({ children }: { children: ReactNode }) {
    const [reduceMotion, setReduceMotion] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Check localStorage first
        const stored = localStorage.getItem("reduceMotion");
        if (stored !== null) {
            setReduceMotion(JSON.parse(stored));
        } else {
            // Fall back to system preference
            const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
            setReduceMotion(mediaQuery.matches);
        }
    }, []);

    const toggleMotion = () => {
        setReduceMotion((prev) => {
            const newValue = !prev;
            localStorage.setItem("reduceMotion", JSON.stringify(newValue));
            // Reload page to apply changes to all components
            window.location.reload();
            return newValue;
        });
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <ReducedMotionContext.Provider value={{ reduceMotion, toggleMotion }}>
            {children}
        </ReducedMotionContext.Provider>
    );
}
