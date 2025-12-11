"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Lock, ArrowRight, AlertCircle, Mail, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const forgotPasswordSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
});

import { useLoader } from "@/context/LoaderContext";

export default function AdminLoginPage() {
    const { showLoader, hideLoader } = useLoader();
    const [mode, setMode] = useState<'login' | 'forgot-password'>('login');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [resetSent, setResetSent] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        showLoader();
        setErrors({});

        try {
            if (mode === 'login') {
                // Validate Login
                loginSchema.parse({ email, password });

                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) throw error;

                toast.success("Welcome back, Admin.");
                router.push("/admin/dashboard");

            } else {
                // Validate Forgot Password
                forgotPasswordSchema.parse({ email });

                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/admin/update-password`,
                });

                if (error) throw error;

                setResetSent(true);
                toast.success("Password reset link sent!");
                hideLoader();
            }

        } catch (error) {
            hideLoader();
            if (error instanceof z.ZodError) {
                const newErrors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path[0]) {
                        newErrors[err.path[0].toString()] = err.message;
                    }
                });
                setErrors(newErrors);
            } else if (error instanceof Error) {
                toast.error(error.message);
                setErrors({ form: error.message });
            } else {
                toast.error("An unknown error occurred");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#050507] flex items-center justify-center px-6 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent/5 via-transparent to-transparent opacity-50" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-[#0b0b0f] border border-white/10 rounded-lg shadow-2xl relative z-10 overflow-hidden"
            >
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-accent to-transparent" />

                <div className="p-8 space-y-8">
                    <div className="text-center space-y-2">
                        <div className="inline-flex p-3 bg-accent/10 rounded-full mb-4 ring-1 ring-accent/20">
                            <Shield className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-white">
                            {mode === 'login' ? 'System Access' : 'Reset Access'}
                        </h1>
                        <p className="text-gray-500 text-sm">
                            {mode === 'login' ? 'Restricted Area. Authorized Personnel Only.' : 'Enter your email to receive recovery instructions.'}
                        </p>
                    </div>

                    {resetSent ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-6 py-4"
                        >
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-8 h-8 text-green-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-bold">Check your inbox</h3>
                                <p className="text-gray-400 text-sm">
                                    We've sent a password reset link to <span className="text-white">{email}</span>
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    setResetSent(false);
                                    setMode('login');
                                    setEmail('');
                                    setPassword('');
                                }}
                                className="text-accent hover:text-white text-sm font-mono uppercase tracking-wider transition-colors"
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Identity</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={`w-full bg-black/50 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-md py-3 pl-10 pr-4 text-white placeholder:text-gray-700 focus:border-accent focus:outline-none transition-colors`}
                                        placeholder="admin@wahaj.dev"
                                        autoComplete="email"
                                    />
                                </div>
                                {errors.email && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.email}</p>}
                            </div>

                            <AnimatePresence mode="popLayout">
                                {mode === 'login' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-2 overflow-hidden"
                                    >
                                        <div className="flex justify-between items-center">
                                            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Passkey</label>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setMode('forgot-password');
                                                    setErrors({});
                                                }}
                                                className="text-[10px] text-accent hover:text-white transition-colors uppercase tracking-wider font-bold"
                                            >
                                                Forgot Password?
                                            </button>
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className={`w-full bg-black/50 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-md py-3 pl-10 pr-4 text-white placeholder:text-gray-700 focus:border-accent focus:outline-none transition-colors`}
                                                placeholder="••••••••"
                                                autoComplete="current-password"
                                            />
                                        </div>
                                        {errors.password && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {errors.form && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="flex items-center gap-2 text-red-400 text-sm bg-red-400/5 p-3 rounded border border-red-400/10"
                                >
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.form}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            {mode === 'login' ? 'AUTHENTICATE' : 'SEND RESET LINK'} <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>

                                {mode === 'forgot-password' && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMode('login');
                                            setErrors({});
                                        }}
                                        className="w-full text-gray-500 hover:text-white text-xs font-mono uppercase tracking-wider transition-colors"
                                    >
                                        Back to Login
                                    </button>
                                )}
                            </div>
                        </form>
                    )}
                </div>

                <div className="p-4 bg-black/30 border-t border-white/5 text-center">
                    <p className="text-[10px] text-gray-600 font-mono">SECURE CONNECTION • ENCRYPTED</p>
                </div>
            </motion.div>
        </div>
    );
}
