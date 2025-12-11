"use client";

import { useRouter } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";

export function useTransitionRouter() {
    const router = useRouter();
    const { showLoader } = useLoader();

    const push = (href: string) => {
        showLoader();
        // Small delay to ensure loader is visible before navigation starts/completes
        // In a real app, we might want to wait for the new route to be ready, 
        // but App Router doesn't expose that easily yet.
        // This gives a feeling of "processing"
        setTimeout(() => {
            router.push(href);
        }, 500);
    };

    const replace = (href: string) => {
        showLoader();
        setTimeout(() => {
            router.replace(href);
        }, 500);
    };

    const back = () => {
        showLoader();
        setTimeout(() => {
            router.back();
        }, 500);
    };

    return { ...router, push, replace, back };
}
