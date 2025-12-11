"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { User, Shield, Key, Save } from "lucide-react";

export default function SettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            setLoading(false);
        };
        getUser();
    }, []);

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");

        const { error } = await supabase.auth.updateUser({
            password: password
        });

        if (error) {
            setMessage(`Error: ${error.message}`);
        } else {
            setMessage("Password updated successfully.");
            setPassword("");
        }
    };

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    if (loading) return <div className="p-12 text-center text-gray-500 font-mono animate-pulse">Loading settings...</div>;

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Settings</h1>
                <p className="text-gray-400 mt-2 font-mono text-sm">System Configuration & Security</p>
            </header>

            <div className="max-w-3xl space-y-8 mt-8">
                {/* Profile Section */}
                <motion.div variants={item} className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-accent/10 rounded-lg">
                            <User className="w-5 h-5 text-accent" />
                        </div>
                        Admin Profile
                    </h2>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Email Address</label>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10 text-gray-300 font-mono text-sm">
                                {user?.email}
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Role</label>
                            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10 text-gray-300">
                                <Shield className="w-5 h-5 text-green-400" />
                                <span className="text-sm font-medium">Super Admin</span>
                                <span className="ml-auto text-[10px] bg-green-400/10 text-green-400 px-2 py-1 rounded border border-green-400/20 uppercase tracking-wider">Active</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Security Section */}
                <motion.div variants={item} className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 shadow-lg">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <div className="p-2 bg-blue-400/10 rounded-lg">
                            <Key className="w-5 h-5 text-blue-400" />
                        </div>
                        Security
                    </h2>

                    <form onSubmit={updatePassword} className="space-y-6">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">New Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white focus:border-accent focus:outline-none transition-all focus:ring-1 focus:ring-accent/50 placeholder:text-gray-600"
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>

                        {message && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`text-sm p-4 rounded-lg border ${message.includes('Error') ? 'bg-red-400/10 border-red-400/20 text-red-400' : 'bg-green-400/10 border-green-400/20 text-green-400'}`}
                            >
                                {message}
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={!password}
                            className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02]"
                        >
                            <Save className="w-4 h-4" /> UPDATE PASSWORD
                        </button>
                    </form>
                </motion.div>
            </div>
        </motion.div>
    );
}
