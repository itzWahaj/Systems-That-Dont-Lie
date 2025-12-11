"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ProjectEditor from "@/components/admin/ProjectEditor";

export default function EditProjectPage() {
    const params = useParams();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProject = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setProject(data);
            } else if (error) {
                console.error("Error fetching project:", error);
            }
            setLoading(false);
        };

        fetchProject();
    }, [params.id]);

    if (loading) return <div className="p-12 text-center text-gray-500 font-mono animate-pulse">Loading project...</div>;
    if (!project) return <div className="p-12 text-center text-red-500 font-mono">Project not found.</div>;

    return <ProjectEditor initialData={project} />;
}
