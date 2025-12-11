"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Save, ArrowLeft, Eye, FileText, Calendar, Clock, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ScrollEditorProps {
    initialData?: any;
    isNew?: boolean;
}

export default function ScrollEditor({ initialData, isNew = false }: ScrollEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Spellbook",
        published: false,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        read_time: "5 min read",
        icon: "Scroll"
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                excerpt: initialData.excerpt || "",
                content: initialData.content || "",
                category: initialData.category || "Spellbook",
                published: initialData.published || false,
                date: initialData.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                read_time: initialData.read_time || "5 min read",
                icon: initialData.icon || "Scroll"
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Auto-generate slug from title if it's new and slug is empty
        if (name === "title" && isNew && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            updated_at: new Date().toISOString(),
        };

        let error;
        if (isNew) {
            const { error: insertError } = await supabase
                .from('scrolls')
                .insert([payload]);
            error = insertError;
        } else {
            const { error: updateError } = await supabase
                .from('scrolls')
                .update(payload)
                .eq('id', initialData.id);
            error = updateError;
        }

        if (error) {
            alert(`Error: ${error.message}`);
        } else {
            router.push('/admin/content');
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto"
        >
            <header className="flex justify-between items-center mb-8 sticky top-0 z-40 bg-[#050507]/80 backdrop-blur-md py-4 border-b border-white/5">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back
                </button>
                <div className="flex gap-4">
                    <button
                        onClick={() => setPreview(!preview)}
                        className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-lg hover:bg-white/5 transition-colors text-sm font-medium"
                    >
                        {preview ? <FileText className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {preview ? "Edit Mode" : "Preview Mode"}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(199,58,49,0.3)] hover:shadow-[0_0_25px_rgba(199,58,49,0.5)] hover:scale-105"
                    >
                        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isNew ? "PUBLISH SCROLL" : "SAVE CHANGES"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Scroll Title"
                            className="w-full bg-transparent text-5xl font-serif font-bold text-white placeholder:text-gray-700 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
                            <span>/scrolls/</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="bg-transparent text-gray-400 focus:text-white focus:outline-none min-w-[200px]"
                            />
                        </div>
                    </div>

                    {preview ? (
                        <div className="prose prose-invert prose-lg max-w-none min-h-[600px] p-8 bg-[#0b0b0f] border border-white/10 rounded-xl shadow-inner">
                            <ReactMarkdown>{formData.content}</ReactMarkdown>
                        </div>
                    ) : (
                        <textarea
                            name="content"
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Write your story here..."
                            className="w-full h-[700px] bg-[#0b0b0f]/50 border border-white/10 rounded-xl p-8 text-gray-300 focus:border-accent focus:outline-none font-mono resize-none leading-relaxed text-lg focus:ring-1 focus:ring-accent/50 transition-all"
                        />
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 shadow-lg sticky top-24">
                        <h3 className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                            <FileText className="w-4 h-4 text-accent" /> Settings
                        </h3>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Category</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-accent focus:outline-none transition-colors appearance-none cursor-pointer hover:border-white/30"
                            >
                                <option value="Spellbook">Spellbook (Tech)</option>
                                <option value="Reflections">Reflections (Thoughts)</option>
                                <option value="Lore">Lore (Story)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Status</label>
                            <label className="flex items-center gap-3 p-3 bg-black/50 border border-white/10 rounded-lg cursor-pointer hover:border-white/30 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={formData.published}
                                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                                    className="w-4 h-4 accent-accent rounded"
                                />
                                <span className={`text-sm font-medium ${formData.published ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {formData.published ? 'Published' : 'Draft Mode'}
                                </span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Excerpt</label>
                            <textarea
                                name="excerpt"
                                value={formData.excerpt}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none resize-none placeholder:text-gray-600 transition-colors"
                                placeholder="Brief summary..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                    <input
                                        type="text"
                                        name="date"
                                        value={formData.date}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-8 pr-3 text-xs text-white focus:border-accent focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Read Time</label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                    <input
                                        type="text"
                                        name="read_time"
                                        value={formData.read_time}
                                        onChange={handleChange}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-8 pr-3 text-xs text-white focus:border-accent focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Icon</label>
                            <div className="relative">
                                <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-500" />
                                <select
                                    name="icon"
                                    value={formData.icon}
                                    onChange={handleChange}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg py-3 pl-8 pr-3 text-xs text-white focus:border-accent focus:outline-none appearance-none cursor-pointer"
                                >
                                    <option value="Scroll">Scroll</option>
                                    <option value="Code">Code</option>
                                    <option value="Sparkles">Sparkles</option>
                                    <option value="Feather">Feather</option>
                                    <option value="Book">Book</option>
                                    <option value="Archive">Archive</option>
                                    <option value="Terminal">Terminal</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
