"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ScrollEditor from "@/components/admin/ScrollEditor";

export default function EditScrollPage() {
    const params = useParams();
    const [scroll, setScroll] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchScroll = async () => {
            if (!params.id) return;

            const { data, error } = await supabase
                .from('scrolls')
                .select('*')
                .eq('id', params.id)
                .single();

            if (data) {
                setScroll(data);
            } else if (error) {
                console.error("Error fetching scroll:", error);
            }
            setLoading(false);
        };

        fetchScroll();
    }, [params.id]);

    if (loading) return <div className="p-12 text-center text-gray-500 font-mono animate-pulse">Loading scroll...</div>;
    if (!scroll) return <div className="p-12 text-center text-red-500 font-mono">Scroll not found.</div>;

    return <ScrollEditor initialData={scroll} />;
}
