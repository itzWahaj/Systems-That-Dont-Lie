"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/LoaderContext";
import { ComponentProps, MouseEvent } from "react";

interface TransitionLinkProps extends ComponentProps<typeof Link> {
    href: string;
}

export default function TransitionLink({ href, children, onClick, ...props }: TransitionLinkProps) {
    const router = useRouter();
    const { showLoader } = useLoader();

    const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
        // If there's a custom onClick handler, run it first
        if (onClick) {
            onClick(e);
        }

        // If default prevented (e.g. by custom handler), don't proceed
        if (e.isDefaultPrevented()) return;

        // Prevent default navigation
        e.preventDefault();

        // Show loader
        showLoader();

        // Navigate after a small delay to ensure loader is visible
        setTimeout(() => {
            router.push(href);
        }, 500);
    };

    return (
        <Link href={href} onClick={handleClick} {...props}>
            {children}
        </Link>
    );
}
