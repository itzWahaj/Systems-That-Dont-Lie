"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Save, Plus, Trash2, GripVertical, X, Upload } from "lucide-react";
import { motion, Reorder } from "framer-motion";
import { toast } from "sonner";

import { useLoader } from "@/context/LoaderContext";

export default function ProfileManager() {
    const { showLoader, hideLoader } = useLoader();
    const [saving, setSaving] = useState(false);

    // About Page State
    const [aboutData, setAboutData] = useState({
        id: "",
        title: "",
        bio: "",
        image_url: "",
        skills: [] as string[],
        email: "",
        phone: "",
        location: "",
        linkedin_url: "",
        github_url: "",
        resume_url: ""
    });
    const [newSkill, setNewSkill] = useState("");

    // Timeline State
    interface TimelineEvent {
        id: string;
        date_range: string;
        title: string;
        description: string;
        chapter?: string;
        details?: string[];
        order: number;
    }

    const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([]);
    const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
    const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);
    const [eventFormData, setEventFormData] = useState({
        date_range: "",
        title: "",
        description: "",
        chapter: "",
        details: [] as string[]
    });
    const [newDetail, setNewDetail] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            showLoader();

            // Fetch About Data
            const { data: about } = await supabase
                .from('about_page')
                .select('*')
                .single();

            if (about) setAboutData(about);

            // Fetch Timeline Data
            const { data: timeline, error } = await supabase
                .from('timeline_events')
                .select('*')
                .order('order', { ascending: true });

            if (timeline) setTimelineEvents(timeline);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            hideLoader();
        }
    };

    const handleSaveAbout = async () => {
        setSaving(true);
        showLoader();
        try {
            const { error } = await supabase
                .from('about_page')
                .update({
                    title: aboutData.title,
                    bio: aboutData.bio,
                    image_url: aboutData.image_url,
                    skills: aboutData.skills,
                    email: aboutData.email,
                    phone: aboutData.phone,
                    location: aboutData.location,
                    linkedin_url: aboutData.linkedin_url,
                    github_url: aboutData.github_url,
                    resume_url: aboutData.resume_url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', aboutData.id);

            if (error) throw error;
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile.");
        } finally {
            setSaving(false);
            hideLoader();
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim()) {
            setAboutData({
                ...aboutData,
                skills: [...aboutData.skills, newSkill.trim()]
            });
            setNewSkill("");
        }
    };

    const removeSkill = (index: number) => {
        const newSkills = [...aboutData.skills];
        newSkills.splice(index, 1);
        setAboutData({ ...aboutData, skills: newSkills });
    };

    // Timeline Functions
    const openEventModal = (event?: TimelineEvent) => {
        if (event) {
            setEditingEvent(event);
            setEventFormData({
                date_range: event.date_range,
                title: event.title,
                description: event.description,
                chapter: event.chapter || "",
                details: event.details || []
            });
        } else {
            setEditingEvent(null);
            setEventFormData({
                date_range: "",
                title: "",
                description: "",
                chapter: "",
                details: []
            });
        }
        setNewDetail("");
        setIsTimelineModalOpen(true);
    };

    const handleAddDetail = () => {
        if (newDetail.trim()) {
            setEventFormData({
                ...eventFormData,
                details: [...eventFormData.details, newDetail.trim()]
            });
            setNewDetail("");
        }
    };

    const removeDetail = (index: number) => {
        const newDetails = [...eventFormData.details];
        newDetails.splice(index, 1);
        setEventFormData({ ...eventFormData, details: newDetails });
    };

    const handleSaveEvent = async () => {
        showLoader();
        try {
            if (editingEvent) {
                // Update existing
                const { error } = await supabase
                    .from('timeline_events')
                    .update({
                        date_range: eventFormData.date_range,
                        title: eventFormData.title,
                        description: eventFormData.description,
                        chapter: eventFormData.chapter,
                        details: eventFormData.details
                    })
                    .eq('id', editingEvent.id);

                if (error) throw error;
            } else {
                // Create new
                const { error } = await supabase
                    .from('timeline_events')
                    .insert([{
                        date_range: eventFormData.date_range,
                        title: eventFormData.title,
                        description: eventFormData.description,
                        chapter: eventFormData.chapter,
                        details: eventFormData.details,
                        icon: 'Circle', // Default icon
                        order: timelineEvents.length // Append to end
                    }]);

                if (error) throw error;
            }

            setIsTimelineModalOpen(false);
            await fetchData(); // Refresh list (fetchData handles loader too, but we are already showing it. It's fine.)
            toast.success(editingEvent ? "Event updated successfully" : "Event created successfully");
        } catch (error) {
            console.error("Error saving event:", error);
            toast.error("Failed to save event.");
        } finally {
            hideLoader();
        }
    };

    const handleDeleteEvent = async (id: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        showLoader();
        try {
            const { error } = await supabase
                .from('timeline_events')
                .delete()
                .eq('id', id);

            if (error) throw error;
            await fetchData();
            toast.success("Event deleted successfully");
        } catch (error) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event.");
        } finally {
            hideLoader();
        }
    };

    const handleReorder = async (newOrder: TimelineEvent[]) => {
        setTimelineEvents(newOrder);
        showLoader();

        // Update order in DB
        try {
            // Supabase doesn't support bulk update of different values easily without rpc or multiple calls.
            // For small lists, multiple calls are okay.
            for (let i = 0; i < newOrder.length; i++) {
                await supabase
                    .from('timeline_events')
                    .update({ order: i })
                    .eq('id', newOrder[i].id);
            }
            toast.success("Timeline order updated");
        } catch (error) {
            console.error("Error reordering:", error);
            toast.error("Failed to reorder timeline");
        } finally {
            hideLoader();
        }
    };

    return (
        <div className="space-y-12 pb-20">
            <header className="border-b border-white/10 pb-6">
                <h1 className="text-4xl font-serif font-bold text-white tracking-tight">Profile Manager</h1>
                <p className="text-gray-400 mt-2 font-mono text-sm">Manage your bio, skills, and journey timeline.</p>
            </header>

            {/* About Section */}
            <section className="space-y-6 bg-[#0b0b0f] border border-white/10 p-8 rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">About Me</h2>
                    <button
                        onClick={handleSaveAbout}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-accent text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                    >
                        <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Page Title</label>
                            <input
                                type="text"
                                value={aboutData.title}
                                onChange={(e) => setAboutData({ ...aboutData, title: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Bio</label>
                            <textarea
                                rows={6}
                                value={aboutData.bio}
                                onChange={(e) => setAboutData({ ...aboutData, bio: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Profile Image URL</label>
                            <input
                                type="text"
                                value={aboutData.image_url}
                                onChange={(e) => setAboutData({ ...aboutData, image_url: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Email</label>
                                <input
                                    type="email"
                                    value={aboutData.email || ""}
                                    onChange={(e) => setAboutData({ ...aboutData, email: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Phone</label>
                                <input
                                    type="text"
                                    value={aboutData.phone || ""}
                                    onChange={(e) => setAboutData({ ...aboutData, phone: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Location</label>
                            <input
                                type="text"
                                value={aboutData.location || ""}
                                onChange={(e) => setAboutData({ ...aboutData, location: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">LinkedIn URL</label>
                                <input
                                    type="text"
                                    value={aboutData.linkedin_url || ""}
                                    onChange={(e) => setAboutData({ ...aboutData, linkedin_url: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">GitHub URL</label>
                                <input
                                    type="text"
                                    value={aboutData.github_url || ""}
                                    onChange={(e) => setAboutData({ ...aboutData, github_url: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Resume / CV</label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={aboutData.resume_url || ""}
                                    onChange={(e) => setAboutData({ ...aboutData, resume_url: e.target.value })}
                                    placeholder="https://..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                                <div className="relative">
                                    <input
                                        type="file"
                                        onChange={async (e) => {
                                            if (!e.target.files || e.target.files.length === 0) return;

                                            const file = e.target.files[0];
                                            const fileExt = file.name.split('.').pop();
                                            const fileName = `resume-${Date.now()}.${fileExt}`;

                                            // Show loading state if needed, for now just simple alert on error
                                            try {
                                                const { error: uploadError } = await supabase.storage
                                                    .from('media')
                                                    .upload(fileName, file);

                                                if (uploadError) throw uploadError;

                                                const { data: { publicUrl } } = supabase.storage
                                                    .from('media')
                                                    .getPublicUrl(fileName);

                                                setAboutData(prev => ({ ...prev, resume_url: publicUrl }));
                                            } catch (error) {
                                                console.error('Error uploading resume:', error);
                                                alert('Failed to upload resume');
                                            }
                                        }}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        accept=".pdf,.doc,.docx"
                                    />
                                    <button className="h-full px-4 bg-white/10 hover:bg-white/20 text-white rounded flex items-center gap-2 transition-colors">
                                        <Upload className="w-4 h-4" />
                                        Upload
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/10">
                            <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Skills</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                    placeholder="Add a new skill..."
                                    className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                                <button
                                    onClick={handleAddSkill}
                                    className="px-4 bg-white/10 hover:bg-white/20 text-white rounded"
                                >
                                    <Plus className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {aboutData.skills.map((skill, index) => (
                                    <span key={index} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-sm text-gray-300">
                                        {skill}
                                        <button onClick={() => removeSkill(index)} className="hover:text-red-400">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section className="space-y-6 bg-[#0b0b0f] border border-white/10 p-8 rounded-xl">
                <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-white">Timeline Events</h2>
                    <button
                        onClick={() => openEventModal()}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Event
                    </button>
                </div>

                <Reorder.Group axis="y" values={timelineEvents} onReorder={handleReorder} className="space-y-3">
                    {timelineEvents.map((event) => (
                        <Reorder.Item key={event.id} value={event}>
                            <div className="flex items-center gap-4 bg-black/30 border border-white/5 p-4 rounded-lg group hover:border-white/10 transition-colors">
                                <div className="cursor-grab active:cursor-grabbing text-gray-600 hover:text-white">
                                    <GripVertical className="w-5 h-5" />
                                </div>
                                <div className="w-24 font-mono text-accent">{event.date_range}</div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-white">{event.title}</h3>
                                    <p className="text-sm text-gray-500 truncate">{event.description}</p>
                                    {event.chapter && <p className="text-xs text-gray-600 mt-1 font-mono uppercase">{event.chapter}</p>}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => openEventModal(event)} className="p-2 hover:bg-white/10 rounded text-gray-400 hover:text-white">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteEvent(event.id)} className="p-2 hover:bg-red-500/10 rounded text-gray-400 hover:text-red-400">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </Reorder.Item>
                    ))}
                </Reorder.Group>

                {timelineEvents.length === 0 && (
                    <div className="text-center py-12 text-gray-500 border border-dashed border-white/10 rounded-lg">
                        No timeline events found. Add one to get started.
                    </div>
                )}
            </section>

            {/* Event Modal */}
            {isTimelineModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#0b0b0f] border border-white/10 p-8 rounded-xl w-full max-w-lg space-y-6 max-h-[90vh] overflow-y-auto">
                        <h3 className="text-xl font-bold text-white">{editingEvent ? "Edit Event" : "New Event"}</h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Year / Period</label>
                                <input
                                    type="text"
                                    value={eventFormData.date_range}
                                    onChange={(e) => setEventFormData({ ...eventFormData, date_range: e.target.value })}
                                    placeholder="e.g. 2023 - Present"
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Title</label>
                                <input
                                    type="text"
                                    value={eventFormData.title}
                                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                                    placeholder="e.g. Senior Engineer at Google"
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Chapter (Optional)</label>
                                <input
                                    type="text"
                                    value={eventFormData.chapter}
                                    onChange={(e) => setEventFormData({ ...eventFormData, chapter: e.target.value })}
                                    placeholder="e.g. CHAPTER V: THE HORIZON"
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Description</label>
                                <textarea
                                    rows={4}
                                    value={eventFormData.description}
                                    onChange={(e) => setEventFormData({ ...eventFormData, description: e.target.value })}
                                    className="w-full bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Goals / Details (Optional)</label>
                                <div className="flex gap-2 mb-3">
                                    <input
                                        type="text"
                                        value={newDetail}
                                        onChange={(e) => setNewDetail(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddDetail()}
                                        placeholder="Add a goal or detail..."
                                        className="flex-1 bg-black/50 border border-white/10 rounded p-3 text-white focus:border-accent outline-none"
                                    />
                                    <button
                                        onClick={handleAddDetail}
                                        className="px-4 bg-white/10 hover:bg-white/20 text-white rounded"
                                    >
                                        <Plus className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {eventFormData.details.map((detail, index) => (
                                        <div key={index} className="flex items-center justify-between bg-white/5 border border-white/10 p-2 rounded text-sm text-gray-300">
                                            <span>{detail}</span>
                                            <button onClick={() => removeDetail(index)} className="text-gray-500 hover:text-red-400 p-1">
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                            <button
                                onClick={() => setIsTimelineModalOpen(false)}
                                className="px-4 py-2 text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveEvent}
                                className="px-6 py-2 bg-accent text-white rounded hover:bg-red-700 transition-colors"
                            >
                                {editingEvent ? "Update" : "Create"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
