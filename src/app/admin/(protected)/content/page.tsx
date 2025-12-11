"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    FileText,
    Calendar,
    Eye,
    Trash2,
    CheckCircle,
    XCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

interface Scroll {
    id: string;
    title: string;
    slug: string;
    content: string;
    published: boolean;
    created_at: string;
    category: string;
    description?: string; // Added description to interface as it might be used
}

import { useLoader } from "@/context/LoaderContext";

export default function ContentManager() {
    const { showLoader, hideLoader } = useLoader();
    const [searchTerm, setSearchTerm] = useState("");
    const [scrolls, setScrolls] = useState<Scroll[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [scrollToDelete, setScrollToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchScrolls();
    }, []);

    const fetchScrolls = async () => {
        showLoader();
        const { data, error } = await supabase
            .from('scrolls')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setScrolls(data);
        }
        setIsLoading(false);
        hideLoader();
    };

    const handleDeleteClick = (id: string) => {
        setScrollToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!scrollToDelete) return;

        showLoader();
        const { error } = await supabase
            .from('scrolls')
            .delete()
            .eq('id', scrollToDelete);

        if (!error) {
            setScrolls(scrolls.filter(s => s.id !== scrollToDelete));
            toast.success("Scroll deleted successfully");
        } else {
            toast.error("Error deleting scroll: " + error.message);
        }

        setIsDeleteModalOpen(false);
        setScrollToDelete(null);
        hideLoader();
    };

    const handleTogglePublish = async (scroll: Scroll) => {
        showLoader();
        const { error } = await supabase
            .from('scrolls')
            .update({ published: !scroll.published })
            .eq('id', scroll.id);

        if (!error) {
            setScrolls(scrolls.map(s =>
                s.id === scroll.id ? { ...s, published: !s.published } : s
            ));
            toast.success(scroll.published ? "Scroll unpublished" : "Scroll published live");
        } else {
            toast.error("Error updating scroll: " + error.message);
        }
        hideLoader();
    };

    const filteredScrolls = scrolls.filter(scroll =>
        scroll.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Content Manager</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Manage Scrolls, Reflections, and Lore</p>
                </div>
                <Link href="/admin/content/new">
                    <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-red-700 transition-all text-sm shadow-[0_0_20px_rgba(199,58,49,0.3)] hover:shadow-[0_0_25px_rgba(199,58,49,0.5)] hover:scale-105">
                        <Plus className="w-4 h-4" /> CREATE NEW
                    </button>
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-accent focus:outline-none transition-all text-sm focus:ring-1 focus:ring-accent/50"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 text-gray-400 font-medium rounded-lg hover:text-white hover:border-white/30 transition-colors text-sm">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Content Table */}
            <div className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs font-mono text-gray-400 uppercase tracking-wider">
                            <th className="p-6 font-medium">Title</th>
                            <th className="p-6 font-medium">Category</th>
                            <th className="p-6 font-medium">Date</th>
                            <th className="p-6 font-medium">Status</th>
                            <th className="p-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">Loading scrolls...</td>
                            </tr>
                        ) : filteredScrolls.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">No scrolls found.</td>
                            </tr>
                        ) : (
                            filteredScrolls.map((scroll) => (
                                <motion.tr
                                    key={scroll.id}
                                    variants={item}
                                    className="group hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className="text-base font-bold text-white group-hover:text-accent transition-colors">{scroll.title}</p>
                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-[250px] mt-1">{scroll.content.substring(0, 50)}...</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <span className={`text-xs font-mono px-2 py-1 rounded border uppercase tracking-wider border-accent/20 text-accent bg-accent/5`}>
                                            {scroll.category || 'Scroll'}
                                        </span>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(scroll.created_at).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${scroll.published ? 'bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-yellow-500'}`} />
                                            <span className={`text-xs font-medium font-mono uppercase ${scroll.published ? 'text-green-500' : 'text-yellow-500'}`}>
                                                {scroll.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleTogglePublish(scroll)}
                                                className={`p-2 rounded-lg transition-colors border border-transparent hover:border-white/10 ${scroll.published ? 'text-green-500 hover:bg-green-500/10' : 'text-yellow-500 hover:bg-yellow-500/10'}`}
                                                title={scroll.published ? "Unpublish" : "Publish"}
                                            >
                                                {scroll.published ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            </button>
                                            <Link href={`/admin/content/edit/${scroll.id}`}>
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10" title="Edit">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDeleteClick(scroll.id)}
                                                className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                                                title="Delete"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setScrollToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Scroll"
                message="Are you sure you want to delete this scroll? This action cannot be undone."
                confirmText="DELETE PERMANENTLY"
            />
        </motion.div>
    );
}
