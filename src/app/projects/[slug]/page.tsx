import { ArrowLeft, Cpu } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BBVSHero } from "@/components/projects/BBVSHero";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import DiagramReveal from "@/components/DiagramReveal";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = 'force-no-store';

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function ProjectPage({ params }: PageProps) {
    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', params.slug)
        .single();

    if (!project || error) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background text-white selection:bg-accent selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference" data-aos="fade-down">
                <Link href="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors font-mono text-sm uppercase tracking-wider">
                    <ArrowLeft className="w-4 h-4" /> Back to Portfolio
                </Link>
            </nav>

            {/* Hero Section */}
            <BBVSHero
                title={project.title}
                subtitle={project.subtitle}
                demoUrl={project.demo_url}
                repoUrl={project.repo_url}
            />

            {/* Content Grid */}
            <section className="max-w-6xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-12 gap-16">

                {/* Sidebar / Metadata */}
                <div className="lg:col-span-4 space-y-12">
                    <div data-aos="fade-up" data-aos-delay="100">
                        <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Tech Stack</h3>
                        <ul className="space-y-3 font-mono text-sm text-gray-400">
                            {project.tech_stack?.map((tech: string, i: number) => (
                                <li key={i} className="flex items-center gap-2" data-aos="fade-left" data-aos-delay={100 + i * 50}>
                                    <Cpu className="w-4 h-4 text-accent" /> {tech}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {project.innovations && Array.isArray(project.innovations) && (
                        <div data-aos="fade-up" data-aos-delay="200">
                            <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Key Innovations</h3>
                            <ul className="space-y-4">
                                {project.innovations.map((item: any, i: number) => (
                                    <li key={i} className="text-gray-300 text-sm leading-relaxed" data-aos="fade-up" data-aos-delay={200 + i * 100}>
                                        <strong className="text-white block mb-1">{item.title}</strong>
                                        {item.desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.technical_summary && Array.isArray(project.technical_summary) && (
                        <div data-aos="fade-up" data-aos-delay="300">
                            <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Technical Summary</h3>
                            <ul className="space-y-4 font-mono text-sm text-gray-400">
                                {project.technical_summary.map((item: any, i: number) => (
                                    <li key={i} className="flex flex-col gap-1 border-l-2 border-white/10 pl-4">
                                        <span className="text-white font-bold text-xs uppercase tracking-wider">{item.key}</span>
                                        <span className="text-gray-500">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.demo_checklist && Array.isArray(project.demo_checklist) && (
                        <div data-aos="fade-up" data-aos-delay="400" className="p-6 bg-white/5 border border-white/10 rounded-lg">
                            <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Demo Checklist</h3>
                            <ul className="space-y-3">
                                {project.demo_checklist.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 text-accent flex items-center justify-center text-xs font-bold mt-0.5">
                                            {i + 1}
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="lg:col-span-8 space-y-16 prose prose-invert prose-lg max-w-none prose-headings:font-serif prose-headings:text-white prose-p:text-gray-300 prose-a:text-accent prose-code:text-accent prose-pre:bg-black/50 prose-pre:border prose-pre:border-white/10" data-aos="fade-up" data-aos-delay="100">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <div className="mb-6 text-gray-300 leading-relaxed">{children}</div>,
                            img: ({ src, alt }) => {
                                if (!src) return null;
                                return (
                                    <div className="my-8 w-full bg-white/5 p-2 rounded-lg border border-white/10">
                                        <DiagramReveal src={src} alt={alt || "Project Image"} className="w-full rounded-sm" />
                                        {alt && <p className="text-center text-sm text-gray-500 mt-2 font-mono">{alt}</p>}
                                    </div>
                                );
                            }
                        }}
                    >
                        {project.content}
                    </ReactMarkdown>
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="py-24 border-t border-gray-900 text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8" data-aos="fade-up">Ready to see the code?</h2>
                <div className="flex flex-wrap justify-center gap-6" data-aos="fade-up" data-aos-delay="100">
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-accent text-white font-bold tracking-wider hover:bg-red-700 transition-colors rounded-sm"
                        >
                            VIEW LIVE DEMO
                        </a>
                    )}
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-white text-black font-bold tracking-wider hover:bg-gray-200 transition-colors rounded-sm"
                        >
                            GITHUB REPO
                        </a>
                    )}
                    <Link href="/#contact" className="px-8 py-4 border border-gray-700 text-white font-bold tracking-wider hover:bg-white/5 transition-colors rounded-sm">
                        CONTACT ME
                    </Link>
                </div>
            </section>
        </main>
    );
}
