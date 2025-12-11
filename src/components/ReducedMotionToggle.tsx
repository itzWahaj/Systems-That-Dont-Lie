"use client";

import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Zap, ZapOff } from "lucide-react";

export default function ReducedMotionToggle() {
    const { reduceMotion, toggleMotion } = useReducedMotion();

    return (
        <button
            onClick={toggleMotion}
            className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-surface border border-gray-700 text-white rounded-sm hover:bg-surface/80 transition-colors"
            title={reduceMotion ? "Enable animations" : "Reduce motion"}
        >
            {reduceMotion ? (
                <>
                    <ZapOff className="w-4 h-4" />
                    <span className="text-sm font-mono">Motion: OFF</span>
                </>
            ) : (
                <>
                    <Zap className="w-4 h-4 text-secondary" />
                    <span className="text-sm font-mono">Motion: ON</span>
                </>
            )}
        </button>
    );
}
