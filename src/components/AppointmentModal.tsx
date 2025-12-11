"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, Clock, User, Mail, MessageSquare, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { toast } from "sonner";

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    mode: 'appointment' | 'email';
}

const appointmentSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    date: z.string().min(1, "Please select a date"),
    time: z.string().min(1, "Please select a time"),
    topic: z.string().min(5, "Please provide a topic or details"),
});

const messageSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactModal({ isOpen, onClose, mode }: ContactModalProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        date: "",
        time: "",
        topic: "",
        message: ""
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Reset state when modal opens/closes or mode changes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                name: "",
                email: "",
                date: "",
                time: "",
                topic: "",
                message: ""
            });
            setErrors({});
            setIsSuccess(false);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen, mode]);

    const validate = () => {
        try {
            if (mode === 'appointment') {
                appointmentSchema.parse({
                    name: formData.name,
                    email: formData.email,
                    date: formData.date,
                    time: formData.time,
                    topic: formData.topic
                });
            } else {
                messageSchema.parse({
                    name: formData.name,
                    email: formData.email,
                    message: formData.message
                });
            }
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                (error as any).errors.forEach((err: any) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            }
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error("Please fix the errors in the form.");
            return;
        }

        setIsSubmitting(true);

        try {
            const payload = mode === 'appointment' ? {
                name: formData.name,
                email: formData.email,
                type: 'appointment',
                content: formData.topic,
                preferred_date: formData.date,
                preferred_time: formData.time,
            } : {
                name: formData.name,
                email: formData.email,
                type: 'message',
                content: formData.message,
            };

            const { error } = await supabase
                .from('messages')
                .insert([payload]);

            if (error) throw error;

            // Send email notification
            try {
                await fetch('/api/send-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
            } catch (err) {
                console.error("Failed to send email notification:", err);
                // We don't block the success state if email fails, but we log it
            }

            if (error) throw error;

            setIsSuccess(true);
            toast.success(mode === 'appointment' ? 'Appointment request sent!' : 'Message sent successfully!');

        } catch (error) {
            console.error('Error sending message:', error);
            toast.error('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    key="backdrop"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998]"
                />
            )}
            {isOpen && (
                <motion.div
                    key="modal"
                    initial={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                    animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
                    exit={{ opacity: 0, scale: 0.95, x: "-50%", y: "-45%" }}
                    className="fixed left-1/2 top-1/2 w-full max-w-lg z-[9999] px-4"
                >
                    <div className="bg-background border border-border rounded-sm shadow-2xl overflow-hidden relative">

                        {/* Success View */}
                        <AnimatePresence>
                            {isSuccess && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="absolute inset-0 z-10 bg-background flex flex-col items-center justify-center p-8 text-center"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                                        className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mb-6"
                                    >
                                        <CheckCircle className="w-10 h-10 text-green-500" />
                                    </motion.div>
                                    <h3 className="text-2xl font-serif font-bold text-main mb-2">
                                        {mode === 'appointment' ? 'Request Received' : 'Message Sent'}
                                    </h3>
                                    <p className="text-muted mb-8 max-w-xs">
                                        {mode === 'appointment'
                                            ? "I'll review your request and confirm the time via email shortly."
                                            : "Thanks for reaching out. I'll get back to you as soon as possible."}
                                    </p>
                                    <button
                                        onClick={onClose}
                                        className="px-8 py-3 bg-surface hover:bg-surface/80 text-main border border-border font-bold tracking-wider transition-colors rounded-sm"
                                    >
                                        CLOSE
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Header */}
                        <div className="p-6 border-b border-border flex justify-between items-center bg-surface/50">
                            <div>
                                <h3 className="text-xl font-serif font-bold text-main">
                                    {mode === 'appointment' ? 'Schedule a Lab' : 'Send a Message'}
                                </h3>
                                <p className="text-sm text-muted mt-1">
                                    {mode === 'appointment'
                                        ? 'Book a 15-minute session to discuss your project.'
                                        : 'Drop me a line and I\'ll get back to you.'}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="text-muted hover:text-main transition-colors p-2 hover:bg-surface/50 rounded-full"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-secondary uppercase tracking-wider block">Your Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className={`w-full bg-surface border ${errors.name ? 'border-red-500' : 'border-border'} rounded-sm py-3 pl-10 pr-4 text-main placeholder:text-muted focus:border-accent focus:outline-none transition-colors`}
                                        placeholder="John Doe"
                                    />
                                </div>
                                {errors.name && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.name}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-secondary uppercase tracking-wider block">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className={`w-full bg-surface border ${errors.email ? 'border-red-500' : 'border-border'} rounded-sm py-3 pl-10 pr-4 text-main placeholder:text-muted focus:border-accent focus:outline-none transition-colors`}
                                        placeholder="john@example.com"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                            </div>

                            {mode === 'appointment' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-secondary uppercase tracking-wider block">Preferred Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="date"
                                                value={formData.date}
                                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                                className={`w-full bg-surface border ${errors.date ? 'border-red-500' : 'border-border'} rounded-sm py-3 pl-10 pr-4 text-main placeholder:text-muted focus:border-accent focus:outline-none transition-colors [color-scheme:dark]`}
                                            />
                                        </div>
                                        {errors.date && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.date}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-mono text-secondary uppercase tracking-wider block">Preferred Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="time"
                                                value={formData.time}
                                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                                className={`w-full bg-surface border ${errors.time ? 'border-red-500' : 'border-border'} rounded-sm py-3 pl-10 pr-4 text-main placeholder:text-muted focus:border-accent focus:outline-none transition-colors [color-scheme:dark]`}
                                            />
                                        </div>
                                        {errors.time && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.time}</p>}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-xs font-mono text-secondary uppercase tracking-wider block">
                                    {mode === 'appointment' ? 'Topic / Details' : 'Message'}
                                </label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-4 w-4 h-4 text-gray-500" />
                                    <textarea
                                        rows={4}
                                        value={mode === 'appointment' ? formData.topic : formData.message}
                                        onChange={(e) => setFormData({ ...formData, [mode === 'appointment' ? 'topic' : 'message']: e.target.value })}
                                        className={`w-full bg-surface border ${errors[mode === 'appointment' ? 'topic' : 'message'] ? 'border-red-500' : 'border-border'} rounded-sm py-3 pl-10 pr-4 text-main placeholder:text-muted focus:border-accent focus:outline-none transition-colors resize-none`}
                                        placeholder={mode === 'appointment' ? "What would you like to discuss?" : "How can I help you?"}
                                    />
                                </div>
                                {errors[mode === 'appointment' ? 'topic' : 'message'] && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors[mode === 'appointment' ? 'topic' : 'message']}</p>}
                            </div>

                            <div className="pt-4 flex gap-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 border border-border text-main font-bold tracking-wider hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 rounded-sm disabled:opacity-50"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-3 bg-accent text-white font-bold tracking-wider hover:bg-accent/80 shadow-[0_0_20px_rgba(139,30,30,0.3)] hover:shadow-[0_0_30px_rgba(139,30,30,0.5)] transition-all duration-300 rounded-sm disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            SENDING...
                                        </>
                                    ) : (
                                        mode === 'appointment' ? 'CONFIRM REQUEST' : 'SEND MESSAGE'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
