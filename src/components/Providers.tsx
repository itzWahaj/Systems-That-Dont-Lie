"use client";

import { MotionProvider } from "./MotionProvider";
import { ReducedMotionProvider, useReducedMotion } from "@/hooks/useReducedMotion";
import dynamic from "next/dynamic";
import { useEffect } from "react";

// Dynamic import of AOSInit (client-side only)
const AOSInit = dynamic(() => import("@/components/AOSInit"), {
    ssr: false,
});

// Component to add data attribute to body for CSS targeting
function ReducedMotionAttribute() {
    const { reduceMotion } = useReducedMotion();

    useEffect(() => {
        if (reduceMotion) {
            document.documentElement.setAttribute("data-reduced-motion", "true");
            document.body.classList.add("reduced-motion");
        } else {
            document.documentElement.removeAttribute("data-reduced-motion");
            document.body.classList.remove("reduced-motion");
        }
    }, [reduceMotion]);

    return null;
}

import { LoaderProvider } from "@/context/LoaderContext";
import { ThemeProvider } from "@/context/ThemeContext";
import GlobalLoader from "@/components/GlobalLoader";
import RouteChangeListener from "@/components/RouteChangeListener";

export default function Providers({ children }: { children: React.ReactNode }) {
    return (
        <ThemeProvider>
            <LoaderProvider>
                <ReducedMotionProvider>
                    <MotionProvider>
                        <ReducedMotionAttribute />
                        <AOSInit />
                        <GlobalLoader />
                        <RouteChangeListener />
                        {children}
                    </MotionProvider>
                </ReducedMotionProvider>
            </LoaderProvider>
        </ThemeProvider>
    );
}
