"use client";

import { Mail, Phone, MapPin, Github, Linkedin, Calendar } from "lucide-react";
import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Lenis from "lenis";
import ContactModal from "./AppointmentModal";
import { supabase } from "@/lib/supabase";
import { useLoader } from "@/context/LoaderContext";

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

export default function ContactContent() {
    const { showLoader, hideLoader } = useLoader();
    const { reduceMotion } = useReducedMotion();
    const containerRef = useRef<HTMLDivElement>(null);
    const [contactInfo, setContactInfo] = useState({
        email: "",
        phone: "",
        location: "",
        github_url: "",
        linkedin_url: ""
    });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'appointment' | 'email'>('email');

    useEffect(() => {
        const fetchContactInfo = async () => {
            showLoader();
            const { data } = await supabase
                .from('about_page')
                .select('email, phone, location, github_url, linkedin_url')
                .single();

            if (data) {
                setContactInfo({
                    email: data.email || "",
                    phone: data.phone || "",
                    location: data.location || "",
                    github_url: data.github_url || "",
                    linkedin_url: data.linkedin_url || ""
                });
            }
            hideLoader();
        };
        fetchContactInfo();
    }, []);

    const openModal = (mode: 'appointment' | 'email') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    useEffect(() => {
        if (reduceMotion) return;

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
            const tl = gsap.timeline({ defaults: { ease: "power3.out", duration: 1 } });

            tl.from(".contact-header", { y: 50, opacity: 0 })
                .from(".contact-text", { y: 30, opacity: 0 }, "-=0.6")
                .from(".contact-buttons", { y: 30, opacity: 0 }, "-=0.6")
                .from(".contact-details", { y: 30, opacity: 0 }, "-=0.6");

            if (containerRef.current?.querySelector(".contact-socials")) {
                tl.from(".contact-socials", { y: 20, opacity: 0 }, "-=0.8");
            }

        }, containerRef);

        return () => {
            gsap.ticker.remove(update);
            ctx.revert();
            lenis.destroy();
        };
    }, [reduceMotion]);

    const activeContainerVariants = reduceMotion ? containerVariants : {};
    const activeItemVariants = reduceMotion ? itemVariants : {};

    return (
        <motion.div
            ref={containerRef}
            initial={reduceMotion ? "hidden" : undefined}
            animate={reduceMotion ? "visible" : undefined}
            variants={activeContainerVariants}
            className="pt-32 pb-20 px-6 min-h-screen flex flex-col items-center justify-center"
        >
            <div className="max-w-3xl w-full text-center space-y-12">
                <motion.div variants={activeItemVariants} className="contact-header">
                    <h1 className="text-5xl md:text-7xl font-serif font-bold">
                        Let's Build <br /> <span className="text-muted">Something Real</span>
                    </h1>
                </motion.div>

                <motion.p variants={activeItemVariants} className="text-xl text-muted max-w-2xl mx-auto leading-relaxed contact-text">
                    I'm currently open to new opportunities. Whether you have a question, a project idea, or just want to say hi, I'll try my best to get back to you.
                </motion.p>

                <motion.div variants={activeItemVariants} className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8 contact-buttons">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal('email')}
                        className="group flex items-center gap-3 px-8 py-4 bg-accent text-white hover:bg-accent/80 shadow-[0_0_20px_rgba(139,30,30,0.3)] hover:shadow-[0_0_30px_rgba(139,30,30,0.5)] transition-all duration-300 rounded-sm"
                    >
                        <Mail className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        EMAIL ME
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openModal('appointment')}
                        className="group flex items-center gap-3 px-8 py-4 border border-border text-main hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 rounded-sm"
                    >
                        <Calendar className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        SCHEDULE A 15-MIN LAB
                    </motion.button>
                </motion.div>

                {/* Direct Contact Details */}
                <motion.div variants={activeItemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-border mt-12 contact-details">
                    {/* Email Column */}
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-2 group cursor-none">
                        <div className="p-4 bg-surface border border-border rounded-full group-hover:bg-accent/20 transition-colors duration-300">
                            <Mail className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-mono text-muted uppercase tracking-widest">Email</span>
                        <span className="text-sm text-main group-hover:text-accent transition-colors">{contactInfo.email}</span>
                    </motion.div>

                    {/* Phone Column with Socials */}
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-4 group cursor-none">
                        <div className="flex gap-4 mb-2 contact-socials">
                            <SocialLink href={contactInfo.github_url} icon={<Github className="w-5 h-5" />} label="GitHub" />
                            <SocialLink href={contactInfo.linkedin_url} icon={<Linkedin className="w-5 h-5" />} label="LinkedIn" />
                        </div>

                        <div className="p-4 bg-surface border border-border rounded-full group-hover:bg-accent/20 transition-colors duration-300">
                            <Phone className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Phone</span>
                        <span className="text-sm text-main group-hover:text-accent transition-colors">{contactInfo.phone}</span>
                    </motion.div>

                    {/* Location Column */}
                    <motion.div whileHover={{ y: -5 }} className="flex flex-col items-center space-y-2 group cursor-none">
                        <div className="p-4 bg-surface border border-border rounded-full group-hover:bg-accent/20 transition-colors duration-300">
                            <MapPin className="w-6 h-6 text-accent group-hover:scale-110 transition-transform" />
                        </div>
                        <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Location</span>
                        <span className="text-sm text-main text-center group-hover:text-accent transition-colors">{contactInfo.location}</span>
                    </motion.div>
                </motion.div>
            </div>
            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} />
        </motion.div>
    );
}

function SocialLink({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) {
    return (
        <motion.a
            whileHover={{ scale: 1.2, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-main hover:bg-surface/50 hover:border-border cursor-none"
            aria-label={label}
        >
            {icon}
        </motion.a>
    );
}
