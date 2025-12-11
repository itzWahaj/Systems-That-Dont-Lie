"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { supabase } from "@/lib/supabase";

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: [0.22, 0.88, 0.35, 1]
        }
    }
};

export default function ProjectsContent() {
    const { reduceMotion } = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [projectsData, setProjectsData] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('published', true)
                .order('created_at', { ascending: false });

            if (data) {
                setProjectsData(data);
            }
            setIsLoading(false);
        };

        fetchProjects();
    }, []);

    useEffect(() => {
        if (reduceMotion || isLoading) return;

        gsap.registerPlugin(ScrollTrigger);

        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        const update = (time: number) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(update);

        gsap.ticker.lagSmoothing(0);

        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".projects-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Project Cards Animation
            const cards = gsap.utils.toArray(".project-card");
            cards.forEach((card: any, i) => {
                gsap.from(card, {
                    scrollTrigger: {
                        trigger: card,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    delay: i % 2 === 0 ? 0 : 0.2 // Stagger effect for grid
                });
            });

        }, containerRef);

        return () => {
            gsap.ticker.remove(update);
            ctx.revert();
            lenis.destroy();
        };
    }, [reduceMotion, isLoading]);

    const activeContainerVariants = reduceMotion ? containerVariants : {};
    const activeItemVariants = reduceMotion ? itemVariants : {};

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading projects...</div>;
    }

    return (
        <motion.div
            ref={containerRef}
            initial={reduceMotion ? "hidden" : undefined}
            animate={reduceMotion ? "visible" : undefined}
            variants={activeContainerVariants}
            className="pt-32 pb-20 px-6 min-h-screen max-w-7xl mx-auto"
        >
            <motion.div variants={activeItemVariants} className="mb-16 space-y-4 projects-header">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-main">
                    Projects
                </h1>
                <p className="text-xl text-muted max-w-2xl">
                    A selection of systems engineered for resilience, trust, and performance.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projectsData.map((project) => (
                    <motion.div key={project.slug} variants={activeItemVariants} className="project-card">
                        <Link
                            href={`/projects/${project.slug}`}
                            className="group relative bg-surface border-border border rounded-sm overflow-hidden hover:border-accent/50 transition-all duration-500 flex flex-col h-full"
                        >
                            <div className="aspect-video bg-gray-900 relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-purple-900/20 group-hover:scale-105 transition-transform duration-700 z-10" />
                                {project.thumbnail ? (
                                    <img
                                        src={project.thumbnail}
                                        alt={project.title}
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center font-mono text-sm text-main/50">
                                        [PROJECT_THUMBNAIL]
                                    </div>
                                )}
                            </div>

                            <div className="p-8 flex-1 flex flex-col">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold text-main font-serif mb-2 group-hover:text-accent transition-colors">
                                        {project.title}
                                    </h2>
                                    <p className="text-muted text-sm leading-relaxed line-clamp-3">
                                        {project.subtitle}
                                    </p>
                                </div>

                                <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                                    <span className="text-xs font-mono text-secondary uppercase tracking-widest">
                                        Case Study
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-main group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}
