"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

export default function RouteChangeListener() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { hideLoader } = useLoader();

    useEffect(() => {
        // Hide loader when route changes
        const timeout = setTimeout(() => {
            hideLoader();
        }, 500); // Minimum display time to prevent flickering

        return () => clearTimeout(timeout);
    }, [pathname, searchParams, hideLoader]);

    return null;
}
