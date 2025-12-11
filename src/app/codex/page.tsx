"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Scroll, Code, Terminal, Book, ChevronRight, Sparkles, Feather, Archive } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const iconMap: { [key: string]: any } = {
    'Code': <Code className="w-6 h-6 text-accent" />,
    'Scroll': <Scroll className="w-6 h-6 text-secondary" />,
    'Sparkles': <Sparkles className="w-6 h-6 text-purple-400" />,
    'Feather': <Feather className="w-6 h-6 text-gray-400" />,
    'Book': <Book className="w-6 h-6 text-gray-400" />,
    'Archive': <Archive className="w-6 h-6 text-yellow-500" />,
    'Terminal': <Terminal className="w-6 h-6 text-green-400" />
};

export default function CodexPage() {
    const [activeCategory, setActiveCategory] = useState("All Scrolls");
    const [scrollsData, setScrollsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScrolls = async () => {
            const { data, error } = await supabase
                .from('scrolls')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (data) {
                setScrollsData(data);
            }
            setIsLoading(false);
        };

        fetchScrolls();
    }, []);

    const filteredScrolls = activeCategory === "All Scrolls"
        ? scrollsData
        : scrollsData.filter(scroll => scroll.category === activeCategory);

    if (isLoading) {
        return <div className="min-h-screen bg-background text-main flex items-center justify-center">Loading the Codex...</div>;
    }

    return (
        <div className="min-h-screen bg-background text-main pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-20">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center space-y-6 border-b border-border pb-16"
                >
                    <span className="text-secondary font-mono text-sm tracking-[0.2em] uppercase">The Library</span>
                    <h1 className="text-5xl md:text-7xl font-serif font-bold">The Codex</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed">
                        A collection of technical rituals, developer logs, and project lore.
                        Knowledge forged in the fires of debugging and design.
                    </p>
                </motion.div>

                {/* Filter / Navigation Sphere */}
                <div className="flex justify-center gap-8 text-sm font-mono text-muted border-b border-border pb-4">
                    {["All Scrolls", "Spellbook", "Reflections", "Lore"].map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`pb-4 -mb-4.5 transition-colors cursor-none ${activeCategory === category
                                ? "text-main border-b border-accent"
                                : "hover:text-main"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Scrolls Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredScrolls.map((scroll, index) => (
                            <motion.div
                                key={scroll.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3 }}
                            >
                                <Link href={`/codex/${scroll.slug}`} className="group block h-full cursor-none">
                                    <div className="h-full p-8 border border-border bg-surface/30 rounded-sm hover:border-accent/50 hover:bg-surface/50 transition-all duration-300 relative overflow-hidden flex flex-col">

                                        {/* Hover Gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="relative z-10 flex-1">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="p-3 bg-background border-border border rounded-sm group-hover:border-gray-600 transition-colors">
                                                    {iconMap[scroll.icon] || <Scroll className="w-6 h-6 text-gray-400" />}
                                                </div>
                                                <span className={`font-mono text-[10px] uppercase tracking-wider border px-2 py-1 rounded-full ${scroll.category === 'Spellbook' ? 'border-accent/20 text-accent' :
                                                    scroll.category === 'Reflections' ? 'border-gray-500/20 text-muted' :
                                                        'border-secondary/20 text-secondary'
                                                    }`}>
                                                    {scroll.category}
                                                </span>
                                            </div>

                                            <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-accent transition-colors leading-tight">
                                                {scroll.title}
                                            </h3>

                                            <p className="text-muted text-sm leading-relaxed mb-6 line-clamp-4 font-light">
                                                {scroll.excerpt}
                                            </p>
                                        </div>

                                        <div className="relative z-10 flex items-center justify-between pt-6 border-t border-border mt-auto">
                                            <div className="flex items-center gap-3 text-[10px] font-mono text-muted">
                                                <span>{scroll.date}</span>
                                                <span className="w-1 h-1 rounded-full bg-gray-700" />
                                                <span>{scroll.read_time}</span>
                                            </div>
                                            <span className="flex items-center gap-2 text-[10px] font-bold text-main group-hover:translate-x-1 transition-transform tracking-wider">
                                                OPEN SCROLL <ChevronRight className="w-3 h-3 text-accent" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {/* Footer Quote */}
                <div className="text-center pt-20 pb-10">
                    <p className="font-serif italic text-muted text-lg">
                        "The code is merely the incantation; the result is the magic."
                    </p>
                </div>
            </div>
        </div>
    );
}
