"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Save, ArrowLeft, Eye, FolderKanban, Plus, X, Lightbulb, Check } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

interface ProjectEditorProps {
    initialData?: any;
    isNew?: boolean;
}

interface Innovation {
    title: string;
    desc: string;
}

export default function ProjectEditor({ initialData, isNew = false }: ProjectEditorProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [tagInput, setTagInput] = useState("");

    // Innovations State
    const [innovations, setInnovations] = useState<Innovation[]>([]);
    const [newInnovation, setNewInnovation] = useState({ title: "", desc: "" });

    // Technical Summary State
    const [technicalSummary, setTechnicalSummary] = useState<{ key: string; value: string }[]>([]);
    const [newTechSummary, setNewTechSummary] = useState({ key: "", value: "" });

    // Demo Checklist State
    const [demoChecklist, setDemoChecklist] = useState<string[]>([]);
    const [newChecklistItem, setNewChecklistItem] = useState("");

    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        subtitle: "", // Was description
        content: "",
        tech_stack: [] as string[],
        demo_url: "", // Was live_url
        repo_url: "", // Was github_url
        thumbnail: "", // Was image_url
        published: false
    });

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || "",
                slug: initialData.slug || "",
                subtitle: initialData.subtitle || "",
                content: initialData.content || "",
                tech_stack: initialData.tech_stack || [],
                demo_url: initialData.demo_url || "",
                repo_url: initialData.repo_url || "",
                thumbnail: initialData.thumbnail || "",
                published: initialData.published || false
            });
            if (initialData.innovations) {
                setInnovations(initialData.innovations);
            }
            if (initialData.technical_summary) {
                // Handle both array of objects (if stored that way) or object (if stored as json map)
                if (Array.isArray(initialData.technical_summary)) {
                    setTechnicalSummary(initialData.technical_summary);
                } else {
                    // Convert object to array
                    setTechnicalSummary(Object.entries(initialData.technical_summary).map(([key, value]) => ({ key, value: String(value) })));
                }
            }
            if (initialData.demo_checklist) {
                setDemoChecklist(initialData.demo_checklist);
            }
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (name === "title" && isNew && !formData.slug) {
            setFormData(prev => ({
                ...prev,
                slug: value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
            }));
        }
    };

    const handleAddTag = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault();
            if (!formData.tech_stack.includes(tagInput.trim())) {
                setFormData(prev => ({
                    ...prev,
                    tech_stack: [...prev.tech_stack, tagInput.trim()]
                }));
            }
            setTagInput("");
        }
    };

    const removeTag = (tagToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            tech_stack: prev.tech_stack.filter(tag => tag !== tagToRemove)
        }));
    };

    const addInnovation = () => {
        if (newInnovation.title && newInnovation.desc) {
            setInnovations([...innovations, newInnovation]);
            setNewInnovation({ title: "", desc: "" });
        }
    };

    const removeInnovation = (index: number) => {
        const newInnovations = [...innovations];
        newInnovations.splice(index, 1);
        setInnovations(newInnovations);
    };

    // Technical Summary Handlers
    const addTechSummaryItem = () => {
        if (newTechSummary.key && newTechSummary.value) {
            setTechnicalSummary([...technicalSummary, newTechSummary]);
            setNewTechSummary({ key: "", value: "" });
        }
    };

    const removeTechSummaryItem = (index: number) => {
        const newSummary = [...technicalSummary];
        newSummary.splice(index, 1);
        setTechnicalSummary(newSummary);
    };

    // Demo Checklist Handlers
    const addChecklistItem = () => {
        if (newChecklistItem.trim()) {
            setDemoChecklist([...demoChecklist, newChecklistItem.trim()]);
            setNewChecklistItem("");
        }
    };

    const removeChecklistItem = (index: number) => {
        const newChecklist = [...demoChecklist];
        newChecklist.splice(index, 1);
        setDemoChecklist(newChecklist);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            title: formData.title,
            slug: formData.slug,
            subtitle: formData.subtitle,
            content: formData.content,
            tech_stack: formData.tech_stack,
            demo_url: formData.demo_url,
            repo_url: formData.repo_url,
            thumbnail: formData.thumbnail,
            published: formData.published,
            innovations: innovations,
            technical_summary: technicalSummary,
            demo_checklist: demoChecklist,
            updated_at: new Date().toISOString(),
        };

        console.log("Submitting payload:", payload);

        let error;
        if (isNew) {
            const { error: insertError } = await supabase
                .from('projects')
                .insert([payload]);
            error = insertError;
        } else {
            const { error: updateError } = await supabase
                .from('projects')
                .update(payload)
                .eq('id', initialData.id);
            error = updateError;
        }

        if (error) {
            console.error("Error saving project:", error);
            toast.error(`Error: ${error.message}`);
        } else {
            toast.success('Project saved successfully!');
            router.push('/admin/projects');
            router.refresh();
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
                        {preview ? <FolderKanban className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {preview ? "Edit Mode" : "Preview Mode"}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 px-6 py-2 bg-accent text-white font-bold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 shadow-[0_0_20px_rgba(199,58,49,0.3)] hover:shadow-[0_0_25px_rgba(199,58,49,0.5)] hover:scale-105"
                    >
                        {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                        {isNew ? "PUBLISH PROJECT" : "SAVE CHANGES"}
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
                {/* Main Editor */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="space-y-4">
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Project Title"
                            className="w-full bg-transparent text-5xl font-serif font-bold text-white placeholder:text-gray-700 focus:outline-none"
                        />
                        <div className="flex items-center gap-2 text-sm text-gray-500 font-mono bg-white/5 w-fit px-3 py-1 rounded-full border border-white/10">
                            <span>/projects/</span>
                            <input
                                type="text"
                                name="slug"
                                value={formData.slug}
                                onChange={handleChange}
                                className="bg-transparent text-gray-400 focus:text-white focus:outline-none min-w-[200px]"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider">Subtitle</label>
                        <textarea
                            name="subtitle"
                            value={formData.subtitle}
                            onChange={handleChange}
                            rows={3}
                            className="w-full bg-[#0b0b0f]/50 border border-white/10 rounded-xl p-4 text-gray-300 focus:border-accent focus:outline-none resize-none text-lg leading-relaxed transition-all focus:ring-1 focus:ring-accent/50"
                            placeholder="Brief overview for the card..."
                        />
                    </div>

                    {/* Technical Summary Section */}
                    <div className="space-y-4 bg-[#0b0b0f]/30 p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <FolderKanban className="w-4 h-4 text-blue-400" /> Technical Summary
                        </h3>
                        <div className="space-y-3">
                            {technicalSummary.map((item, idx) => (
                                <div key={idx} className="bg-black/40 p-3 rounded border border-white/10 flex justify-between items-center">
                                    <div className="flex gap-2 items-center">
                                        <span className="font-bold text-accent text-sm">{item.key}:</span>
                                        <span className="text-gray-300 text-sm">{item.value}</span>
                                    </div>
                                    <button onClick={() => removeTechSummaryItem(idx)} className="text-gray-500 hover:text-red-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Key (e.g. Chain)"
                                value={newTechSummary.key}
                                onChange={(e) => setNewTechSummary({ ...newTechSummary, key: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white"
                            />
                            <input
                                type="text"
                                placeholder="Value (e.g. Polygon)"
                                value={newTechSummary.value}
                                onChange={(e) => setNewTechSummary({ ...newTechSummary, value: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white"
                            />
                        </div>
                        <button onClick={addTechSummaryItem} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded">
                            + Add Summary Item
                        </button>
                    </div>

                    {/* Innovations Section */}
                    <div className="space-y-4 bg-[#0b0b0f]/30 p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-yellow-400" /> Key Innovations
                        </h3>
                        <div className="space-y-3">
                            {innovations.map((inv, idx) => (
                                <div key={idx} className="bg-black/40 p-3 rounded border border-white/10 flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-white text-sm">{inv.title}</p>
                                        <p className="text-gray-400 text-sm">{inv.desc}</p>
                                    </div>
                                    <button onClick={() => removeInnovation(idx)} className="text-gray-500 hover:text-red-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <input
                                type="text"
                                placeholder="Innovation Title"
                                value={newInnovation.title}
                                onChange={(e) => setNewInnovation({ ...newInnovation, title: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white"
                            />
                            <input
                                type="text"
                                placeholder="Description"
                                value={newInnovation.desc}
                                onChange={(e) => setNewInnovation({ ...newInnovation, desc: e.target.value })}
                                className="bg-black/50 border border-white/10 rounded p-2 text-sm text-white"
                            />
                        </div>
                        <button onClick={addInnovation} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded">
                            + Add Innovation
                        </button>
                    </div>

                    {/* Demo Checklist Section */}
                    <div className="space-y-4 bg-[#0b0b0f]/30 p-6 rounded-xl border border-white/5">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-400" /> Demo Checklist
                        </h3>
                        <div className="space-y-2">
                            {demoChecklist.map((item, idx) => (
                                <div key={idx} className="bg-black/40 p-3 rounded border border-white/10 flex justify-between items-center">
                                    <span className="text-gray-300 text-sm">{idx + 1}. {item}</span>
                                    <button onClick={() => removeChecklistItem(idx)} className="text-gray-500 hover:text-red-400">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Checklist Item"
                                value={newChecklistItem}
                                onChange={(e) => setNewChecklistItem(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                                className="flex-1 bg-black/50 border border-white/10 rounded p-2 text-sm text-white"
                            />
                            <button onClick={addChecklistItem} className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded whitespace-nowrap">
                                + Add Item
                            </button>
                        </div>
                    </div>

                    {preview ? (
                        <div className="prose prose-invert prose-lg max-w-none min-h-[500px] p-8 bg-[#0b0b0f] border border-white/10 rounded-xl shadow-inner">
                            <ReactMarkdown
                                components={{
                                    img: ({ src, alt }) => {
                                        if (!src) return null;
                                        return (
                                            <div className="my-8 w-full bg-white/5 p-2 rounded-lg border border-white/10">
                                                <img src={src} alt={alt || "Project Image"} className="w-full rounded-sm opacity-100" />
                                                {alt && <p className="text-center text-sm text-gray-500 mt-2 font-mono">{alt}</p>}
                                            </div>
                                        );
                                    }
                                }}
                            >
                                {formData.content}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="block text-xs font-mono text-gray-500 uppercase tracking-wider">Detailed Content (Markdown)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="file"
                                        id="imageUpload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={async (e) => {
                                            if (!e.target.files || e.target.files.length === 0) return;
                                            const file = e.target.files[0];
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
                                            const filePath = `${fileName}`;

                                            setLoading(true);
                                            const { error: uploadError } = await supabase.storage
                                                .from('media')
                                                .upload(filePath, file);

                                            if (uploadError) {
                                                toast.error('Error uploading image: ' + uploadError.message);
                                                setLoading(false);
                                                return;
                                            }

                                            const { data: { publicUrl } } = supabase.storage
                                                .from('media')
                                                .getPublicUrl(filePath);

                                            const imageMarkdown = `\n![Image Description](${publicUrl})\n`;

                                            const textarea = document.getElementById('content-textarea') as HTMLTextAreaElement;
                                            if (textarea) {
                                                const start = textarea.selectionStart;
                                                const end = textarea.selectionEnd;
                                                const text = formData.content;
                                                const before = text.substring(0, start);
                                                const after = text.substring(end, text.length);
                                                const newContent = before + imageMarkdown + after;
                                                setFormData(prev => ({ ...prev, content: newContent }));
                                            } else {
                                                setFormData(prev => ({ ...prev, content: prev.content + imageMarkdown }));
                                            }
                                            setLoading(false);
                                            e.target.value = ''; // Reset input
                                        }}
                                    />
                                    <button
                                        onClick={() => document.getElementById('imageUpload')?.click()}
                                        className="text-xs flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded transition-colors"
                                    >
                                        <Plus className="w-3 h-3" /> Insert Image
                                    </button>
                                </div>
                            </div>
                            <textarea
                                id="content-textarea"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                placeholder="Deep dive into the project..."
                                className="w-full h-[600px] bg-[#0b0b0f]/50 border border-white/10 rounded-xl p-8 text-gray-300 focus:border-accent focus:outline-none font-mono resize-none leading-relaxed text-lg focus:ring-1 focus:ring-accent/50 transition-all"
                            />
                        </div>
                    )}
                </div>

                {/* Sidebar Settings */}
                <div className="space-y-6">
                    <div className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-6 shadow-lg sticky top-24">
                        <h3 className="font-bold text-white flex items-center gap-2 border-b border-white/10 pb-4">
                            <FolderKanban className="w-4 h-4 text-accent" /> Configuration
                        </h3>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Tech Stack</label>
                            <div className="flex flex-wrap gap-2 mb-3">
                                {formData.tech_stack.map((tag, index) => (
                                    <span key={index} className="flex items-center gap-1 px-2 py-1 bg-white/10 rounded-md text-xs text-white border border-white/10">
                                        {tag}
                                        <button onClick={() => removeTag(tag)} className="hover:text-red-400 transition-colors"><X className="w-3 h-3" /></button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Type & Enter to add..."
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Status</label>
                            <div className="space-y-3">
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
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Links</label>
                            <div className="space-y-3">
                                <input
                                    type="text"
                                    name="demo_url"
                                    value={formData.demo_url}
                                    onChange={handleChange}
                                    placeholder="Demo URL"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                                />
                                <input
                                    type="text"
                                    name="repo_url"
                                    value={formData.repo_url}
                                    onChange={handleChange}
                                    placeholder="Repo URL"
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2 tracking-wider">Thumbnail URL</label>
                            <input
                                type="text"
                                name="thumbnail"
                                value={formData.thumbnail}
                                onChange={handleChange}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-sm text-white focus:border-accent focus:outline-none transition-colors"
                                placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
