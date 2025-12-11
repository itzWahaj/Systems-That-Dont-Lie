"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import TransitionLink from "@/components/TransitionLink";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";

const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Codex", path: "/codex" },
    { name: "Contact", path: "/contact" },
];

export default function Header() {
    const pathname = usePathname();
    const { theme } = useTheme();
    const isLight = theme === "light";

    if (pathname.startsWith("/admin")) return null;

    return (
        <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center p-6 pointer-events-none">
            <nav className={cn(
                "pointer-events-auto backdrop-blur-xl rounded-full p-2 shadow-2xl flex items-center gap-2 border transition-colors",
                isLight
                    ? "bg-white/80 border-black/10"
                    : "bg-black/60 border-white/10"
            )}>

                {/* Avatar & Name */}
                <TransitionLink
                    href="/"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-full transition-colors group",
                        isLight ? "hover:bg-black/5" : "hover:bg-white/5"
                    )}
                >
                    <div className={cn(
                        "relative w-8 h-8 rounded-full overflow-hidden border group-hover:border-accent/50 transition-colors",
                        isLight ? "border-black/20" : "border-white/20"
                    )}>
                        <img
                            src="/assets/logo.png"
                            alt="Logo"
                            className="w-full h-full object-cover"
                        />
                    </div>

                </TransitionLink>

                {/* Divider */}
                <div className={cn(
                    "h-6 w-px mx-1 hidden sm:block",
                    isLight ? "bg-black/10" : "bg-white/10"
                )} />

                {/* Navigation */}
                <ul className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.path || (item.path !== "/" && pathname.startsWith(item.path));

                        return (
                            <li key={item.path}>
                                <TransitionLink
                                    href={item.path}
                                    className={cn(
                                        "relative px-4 py-2 rounded-full text-sm font-medium transition-colors",
                                        isActive
                                            ? (isLight ? "text-main" : "text-white")
                                            : (isLight ? "text-muted hover:text-main" : "text-white/60 hover:text-white")
                                    )}
                                >
                                    {isActive && (
                                        <motion.span
                                            layoutId="nav-pill"
                                            className={cn(
                                                "absolute inset-0 rounded-full -z-10",
                                                isLight ? "bg-black/10" : "bg-white/10"
                                            )}
                                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                        />
                                    )}
                                    {item.name}
                                </TransitionLink>
                            </li>
                        );
                    })}
                </ul>

                {/* Divider */}
                <div className={cn(
                    "h-6 w-px mx-1 hidden sm:block",
                    isLight ? "bg-black/10" : "bg-white/10"
                )} />

                {/* Theme Toggle */}
                <ThemeToggle />
            </nav>
        </header>
    );
}
