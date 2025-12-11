"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { BookOpen, Sword, Shield, Award, Map, ChevronDown, ChevronUp, Star } from "lucide-react";
import { supabase } from "@/lib/supabase";

interface TimelineEvent {
    id: string;
    title: string;
    chapter: string;
    date: string;
    icon: string; // Changed to string for DB mapping
    description: string;
    details: string[];
    tech?: string[];
}

const iconMap: { [key: string]: any } = {
    'BookOpen': BookOpen,
    'Sword': Sword,
    'Shield': Shield,
    'Award': Award,
    'Map': Map,
    'Star': Star
};

export default function JourneyTimeline() {
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [timelineData, setTimelineData] = useState<TimelineEvent[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTimeline = async () => {
            const { data, error } = await supabase
                .from('timeline_events')
                .select('*')
                .order('order', { ascending: true });

            if (data) {
                // Map DB fields to component fields
                const mappedData = data.map((item: any) => ({
                    id: item.id,
                    title: item.title,
                    chapter: item.chapter,
                    date: item.date_range,
                    icon: item.icon,
                    description: item.description,
                    details: item.details,
                    tech: item.tech_stack
                }));
                setTimelineData(mappedData);
            } else {
                // Fallback data if DB is empty or error
                setTimelineData([
                    {
                        id: "awakening",
                        chapter: "Chapter I: The Awakening",
                        title: "BSc — Information Technology",
                        date: "2021 – 2025",
                        icon: "BookOpen",
                        description: "Forged in the halls of the University of Agriculture, mastering the arcane arts of algorithms and systems.",
                        details: [
                            "Specialized in Software Engineering and Data Structures.",
                            "Led study groups on Cryptography and Network Security.",
                            "Final Year Project: Blockchain-based Voting System (BlockVote)."
                        ]
                    },
                    {
                        id: "trials",
                        chapter: "Chapter II: The Early Trials",
                        title: "Freelance & Virtual Assistance",
                        date: "2019 – 2021",
                        icon: "Sword",
                        description: "Ventured into the wildlands of Upwork and Fiverr, battling deadlines and client demands.",
                        details: [
                            "Provided technical transcription and virtual assistance to global clients.",
                            "Honed communication skills and project management under pressure.",
                            "Learned the value of clear documentation and reliable delivery."
                        ]
                    },
                    {
                        id: "campaign",
                        chapter: "Chapter III: The Great Campaign",
                        title: "Full-Stack Development",
                        date: "2023 – Present",
                        icon: "Shield",
                        description: "Building fortified applications with modern armaments: Next.js, Solidity, and Python.",
                        details: [
                            "Architected secure voting protocols using Ethereum smart contracts.",
                            "Developed responsive front-ends with React and Tailwind CSS.",
                            "Integrated biometric authentication (WebAuthn) for identity verification."
                        ],
                        tech: ["Next.js", "Solidity", "PostgreSQL", "Tailwind"]
                    },
                    {
                        id: "ranks",
                        chapter: "Chapter IV: Ascending Ranks",
                        title: "Certifications & Mastery",
                        date: "Ongoing",
                        icon: "Award",
                        description: "Continuously sharpening the blade through rigorous study and validation.",
                        details: [
                            "Meta Front-End Developer Professional Certificate (In Progress).",
                            "Solidity & Smart Contract Security (Self-Taught).",
                            "Advanced Python for Data Science."
                        ]
                    },
                    {
                        id: "horizon",
                        chapter: "Chapter V: The Horizon",
                        title: "Future Quests",
                        date: "2025 & Beyond",
                        icon: "Map",
                        description: "Charting a course towards decentralized governance systems and zero-knowledge proofs.",
                        details: [
                            "Goal: Contribute to major DeFi protocols.",
                            "Goal: Master ZK-Rollups and Layer 2 scaling solutions.",
                            "Goal: Build a privacy-focused DAO tooling suite."
                        ]
                    }
                ]);
            }
            setIsLoading(false);
        };

        fetchTimeline();
    }, []);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    if (isLoading) return <div className="text-gray-500 font-mono text-sm">Loading chronicle...</div>;

    return (
        <div className="relative py-10 pl-4 md:pl-0">
            {/* Vertical Line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent" />

            <div className="space-y-16">
                {timelineData.map((event, index) => {
                    const isEven = index % 2 === 0;
                    const isExpanded = expandedId === event.id;
                    const IconComponent = iconMap[event.icon] || Star;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className={`relative flex flex-col md:flex-row items-center ${isEven ? "md:flex-row-reverse" : ""
                                }`}
                        >
                            {/* Timeline Node (Rune) */}
                            <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-background border border-gray-700 rounded-full z-10 group cursor-none hover:border-accent transition-colors"
                                onClick={() => toggleExpand(event.id)}
                            >
                                <div className={`text-gray-400 group-hover:text-accent transition-colors ${isExpanded ? "text-accent" : ""}`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                            </div>

                            {/* Content Card */}
                            <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-10 text-left md:text-right" : "md:pl-10 text-left"
                                }`}>
                                <div
                                    className={`p-6 border border-gray-800 bg-surface/30 rounded-sm hover:border-gray-600 transition-all duration-300 cursor-none group ${isExpanded ? "border-accent/30 bg-surface/50" : ""}`}
                                    onClick={() => toggleExpand(event.id)}
                                >
                                    <span className="text-secondary font-mono text-xs tracking-widest uppercase mb-2 block">
                                        {event.chapter}
                                    </span>
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-accent transition-colors">
                                        {event.title}
                                    </h3>
                                    <span className="text-sm text-gray-500 font-mono mb-4 block">
                                        {event.date}
                                    </span>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                        {event.description}
                                    </p>

                                    {/* Expandable Details */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className={`pt-4 border-t border-white/5 space-y-3 ${isEven ? "md:flex md:flex-col md:items-end" : ""}`}>
                                                    <ul className={`space-y-2 text-sm text-gray-400 ${isEven ? "md:text-right" : ""}`}>
                                                        {event.details.map((detail, i) => (
                                                            <li key={i} className="flex items-start gap-2">
                                                                <span className="text-accent mt-1.5 text-[10px]">◆</span>
                                                                <span>{detail}</span>
                                                            </li>
                                                        ))}
                                                    </ul>

                                                    {event.tech && (
                                                        <div className={`flex flex-wrap gap-2 pt-2 ${isEven ? "md:justify-end" : ""}`}>
                                                            {event.tech.map((t, i) => (
                                                                <span key={i} className="px-2 py-1 text-[10px] font-mono border border-white/10 rounded-full text-gray-500">
                                                                    {t}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className={`mt-4 flex items-center gap-2 text-xs font-mono text-gray-600 group-hover:text-gray-400 transition-colors ${isEven ? "md:justify-end" : ""}`}>
                                        {isExpanded ? (
                                            <>Close Chronicle <ChevronUp className="w-3 h-3" /></>
                                        ) : (
                                            <>Read Chronicle <ChevronDown className="w-3 h-3" /></>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Empty space for the other side */}
                            <div className="hidden md:block w-1/2" />
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
