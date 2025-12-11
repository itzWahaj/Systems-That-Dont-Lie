"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield, Lock, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { toast } from "sonner";

const passwordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

import { useLoader } from "@/context/LoaderContext";

export default function UpdatePasswordPage() {
    const { showLoader, hideLoader } = useLoader();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const router = useRouter();

    useEffect(() => {
        // Check if we have a session, if not redirect to login
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (!session) {
                router.push("/admin");
            }
        });
    }, [router]);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        showLoader();
        setErrors({});

        try {
            // Validate
            passwordSchema.parse({ password, confirmPassword });

            const { error } = await supabase.auth.updateUser({
                password: password
            });

            if (error) throw error;

            toast.success("Password updated successfully!");
            router.push("/admin/dashboard");

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
                            <Lock className="w-8 h-8 text-accent" />
                        </div>
                        <h1 className="text-2xl font-serif font-bold text-white">Update Password</h1>
                        <p className="text-gray-500 text-sm">Enter your new secure password.</p>
                    </div>

                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">New Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full bg-black/50 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-md py-3 px-4 text-white placeholder:text-gray-700 focus:border-accent focus:outline-none transition-colors`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.password && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.password}</p>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-mono text-gray-400 uppercase tracking-wider">Confirm Password</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full bg-black/50 border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} rounded-md py-3 px-4 text-white placeholder:text-gray-700 focus:border-accent focus:outline-none transition-colors`}
                                    placeholder="••••••••"
                                />
                            </div>
                            {errors.confirmPassword && <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {errors.confirmPassword}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-white text-black font-bold py-3 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                            ) : (
                                <>
                                    UPDATE PASSWORD <CheckCircle className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}
