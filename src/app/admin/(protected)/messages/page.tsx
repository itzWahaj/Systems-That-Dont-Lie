"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
    Search,
    Filter,
    Mail,
    Trash2,
    Eye,
    MessageSquare,
    Send,
    Reply
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useLoader } from "@/context/LoaderContext";

interface Message {
    id: string;
    name: string;
    email: string;
    subject?: string;
    content: string;
    created_at: string;
    type: string;
}

export default function MessagesManager() {
    const { showLoader, hideLoader } = useLoader();
    const [searchTerm, setSearchTerm] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
    const [replyText, setReplyText] = useState("");
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        setReplyText("");
    }, [selectedMessage]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        showLoader();
        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setMessages(data);
        }
        setIsLoading(false);
        hideLoader();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this message?")) {
            showLoader();
            const { error } = await supabase
                .from('messages')
                .delete()
                .eq('id', id);

            if (!error) {
                setMessages(messages.filter(m => m.id !== id));
                toast.success("Message deleted");
                if (selectedMessage?.id === id) setSelectedMessage(null);
            } else {
                toast.error("Error deleting message: " + error.message);
            }
            hideLoader();
        }
    };

    const handleSendReply = async () => {
        if (!selectedMessage || !replyText.trim()) return;

        setIsSending(true);
        try {
            const res = await fetch('/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'reply',
                    name: selectedMessage.name,
                    email: selectedMessage.email,
                    subject: selectedMessage.subject,
                    content: replyText
                })
            });

            if (res.ok) {
                toast.success("Reply sent successfully!");
                setReplyText("");
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            toast.error("Failed to send reply");
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    const filteredMessages = messages.filter(message =>
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (message.content || "").toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Messages</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Inbox & Inquiries</p>
                </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* List Column */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Toolbar */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search messages..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-accent focus:outline-none transition-all text-sm focus:ring-1 focus:ring-accent/50"
                        />
                    </div>

                    <div className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl max-h-[600px] overflow-y-auto">
                        {isLoading ? (
                            <div className="p-12 text-center text-gray-500 font-mono">Loading...</div>
                        ) : filteredMessages.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 font-mono">No messages found.</div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {filteredMessages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`p-4 cursor-pointer hover:bg-white/5 transition-colors ${selectedMessage?.id === msg.id ? 'bg-white/10 border-l-2 border-accent' : 'border-l-2 border-transparent'}`}
                                    >
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`font-bold text-sm ${selectedMessage?.id === msg.id ? 'text-white' : 'text-gray-300'}`}>{msg.name}</h4>
                                            <span className="text-[10px] text-gray-500 font-mono">{new Date(msg.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">{msg.email}</p>
                                        <p className="text-xs text-gray-500 line-clamp-2">{msg.content}</p>
                                        <div className="mt-2 flex gap-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded border ${(msg.type === 'demo' || msg.content?.includes('[DEMO REQUEST]')) ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                                                {(msg.type === 'demo' || msg.content?.includes('[DEMO REQUEST]')) ? 'DEMO REQUEST' : 'CONTACT'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail Column */}
                <div className="lg:col-span-2">
                    {selectedMessage ? (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            key={selectedMessage.id}
                            className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-8 sticky top-8"
                        >
                            <div className="flex justify-between items-start mb-8 border-b border-white/10 pb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-2">{selectedMessage.name}</h2>
                                    <a href={`mailto:${selectedMessage.email}`} className="text-accent hover:underline flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> {selectedMessage.email}
                                    </a>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-gray-500 font-mono">
                                        {new Date(selectedMessage.created_at).toLocaleString()}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(selectedMessage.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors border border-transparent hover:border-red-500/20"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none">
                                <div className="mb-6">
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-2">Subject / Type</span>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs px-2 py-1 rounded border ${(selectedMessage.type === 'demo' || selectedMessage.content?.includes('[DEMO REQUEST]')) ? 'border-blue-500/30 text-blue-400 bg-blue-500/10' : 'border-green-500/30 text-green-400 bg-green-500/10'}`}>
                                            {(selectedMessage.type === 'demo' || selectedMessage.content?.includes('[DEMO REQUEST]')) ? 'DEMO REQUEST' : 'CONTACT FORM'}
                                        </span>
                                        {selectedMessage.subject && <span className="text-white">{selectedMessage.subject}</span>}
                                    </div>
                                </div>

                                <div>
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-4">Message Content</span>
                                    <div className="bg-white/5 p-6 rounded-lg text-gray-300 leading-relaxed whitespace-pre-wrap border border-white/5">
                                        {selectedMessage.content}
                                    </div>
                                </div>

                                <div className="mt-8 border-t border-white/10 pt-8">
                                    <span className="text-xs font-mono text-gray-500 uppercase tracking-wider block mb-4">Send a Reply</span>
                                    <div className="space-y-4">
                                        <div className="relative">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                rows={4}
                                                className="w-full bg-black/50 border border-white/10 rounded-lg p-4 text-white placeholder:text-gray-600 focus:border-accent focus:outline-none transition-colors resize-none text-sm"
                                                placeholder={`Reply to ${selectedMessage.name}...`}
                                            />
                                            <div className="absolute right-3 bottom-3 text-xs text-gray-600 font-mono">
                                                Sending as {process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'Admin'}
                                            </div>
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={handleSendReply}
                                                disabled={isSending || !replyText.trim()}
                                                className="flex items-center gap-2 px-6 py-2 bg-white text-black font-bold tracking-wider hover:bg-gray-200 transition-colors rounded-sm disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                                            >
                                                {isSending ? (
                                                    <>Sending...</>
                                                ) : (
                                                    <>SEND REPLY <Send className="w-4 h-4" /></>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-500 border border-white/10 rounded-xl border-dashed bg-white/5">
                            <MessageSquare className="w-12 h-12 mb-4 opacity-20" />
                            <p>Select a message to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
