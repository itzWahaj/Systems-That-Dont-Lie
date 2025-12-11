"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function SplashScreen() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Slightly longer duration to appreciate the animation
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 3500);

        return () => clearTimeout(timer);
    }, []);

    const ringVariants = {
        animate: {
            rotate: 360,
            transition: {
                duration: 8,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const reverseRingVariants = {
        animate: {
            rotate: -360,
            transition: {
                duration: 12,
                repeat: Infinity,
                ease: "linear"
            }
        }
    };

    const textVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.3
            }
        }
    };

    const letterVariants = {
        hidden: { opacity: 0, y: 10, filter: "blur(10px)" },
        visible: { opacity: 1, y: 0, filter: "blur(0px)" }
    };

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background text-white overflow-hidden"
                >
                    {/* Background Grid/Effects */}
                    <div className="absolute inset-0 z-0 opacity-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

                    <div className="relative z-10 flex flex-col items-center">
                        {/* Loader Container */}
                        <div className="relative w-48 h-48 mb-12 flex items-center justify-center">
                            {/* Outer Dashed Ring */}
                            <motion.div
                                variants={ringVariants}
                                animate="animate"
                                className="absolute inset-0 border-2 border-dashed border-accent/30 rounded-full"
                            />

                            {/* Inner Thin Ring */}
                            <motion.div
                                variants={reverseRingVariants}
                                animate="animate"
                                className="absolute inset-4 border border-secondary/20 rounded-full"
                            />

                            {/* Core Pulse Effect */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.1, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute inset-0 bg-accent/5 rounded-full blur-xl"
                            />

                            {/* Main Logo/Image */}
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="relative w-24 h-24"
                            >
                                <Image
                                    src="/assets/loader.png"
                                    alt="Loading..."
                                    fill
                                    className="object-contain drop-shadow-[0_0_15px_rgba(199,58,49,0.5)]"
                                    priority
                                    sizes="96px"
                                />
                            </motion.div>
                        </div>

                        {/* Text Animation */}
                        <motion.div
                            variants={textVariants}
                            initial="hidden"
                            animate="visible"
                            className="flex space-x-1"
                        >
                            {"INITIALIZING SYSTEM...".split("").map((char, index) => (
                                <motion.span
                                    key={index}
                                    variants={letterVariants}
                                    className="text-xl md:text-2xl font-cinzel tracking-widest text-accent"
                                >
                                    {char === " " ? "\u00A0" : char}
                                </motion.span>
                            ))}
                        </motion.div>

                        {/* Loading Bar */}
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: "200px" }}
                            transition={{ duration: 2.5, ease: "easeInOut", delay: 0.5 }}
                            className="h-1 bg-gradient-to-r from-transparent via-accent to-transparent mt-6 rounded-full"
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
