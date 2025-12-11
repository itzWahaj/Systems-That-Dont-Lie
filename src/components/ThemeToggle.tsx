"use client";

import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isLight = theme === "light";

    return (
        <>
            <AnimatePresence>
                {theme === "dark" && (
                    /* Flicker Overlay for Light->Dark transition (simulating terminal/crt switch off) */
                    <motion.div
                        key="flicker-dark"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0, 0.5, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3, times: [0, 0.1, 0.2, 0.25, 1] }}
                        className="fixed inset-0 z-[100] bg-black pointer-events-none"
                    />
                )}
                {theme === "light" && (
                    /* Flash Overlay for Dark->Light transition (simulating exposure/flash) */
                    <motion.div
                        key="flicker-light"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-[100] bg-white pointer-events-none mix-blend-overlay"
                    />
                )}
            </AnimatePresence>

            <button
                onClick={toggleTheme}
                className={cn(
                    "relative w-9 h-9 flex items-center justify-center rounded-full transition-colors border",
                    isLight
                        ? "bg-black/5 hover:bg-black/10 border-black/10"
                        : "bg-white/5 hover:bg-white/10 border-white/10"
                )}
                aria-label={`Switch to ${isLight ? "dark" : "light"} theme`}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {theme === "dark" ? (
                        <motion.div
                            key="sun"
                            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Sun className="w-4 h-4 text-secondary" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="moon"
                            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                            animate={{ rotate: 0, opacity: 1, scale: 1 }}
                            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Moon className="w-4 h-4 text-accent" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </button>
        </>
    );
}
