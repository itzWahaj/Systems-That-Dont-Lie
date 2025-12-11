"use client";

import { notFound } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Calendar, Clock, Scroll, Code, Terminal, Book, Sparkles, Feather, Archive } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";

const iconMap: { [key: string]: any } = {
    'Code': <Code className="w-6 h-6 text-accent" />,
    'Scroll': <Scroll className="w-6 h-6 text-secondary" />,
    'Sparkles': <Sparkles className="w-6 h-6 text-purple-400" />,
    'Feather': <Feather className="w-6 h-6 text-muted" />,
    'Book': <Book className="w-6 h-6 text-muted" />,
    'Archive': <Archive className="w-6 h-6 text-yellow-500" />,
    'Terminal': <Terminal className="w-6 h-6 text-green-400" />
};

export default function ScrollPage({ params }: { params: { slug: string } }) {
    const [scroll, setScroll] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchScroll = async () => {
            const { data, error } = await supabase
                .from('scrolls')
                .select('*')
                .eq('slug', params.slug)
                .single();

            if (data) {
                setScroll(data);
            }
            setIsLoading(false);
        };

        fetchScroll();
    }, [params.slug]);

    if (isLoading) {
        return <div className="min-h-screen bg-background text-main flex items-center justify-center">Loading scroll...</div>;
    }

    if (!scroll) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-background text-main pt-32 pb-20 px-6">
            <article className="max-w-3xl mx-auto">
                {/* Back Link */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <Link href="/codex" className="inline-flex items-center gap-2 text-muted hover:text-accent transition-colors font-mono text-sm cursor-none">
                        <ArrowLeft className="w-4 h-4" /> Return to the Library
                    </Link>
                </motion.div>

                {/* Header */}
                <motion.header
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-6 border-b border-border pb-12 mb-12"
                >
                    <div className="flex items-center gap-4">
                        <span className={`font-mono text-xs uppercase tracking-wider border px-3 py-1 rounded-full ${scroll.category === 'Spellbook' ? 'border-accent/20 text-accent' :
                            scroll.category === 'Reflections' ? 'border-gray-500/20 text-muted' :
                                'border-secondary/20 text-secondary'
                            }`}>
                            {scroll.category}
                        </span>
                        <div className="flex items-center gap-4 text-muted font-mono text-xs">
                            <span className="flex items-center gap-1.5">
                                <Calendar className="w-3 h-3" /> {scroll.date}
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Clock className="w-3 h-3" /> {scroll.read_time}
                            </span>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight">
                        {scroll.title}
                    </h1>
                </motion.header>

                {/* Content */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-main prose-p:text-muted prose-strong:text-main prose-a:text-accent prose-code:text-accent prose-pre:bg-surface prose-pre:border prose-pre:border-border"
                >
                    <ReactMarkdown>{scroll.content}</ReactMarkdown>
                </motion.div>

                {/* Footer */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="mt-20 pt-10 border-t border-border flex justify-between items-center"
                >
                    <span className="font-serif italic text-muted">
                        End of Scroll
                    </span>
                    <div className="p-4 bg-surface/30 rounded-full border border-border">
                        {iconMap[scroll.icon] || <Scroll className="w-6 h-6 text-muted" />}
                    </div>
                </motion.div>
            </article>
        </div>
    );
}
