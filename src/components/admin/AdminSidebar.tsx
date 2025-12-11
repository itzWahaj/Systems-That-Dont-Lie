"use client";

import TransitionLink from "@/components/TransitionLink";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    FileText,
    FolderKanban,
    Image as ImageIcon,
    Settings,
    LogOut,
    Shield,
    User
} from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

const navItems = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Profile", href: "/admin/profile", icon: User },
    { name: "Content", href: "/admin/content", icon: FileText },
    { name: "Projects", href: "/admin/projects", icon: FolderKanban },
    { name: "Media", href: "/admin/media", icon: ImageIcon },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/admin");
    };

    return (
        <aside className="w-64 bg-[#0b0b0f] border-r border-white/10 h-screen fixed left-0 top-0 flex flex-col z-50">
            <div className="p-6 border-b border-white/10 flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                    <Shield className="w-6 h-6 text-accent" />
                </div>
                <div>
                    <h1 className="font-serif font-bold text-white tracking-wide">NEXUS</h1>
                    <p className="text-[10px] text-gray-500 font-mono uppercase tracking-wider">Admin Console</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    const Icon = item.icon;

                    return (
                        <TransitionLink key={item.href} href={item.href}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 group ${isActive
                                ? "bg-accent text-white shadow-[0_0_15px_rgba(199,58,49,0.3)]"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                                }`}>
                                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-gray-500 group-hover:text-white"}`} />
                                <span className="font-medium text-sm">{item.name}</span>
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute left-0 w-1 h-8 bg-accent rounded-r-full"
                                    />
                                )}
                            </div>
                        </TransitionLink>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/10">
                <button
                    onClick={handleSignOut}
                    className="flex items-center gap-3 px-4 py-3 w-full text-left text-gray-400 hover:text-red-400 hover:bg-red-400/5 rounded-md transition-colors"
                >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium text-sm">Sign Out</span>
                </button>
            </div>
        </aside>
    );
}
