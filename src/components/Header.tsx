"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";

const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Codex", path: "/codex" },
    { name: "Contact", path: "/contact" },
];

export default function Header() {
    const pathname = usePathname();

    if (pathname.startsWith("/admin")) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <nav className="pointer-events-auto bg-black/60 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl flex items-center gap-2">

                {/* Avatar & Name */}
                <TransitionLink
                    href="/"
                    className="flex items-center gap-3 px-3 py-2 rounded-full hover:bg-white/5 transition-colors group"
                >
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-white/20 group-hover:border-accent/50 transition-colors">
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </TransitionLink>

                {/* Divider */}
                <div className="h-6 w-px bg-white/10 mx-1 hidden sm:block" />

                {/* Navigation */}
                <ul className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

                        return (
                            <li key={item.path}>
                                <TransitionLink
                                    href={item.path}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors hover:text-white",
                                        isActive ? "text-white" : "text-white/60"
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className="absolute inset-0 bg-white/10 rounded-full -z-10"
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {item.name}
                                </TransitionLink>
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </header>
    );
}
