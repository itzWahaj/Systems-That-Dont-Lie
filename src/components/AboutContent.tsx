"use client";

import { Mail, Phone, MapPin, Linkedin, Github, FileText, Download } from "lucide-react";
import { motion } from "framer-motion";
import JourneyTimeline from "./JourneyTimeline";
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
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: [0.22, 0.88, 0.35, 1]
        }
    }
};

export default function AboutContent() {
    const { reduceMotion } = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [aboutData, setAboutData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            const { data, error } = await supabase
                .from('about_page')
                .select('*')
                .single();

            if (data) {
                setAboutData(data);
            }
            setIsLoading(false);
        };

        fetchAboutData();
    }, []);

    useEffect(() => {
        if (reduceMotion || isLoading) return;

        gsap.registerPlugin(ScrollTrigger);

        // Initialize Lenis
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

        // GSAP Animations
        const ctx = gsap.context(() => {
            // Header Animation
            gsap.from(".about-header", {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            // Sections Animation
            const sections = gsap.utils.toArray(".about-section");
            sections.forEach((section: any) => {
                gsap.from(section, {
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    },
                    y: 50,
                    opacity: 0,
                    duration: 0.8,
                    ease: "power3.out"
                });
            });

            // Sidebar Animation
            gsap.from(".about-sidebar", {
                scrollTrigger: {
                    trigger: ".about-sidebar",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                },
                x: 20,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
                delay: 0.2
            });

        }, containerRef);

        return () => {
            gsap.ticker.remove(update);
            ctx.revert();
            lenis.destroy();
        };
    }, [reduceMotion, isLoading]);

    // Conditional Variants
    const activeContainerVariants = reduceMotion ? containerVariants : {};
    const activeItemVariants = reduceMotion ? itemVariants : {};

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
    }

    const { title, bio, image_url, skills, email, phone, location, linkedin_url, github_url, resume_url } = aboutData || {
        title: "",
        bio: "",
        image_url: "",
        skills: [],
        email: "",
        phone: "",
        location: "",
        linkedin_url: "",
        github_url: "",
        resume_url: ""
    };

    return (
        <motion.div
            ref={containerRef}
            initial={reduceMotion ? "hidden" : undefined}
            animate={reduceMotion ? "visible" : undefined}
            variants={activeContainerVariants}
            className="pt-32 pb-20 px-6 min-h-screen max-w-5xl mx-auto"
        >
            <div className="space-y-16">

                {/* Header Section */}
                <motion.div variants={activeItemVariants} className="space-y-6 border-b border-white/10 pb-12 about-header">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-main">
                        {title ? (
                            <>
                                {title.split('—')[0]} — <span className="text-accent">{title.split('—')[1]}</span>
                            </>
                        ) : (
                            <span className="animate-pulse bg-white/10 h-12 w-3/4 block rounded"></span>
                        )}
                    </h1>
                    <p className="text-xl text-muted leading-relaxed max-w-3xl">
                        {bio}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-12">

                    {/* Main Content Column */}
                    <div className="md:col-span-8 space-y-16">

                        {/* Journey / Timeline */}
                        <motion.section variants={activeItemVariants} className="space-y-8 about-section">
                            <h2 className="text-2xl font-serif font-bold text-main flex items-center gap-3 mb-8">
                                The Chronicle
                            </h2>
                            <JourneyTimeline />
                        </motion.section>

                        {/* Skills */}
                        <motion.section variants={activeItemVariants} className="space-y-6 about-section">
                            <h2 className="text-2xl font-serif font-bold text-main">Skills</h2>
                            <motion.ul
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={{
                                    hidden: { opacity: 0 },
                                    visible: {
                                        opacity: 1,
                                        transition: {
                                            staggerChildren: 0.1
                                        }
                                    }
                                }}
                            >
                                {skills && skills.map((skill: string, i: number) => (
                                    <motion.li
                                        key={i}
                                        variants={{
                                            hidden: { opacity: 0, y: 20 },
                                            visible: { opacity: 1, y: 0 }
                                        }}
                                        whileHover={{ scale: 1.02, x: 5 }}
                                        className="flex items-center gap-3 text-muted bg-surface hover:bg-surface/80 hover:border-accent transition-colors cursor-none group"
                                    >
                                        <div className="w-1.5 h-1.5 bg-accent rounded-full group-hover:scale-150 transition-transform" />
                                        <span className="group-hover:text-main transition-colors">{skill}</span>
                                    </motion.li>
                                ))}
                            </motion.ul>
                        </motion.section>
                    </div>

                    {/* Sidebar / Contact Info */}
                    <motion.div variants={activeItemVariants} className="md:col-span-4 space-y-8 about-sidebar">
                        <div className="bg-surface border border-border p-6 rounded-sm space-y-6 sticky top-32">

                            {/* Profile Image with Sci-Fi Effects */}
                            <div className="relative group w-48 h-48 mx-auto mb-8">
                                {/* Rotating Rings */}
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-10px] border border-dashed border-border rounded-full group-hover:border-accent/50 transition-colors duration-500"
                                />
                                <motion.div
                                    animate={{ rotate: -360 }}
                                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-[-20px] border border-border rounded-full group-hover:border-secondary/50 transition-colors duration-500 opacity-50"
                                />

                                {/* Image Container */}
                                <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-border group-hover:border-accent transition-colors duration-500 z-10 bg-background">
                                    {image_url && (
                                        <img
                                            src={image_url}
                                            alt="Muhammad Wahaj Shafiq"
                                            className="w-full h-full object-cover object-top filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    )}
                                </div>

                                {/* Status Badge */}
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-surface/80 backdrop-blur-sm border border-border px-3 py-1 rounded-full z-20 whitespace-nowrap">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    <span className="text-[10px] font-mono text-green-500 uppercase tracking-wider">System Online</span>
                                </div>
                            </div>

                            <h3 className="font-mono text-sm text-secondary uppercase tracking-widest border-b border-border pb-4">
                                Contact & Links
                            </h3>

                            <ul className="space-y-5">
                                <li>
                                    <a href={`mailto:${email}`} className="flex items-start gap-3 group">
                                        <Mail className="w-5 h-5 text-muted group-hover:text-accent transition-colors shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-muted uppercase tracking-wider mb-1">Email</span>
                                            <span className="text-sm text-main group-hover:text-accent transition-colors break-all">{email}</span>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3">
                                        <Phone className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-muted uppercase tracking-wider mb-1">Phone</span>
                                            <span className="text-sm text-main">{phone}</span>
                                        </div>
                                    </div>
                                </li>
                                <li>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-5 h-5 text-muted shrink-0 mt-0.5" />
                                        <div>
                                            <span className="block text-xs text-muted uppercase tracking-wider mb-1">Location</span>
                                            <span className="text-sm text-main">{location}</span>
                                        </div>
                                    </div>
                                </li>
                            </ul>

                            <div className="pt-6 border-t border-border space-y-4">
                                {linkedin_url && (
                                    <a
                                        href={linkedin_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-sm text-muted hover:text-main transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" /> LinkedIn
                                    </a>
                                )}
                                {github_url && (
                                    <a
                                        href={github_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-sm text-muted hover:text-main transition-colors"
                                    >
                                        <Github className="w-4 h-4" /> GitHub
                                    </a>
                                )}
                                {resume_url && (
                                    <a
                                        href={resume_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex items-center gap-3 text-sm text-accent hover:text-red-400 transition-colors font-bold"
                                    >
                                        <Download className="w-4 h-4" /> Download CV
                                    </a>
                                )}
                            </div>
                        </div>
                    </motion.div>

                </div>
            </div>
        </motion.div>
    );
}
