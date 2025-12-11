"use client";

import { motion } from "framer-motion";
import { AlertTriangle, ServerCrash, ShieldAlert } from "lucide-react";
import ScrollRevealWrapper from "./ScrollRevealWrapper";

export default function Trials() {
    return (
        <section id="trials" className="min-h-screen w-full flex items-center justify-center py-24 px-6 bg-background relative">
            <div className="max-w-5xl w-full space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-3xl mx-auto"
                >
                    <span className="text-secondary font-mono text-sm tracking-widest uppercase">Chapter 2 — The Trials</span>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold mt-4 mb-8">The Cost of Fragility</h2>
                    <p className="text-xl md:text-2xl text-muted leading-relaxed font-light">
                        Elections lose legitimacy because humans and single servers can be lied to.
                        I build for edge cases: <span className="text-accent">network throttling, duplicate identities, hardware failure</span>,
                        and the quiet ways data is manipulated.
                    </p>
                </motion.div>

                <ScrollRevealWrapper className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <AlertTriangle className="w-8 h-8 text-accent" />,
                            title: "Network Throttling",
                            desc: "Systems that must work when the connection fights back."
                        },
                        {
                            icon: <ShieldAlert className="w-8 h-8 text-accent" />,
                            title: "Duplicate Identities",
                            desc: "Preventing Sybil attacks with biometric logic."
                        },
                        {
                            icon: <ServerCrash className="w-8 h-8 text-accent" />,
                            title: "Hardware Failure",
                            desc: "Redundancy that survives physical compromise."
                        }
                    ].map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(18, 18, 23, 0.8)" }}
                            className="sr-elem p-8 border border-border bg-surface/50 transition-all duration-300 group cursor-none relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <motion.div
                                whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
                                className="mb-6 p-3 bg-background w-fit rounded-sm border border-border group-hover:border-accent/50 transition-colors relative z-10"
                            >
                                {item.icon}
                            </motion.div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-main mb-3 font-serif group-hover:text-accent transition-colors">{item.title}</h3>
                                <p className="text-muted font-mono text-sm group-hover:text-main transition-colors">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </ScrollRevealWrapper>
            </div>
        </section>
    );
}
