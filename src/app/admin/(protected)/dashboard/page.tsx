"use client";

import { useEffect, useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import { useTransitionRouter } from "@/hooks/useTransitionRouter";
import { motion } from "framer-motion";
import {
    Users,
    FileText,
    Eye,
    TrendingUp,
    Clock,
    Activity,
    Edit3,
    CheckCircle,
    FolderKanban,
    Image as ImageIcon
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
    const router = useTransitionRouter();
    const [stats, setStats] = useState({
        scrolls: 0,
        projects: 0,
        media: 0,
        messages: 0
    });
    const [recentActivity, setRecentActivity] = useState<any[]>([]);
    const [systemHealth, setSystemHealth] = useState({
        dbStatus: 'Checking...',
        storageUsed: 0,
        storageLimit: 100 * 1024 * 1024, // 100MB Limit for portfolio
        isDbHealthy: false
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch counts
                const { count: scrollsCount, error: scrollsError } = await supabase
                    .from('scrolls')
                    .select('*', { count: 'exact', head: true });

                const { count: projectsCount } = await supabase
                    .from('projects')
                    .select('*', { count: 'exact', head: true });

                const { data: mediaFiles, error: mediaError } = await supabase
                    .storage
                    .from('media')
                    .list();

                const { count: messagesCount } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true });

                // Fetch recent items
                const { data: recentScrolls } = await supabase
                    .from('scrolls')
                    .select('title, created_at, published')
                    .order('created_at', { ascending: false })
                    .limit(5);

                const { data: recentProjects } = await supabase
                    .from('projects')
                    .select('title, created_at, published')
                    .order('created_at', { ascending: false })
                    .limit(5);

                const { data: recentMessages } = await supabase
                    .from('messages')
                    .select('name, type, created_at')
                    .order('created_at', { ascending: false })
                    .limit(5);

                // Combine and sort recent activity
                const combinedActivity = [
                    ...(recentScrolls?.map(s => ({ ...s, type: 'scroll' })) || []),
                    ...(recentProjects?.map(p => ({ ...p, type: 'project' })) || []),
                    ...(recentMessages?.map(m => ({ ...m, title: `Message from ${m.name}`, type: 'message' })) || [])
                ].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                    .slice(0, 5);

                setStats({
                    scrolls: scrollsCount || 0,
                    projects: projectsCount || 0,
                    media: mediaFiles?.length || 0,
                    messages: messagesCount || 0
                });

                setRecentActivity(combinedActivity);

                // Calculate System Health
                const totalBytes = mediaFiles?.reduce((acc, file) => acc + (file.metadata?.size || 0), 0) || 0;

                // Fetch bucket info for real limit
                const { data: bucketInfo } = await supabase
                    .storage
                    .getBucket('media');

                // Use bucket limit if available, otherwise default to 500MB (Supabase Free Tier)
                const realLimit = bucketInfo?.file_size_limit || 500 * 1024 * 1024;

                setSystemHealth({
                    dbStatus: !scrollsError ? 'Healthy' : 'Unstable',
                    isDbHealthy: !scrollsError,
                    storageUsed: totalBytes,
                    storageLimit: realLimit
                });

            } catch (error) {
                console.error("System check failed:", error);
                setSystemHealth(prev => ({ ...prev, dbStatus: 'Error', isDbHealthy: false }));
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Scrolls", value: stats.scrolls, change: "Live", icon: FileText, color: "text-accent", bg: "bg-accent/10", border: "border-accent/20", href: "/admin/content" },
        { label: "Active Projects", value: stats.projects, change: "Live", icon: FolderKanban, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20", href: "/admin/projects" },
        { label: "Media Files", value: stats.media, change: "Storage", icon: ImageIcon, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20", href: "/admin/media" },
        { label: "Messages", value: stats.messages, change: "Inbox", icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20", href: "/admin/messages" },
    ];

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

    // Helper to format bytes
    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    const storagePercentage = Math.min(100, Math.round((systemHealth.storageUsed / systemHealth.storageLimit) * 100));

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <header className="flex justify-between items-end border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Command Center</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">System Overview & Metrics</p>
                </div>
                <div className="flex items-center gap-3 text-sm font-mono text-green-400 bg-green-400/5 px-4 py-2 rounded-full border border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    SYSTEM ONLINE
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        variants={item}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        onClick={() => router.push(stat.href)}
                        className={`relative overflow-hidden bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 p-6 rounded-xl group hover:border-white/20 transition-colors cursor-pointer`}
                    >
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/5 to-transparent rounded-bl-full -mr-16 -mt-16 transition-opacity opacity-50 group-hover:opacity-100`} />

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border}`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <span className="text-xs font-mono text-green-400 bg-green-400/10 px-2 py-1 rounded border border-green-400/20">
                                {stat.change}
                            </span>
                        </div>
                        <h3 className="text-3xl font-bold text-white mb-1 relative z-10">{stat.value}</h3>
                        <p className="text-sm text-gray-500 font-medium relative z-10">{stat.label}</p>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <motion.div variants={item} className="lg:col-span-2 bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <Activity className="w-5 h-5 text-accent" /> Recent Activity
                        </h3>
                        <button className="text-xs font-mono text-gray-400 hover:text-white transition-colors border border-white/10 px-3 py-1 rounded hover:bg-white/5">VIEW LOG</button>
                    </div>
                    <div className="divide-y divide-white/5">
                        {recentActivity.length === 0 ? (
                            <div className="p-12 text-center text-gray-500 text-sm font-mono">
                                <Activity className="w-8 h-8 mx-auto mb-3 opacity-20" />
                                No recent activity found via sensors.
                            </div>
                        ) : (
                            recentActivity.map((item, index) => (
                                <div key={index} className="p-4 flex items-center gap-4 hover:bg-white/5 transition-colors group">
                                    <div className="p-2 bg-white/5 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                                        {item.type === 'scroll' ? <FileText className="w-4 h-4" /> : item.type === 'project' ? <FolderKanban className="w-4 h-4" /> : <Users className="w-4 h-4" />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm text-white font-medium group-hover:text-accent transition-colors">
                                            {item.type === 'message' ? 'New Message' : item.published ? "Published" : "Drafted"}: {item.title}
                                        </p>
                                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                                            {new Date(item.created_at).toLocaleDateString()} • {new Date(item.created_at).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-gray-500 font-mono uppercase border border-white/10 px-2 py-1 rounded bg-black/20">
                                            {item.type === 'scroll' ? 'SCROLL' : item.type === 'project' ? 'PROJECT' : 'MESSAGE'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Quick Actions */}
                <motion.div variants={item} className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl p-6 space-y-8 h-fit">
                    <div>
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-accent" /> Quick Actions
                        </h3>
                        <div className="space-y-3">
                            <TransitionLink href="/admin/content/new" className="group w-full py-3 px-4 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-all text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:scale-[1.02]">
                                <Edit3 className="w-4 h-4 group-hover:rotate-12 transition-transform" /> NEW SCROLL
                            </TransitionLink>
                            <TransitionLink href="/admin/media" className="group w-full py-3 px-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02]">
                                <FolderKanban className="w-4 h-4 group-hover:text-blue-400 transition-colors" /> UPLOAD MEDIA
                            </TransitionLink>
                            <TransitionLink href="/admin/projects" className="group w-full py-3 px-4 border border-white/10 text-white font-bold rounded-lg hover:bg-white/5 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.02]">
                                <Activity className="w-4 h-4 group-hover:text-green-400 transition-colors" /> MANAGE PROJECTS
                            </TransitionLink>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/10">
                        <h4 className="text-xs font-mono text-gray-500 uppercase mb-4 tracking-wider">System Status</h4>
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-mono">
                                    <span className="text-gray-400">Database Connection</span>
                                    <span className={`flex items-center gap-1 ${systemHealth.isDbHealthy ? 'text-green-400' : 'text-red-400'}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${systemHealth.isDbHealthy ? 'bg-green-500' : 'bg-red-500'}`} />
                                        {systemHealth.dbStatus}
                                    </span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: systemHealth.isDbHealthy ? "100%" : "0%" }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full w-full rounded-full bg-gradient-to-r ${systemHealth.isDbHealthy ? 'from-green-500 to-green-400' : 'from-red-500 to-red-400'}`}
                                    />
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs mb-2 font-mono">
                                    <span className="text-gray-400">Storage Usage</span>
                                    <span className="text-yellow-400">{formatBytes(systemHealth.storageUsed)} Used</span>
                                </div>
                                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${storagePercentage}%` }}
                                        transition={{ duration: 1, delay: 0.7 }}
                                        className="h-full bg-gradient-to-r from-yellow-500 to-yellow-400 rounded-full"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-600 font-mono mt-1 text-right">
                                    {storagePercentage}% of {formatBytes(systemHealth.storageLimit)}
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    );
}
