"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useLoader } from "@/context/LoaderContext";
import Image from "next/image";

export default function GlobalLoader() {
    const { isLoading } = useLoader();

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm"
                >
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center w-24 h-24">
                            {/* Rotating Outer Ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 rounded-full border-2 border-border border-t-accent border-r-accent/50"
                            />

                            {/* Inner Pulsing Circle (Optional Background) */}
                            <motion.div
                                animate={{ scale: [0.95, 1.05, 0.95] }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-2 rounded-full bg-surface blur-md"
                            />

                            {/* Main Loader Image */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative w-12 h-12"
                            >
                                <Image
                                    src="/assets/loader.png"
                                    alt="Loading..."
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </div>

                        {/* Loading Text */}
                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="mt-6 text-main font-mono text-xs tracking-[0.3em] font-bold"
                        >
                            PROCESSING
                        </motion.p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
