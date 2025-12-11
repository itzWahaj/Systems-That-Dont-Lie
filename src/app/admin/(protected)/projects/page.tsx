"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    Plus,
    Search,
    Filter,
    FolderKanban,
    Eye,
    Github,
    Globe,
    Trash2,
    CheckCircle,
    XCircle
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Project {
    id: string;
    title: string;
    subtitle: string;
    tech_stack: string[];
    published: boolean;
    created_at: string;
    demo_url?: string;
    repo_url?: string;
}

import { useLoader } from "@/context/LoaderContext";

export default function ProjectsManager() {
    const { showLoader, hideLoader } = useLoader();
    const [searchTerm, setSearchTerm] = useState("");
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        showLoader();
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) {
            setProjects(data);
        }
        setIsLoading(false);
        hideLoader();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this project?")) {
            showLoader();
            const { error } = await supabase
                .from('projects')
                .delete()
                .eq('id', id);

            if (!error) {
                setProjects(projects.filter(p => p.id !== id));
            } else {
                alert("Error deleting project: " + error.message);
            }
            hideLoader();
        }
    };

    const handleTogglePublish = async (project: Project) => {
        showLoader();
        const { error } = await supabase
            .from('projects')
            .update({ published: !project.published })
            .eq('id', project.id);

        if (!error) {
            setProjects(projects.map(p =>
                p.id === project.id ? { ...p, published: !p.published } : p
            ));
        } else {
            alert("Error updating project: " + error.message);
        }
        hideLoader();
    };

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.subtitle?.toLowerCase().includes(searchTerm.toLowerCase())
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
                    <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Projects Manager</h1>
                    <p className="text-gray-400 mt-2 font-mono text-sm">Manage Portfolio Projects</p>
                </div>
                <Link href="/admin/projects/new">
                    <button className="flex items-center gap-2 px-6 py-3 bg-accent text-white font-bold rounded-lg hover:bg-red-700 transition-all text-sm shadow-[0_0_20px_rgba(199,58,49,0.3)] hover:shadow-[0_0_25px_rgba(199,58,49,0.5)] hover:scale-105">
                        <Plus className="w-4 h-4" /> ADD PROJECT
                    </button>
                </Link>
            </header>

            {/* Toolbar */}
            <div className="flex gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-gray-600 focus:border-accent focus:outline-none transition-all text-sm focus:ring-1 focus:ring-accent/50"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 text-gray-400 font-medium rounded-lg hover:text-white hover:border-white/30 transition-colors text-sm">
                    <Filter className="w-4 h-4" /> Filter
                </button>
            </div>

            {/* Projects Table */}
            <div className="bg-[#0b0b0f]/80 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10 bg-white/5 text-xs font-mono text-gray-400 uppercase tracking-wider">
                            <th className="p-6 font-medium">Project</th>
                            <th className="p-6 font-medium">Tech Stack</th>
                            <th className="p-6 font-medium">Links</th>
                            <th className="p-6 font-medium">Status</th>
                            <th className="p-6 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">Loading projects...</td>
                            </tr>
                        ) : filteredProjects.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-12 text-center text-gray-500 font-mono">No projects found.</td>
                            </tr>
                        ) : (
                            filteredProjects.map((project) => (
                                <motion.tr
                                    key={project.id}
                                    variants={item}
                                    className="group hover:bg-white/5 transition-colors"
                                >
                                    <td className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/5 rounded-lg text-gray-400 group-hover:text-white group-hover:bg-white/10 transition-all">
                                                <FolderKanban className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-base font-bold text-white group-hover:text-accent transition-colors">{project.title}</p>
                                                </div>
                                                <p className="text-sm text-gray-500 line-clamp-1 max-w-[250px] mt-1">{project.subtitle}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                                            {project.tech_stack?.slice(0, 3).map((tech, i) => (
                                                <span key={i} className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-gray-400 border border-white/10 group-hover:border-white/20 transition-colors">
                                                    {tech}
                                                </span>
                                            ))}
                                            {project.tech_stack?.length > 3 && (
                                                <span className="text-[10px] text-gray-500 px-1 py-1">+{project.tech_stack.length - 3}</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-3">
                                            {project.repo_url && (
                                                <a href={project.repo_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                                                    <Github className="w-4 h-4" />
                                                </a>
                                            )}
                                            {project.demo_url && (
                                                <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded">
                                                    <Globe className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-6">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-2 h-2 rounded-full ${project.published ? 'bg-green-500 shadow-[0_0_10px_rgba(74,222,128,0.5)]' : 'bg-yellow-500'}`} />
                                            <span className={`text-xs font-medium font-mono uppercase ${project.published ? 'text-green-500' : 'text-yellow-500'}`}>
                                                {project.published ? 'Published' : 'Draft'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-6 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => handleTogglePublish(project)}
                                                className={`p-2 rounded-lg transition-colors border border-transparent hover:border-white/10 ${project.published ? 'text-green-500 hover:bg-green-500/10' : 'text-yellow-500 hover:bg-yellow-500/10'}`}
                                                title={project.published ? "Unpublish" : "Publish"}
                                            >
                                                {project.published ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                            </button>
                                            <Link href={`/admin/projects/edit/${project.id}`}>
                                                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors border border-transparent hover:border-white/10" title="Edit">
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(project.id)}
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
        </motion.div>
    );
}
