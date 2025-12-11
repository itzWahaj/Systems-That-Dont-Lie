import { motion } from "framer-motion";
import { Calendar, Mail } from "lucide-react";
import { useState } from "react";
import ContactModal from "./AppointmentModal";

export default function Contact() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<'appointment' | 'email'>('appointment');

    const openModal = (mode: 'appointment' | 'email') => {
        setModalMode(mode);
        setIsModalOpen(true);
    };

    return (
        <section id="contact" className="min-h-[80vh] w-full flex items-center justify-center py-24 px-6 bg-surface relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-surface to-surface opacity-50" />

            <div className="max-w-4xl w-full text-center space-y-12 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="text-secondary font-mono text-sm tracking-widest uppercase">Chapter 5 — The Call</span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold mt-6 leading-tight">
                        If you care about systems that can be audited with a human pulse, let’s talk.
                    </h2>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4, duration: 0.8 }}
                    className="flex flex-col sm:flex-row gap-6 justify-center items-center"
                >
                    <button
                        onClick={() => openModal('email')}
                        className="group flex items-center gap-3 px-8 py-4 bg-accent text-white font-bold tracking-wider hover:bg-red-700 transition-all duration-300 rounded-sm w-full sm:w-auto"
                    >
                        <Mail className="w-5 h-5 group-hover:animate-pulse" />
                        EMAIL ME
                    </button>
                    <button
                        onClick={() => openModal('appointment')}
                        className="group flex items-center gap-3 px-8 py-4 border border-gray-700 text-white font-bold tracking-wider hover:bg-white/5 transition-all duration-300 rounded-sm w-full sm:w-auto"
                    >
                        <Calendar className="w-5 h-5 text-secondary" />
                        SCHEDULE A 15-MIN LAB
                    </button>
                </motion.div>

                <p className="text-gray-500 font-mono text-sm pt-12">
                    “If you’ve read this far, you already know I give a damn. Let’s build something meaningful.”
                </p>
            </div>

            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} mode={modalMode} />
        </section>
    );
}
