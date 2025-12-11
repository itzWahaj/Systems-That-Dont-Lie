"use client";

import { Toaster as SonnerToaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";

export default function ThemedToaster() {
    const { theme } = useTheme();

    return (
        <SonnerToaster
            position="top-center"
            theme={theme}
        />
    );
}
