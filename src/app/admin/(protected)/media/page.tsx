"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Upload,
    Image as ImageIcon,
    Trash2,
    Copy,
    Check
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import ConfirmationModal from "@/components/admin/ConfirmationModal";

interface MediaFile {
    name: string;
    id: string;
    updated_at: string;
    created_at: string;
    last_accessed_at: string;
    metadata: Record<string, any>;
}

export default function MediaManager() {
    const [files, setFiles] = useState<MediaFile[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isUploading, setIsUploading] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    // Modal State
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [fileToDelete, setFileToDelete] = useState<string | null>(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = async () => {
        const { data, error } = await supabase
            .storage
            .from('media')
            .list();

        if (data) {
            setFiles(data);
        }
        setIsLoading(false);
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setIsUploading(true);
        const file = e.target.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await supabase.storage
            .from('media')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading file:', error);
            toast.error("Upload failed: " + error.message);
        } else {
            toast.success("File uploaded successfully");
            fetchFiles();
        }
        setIsUploading(false);
    };

    const copyUrl = (name: string) => {
        const { data } = supabase.storage.from('media').getPublicUrl(name);
        navigator.clipboard.writeText(data.publicUrl);
        setCopiedId(name);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleDeleteClick = (name: string) => {
        setFileToDelete(name);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!fileToDelete) return;

        const { error } = await supabase.storage
            .from('media')
            .remove([fileToDelete]);

        if (error) {
            console.error('Error deleting file:', error);
            toast.error("Failed to delete file");
        } else {
            toast.success("File deleted successfully");
            fetchFiles();
        }

        setIsDeleteModalOpen(false);
        setFileToDelete(null);
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
        hidden: { opacity: 0, scale: 0.9 },
        show: { opacity: 1, scale: 1 }
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
                    <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Media Library</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Manage Images and Assets</p>
                </div>
                <div className="relative group">
                    <input
                        type="file"
                        onChange={handleUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={isUploading}
                    />
                    <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg group-hover:bg-red-700 transition-all text-sm shadow-[0_0_20px_rgba(199,58,49,0.3)] group-hover:shadow-[0_0_25px_rgba(199,58,49,0.5)] group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        {isUploading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Upload className="w-4 h-4" />
                        )}
                        {isUploading ? 'UPLOADING...' : 'UPLOAD NEW'}
                    </button>
                </div>
            </header>

            {isLoading ? (
                <div className="p-12 text-center text-gray-500 font-mono animate-pulse">Loading media library...</div>
            ) : files.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-white/10 rounded-xl bg-white/5">
                    <ImageIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-medium">No media files found.</p>
                    <p className="text-sm text-gray-600 mt-2 font-mono">Upload images to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {files.map((file) => {
                        const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(file.name);

                        return (
                            <motion.div
                                key={file.id}
                                variants={item}
                                layout
                                className="group relative bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden aspect-square shadow-lg hover:shadow-xl transition-all hover:border-white/30"
                            >
                                <img
                                    src={publicUrl}
                                    alt={file.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 backdrop-blur-[2px]">
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDeleteClick(file.name)}
                                            className="p-2 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all transform hover:scale-110"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        <p className="text-xs text-gray-300 truncate font-mono bg-black/40 p-1 rounded">{file.name}</p>
                                        <button
                                            onClick={() => copyUrl(file.name)}
                                            className="w-full flex items-center justify-center gap-2 py-2 bg-white text-black font-bold text-xs rounded-lg hover:bg-gray-200 transition-all transform hover:scale-105 active:scale-95"
                                        >
                                            {copiedId === file.name ? (
                                                <>
                                                    <Check className="w-3 h-3 text-green-600" /> COPIED
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-3 h-3" /> COPY URL
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}


            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => {
                    setIsDeleteModalOpen(false);
                    setFileToDelete(null);
                }}
                onConfirm={handleConfirmDelete}
                title="Delete Media"
                message="Are you sure you want to delete this file? This action cannot be undone and might break links on your site."
                confirmText="DELETE FILE"
            />
        </motion.div>
    );
}
