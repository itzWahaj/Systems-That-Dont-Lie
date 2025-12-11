"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "DELETE",
    cancelText = "CANCEL",
    isLoading = false,
}: ConfirmationModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9998]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
                        animate={{ opacity: 1, scale: 1, y: "-50%", x: "-50%" }}
                        exit={{ opacity: 0, scale: 0.95, y: 20, x: "-50%" }}
                        className="fixed left-1/2 top-1/2 w-full max-w-md z-[9999] px-4"
                    >
                        <div className="bg-surface border border-border rounded-lg shadow-2xl overflow-hidden">
                            {/* Header */}
                            <div className="p-6 border-b border-border flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-red-500/10 rounded-full">
                                        <AlertCircle className="w-6 h-6 text-red-500" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-main">
                                        {title}
                                    </h3>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="text-muted hover:text-main transition-colors p-1"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-muted leading-relaxed">
                                    {message}
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="p-6 border-t border-border bg-background/50 flex gap-3 justify-end">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-4 py-2 text-sm font-bold tracking-wider text-muted hover:text-main hover:bg-surface border border-transparent hover:border-border rounded-sm transition-all"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className="px-6 py-2 text-sm font-bold tracking-wider bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_25px_rgba(220,38,38,0.5)] transition-all rounded-sm flex items-center gap-2"
                                >
                                    {isLoading ? "PROCESSING..." : confirmText}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
