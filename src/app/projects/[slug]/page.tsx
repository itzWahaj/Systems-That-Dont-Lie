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
        <main className="min-h-screen bg-background text-main selection:bg-accent selection:text-white">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 w-full p-6 z-50 mix-blend-difference" data-aos="fade-down">
                <Link href="/" className="flex items-center gap-2 text-main hover:text-accent transition-colors font-mono text-sm uppercase tracking-wider">
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
                        <ul className="space-y-3 font-mono text-sm text-muted">
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
                                    <li key={i} className="text-muted text-sm leading-relaxed" data-aos="fade-up" data-aos-delay={200 + i * 100}>
                                        <strong className="text-main block mb-1">{item.title}</strong>
                                        {item.desc}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.technical_summary && Array.isArray(project.technical_summary) && (
                        <div data-aos="fade-up" data-aos-delay="300">
                            <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Technical Summary</h3>
                            <ul className="space-y-4 font-mono text-sm text-muted">
                                {project.technical_summary.map((item: any, i: number) => (
                                    <li key={i} className="flex flex-col gap-1 border-l-2 border-border pl-4">
                                        <span className="text-main font-bold text-xs uppercase tracking-wider">{item.key}</span>
                                        <span className="text-muted">{item.value}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {project.demo_checklist && Array.isArray(project.demo_checklist) && (
                        <div data-aos="fade-up" data-aos-delay="400" className="p-6 bg-surface border border-border rounded-lg">
                            <h3 className="text-secondary font-mono text-sm tracking-widest uppercase mb-4">Demo Checklist</h3>
                            <ul className="space-y-3">
                                {project.demo_checklist.map((item: string, i: number) => (
                                    <li key={i} className="flex items-start gap-3 text-sm text-muted">
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
                <div className="lg:col-span-8 space-y-16 prose prose-lg max-w-none prose-headings:font-serif prose-headings:text-main prose-p:text-muted prose-strong:text-main prose-a:text-accent prose-code:text-accent prose-pre:bg-surface prose-pre:border prose-pre:border-border" data-aos="fade-up" data-aos-delay="100">
                    <ReactMarkdown
                        components={{
                            p: ({ children }) => <div className="mb-6 text-muted leading-relaxed">{children}</div>,
                            img: ({ src, alt }) => {
                                if (!src) return null;
                                return (
                                    <div className="my-8 w-full bg-surface p-2 rounded-lg border border-border">
                                        <DiagramReveal src={src} alt={alt || "Project Image"} className="w-full rounded-sm" />
                                        {alt && <p className="text-center text-sm text-muted mt-2 font-mono">{alt}</p>}
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
            <section className="py-24 border-t border-border text-center">
                <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8" data-aos="fade-up">Ready to see the code?</h2>
                <div className="flex flex-wrap justify-center gap-6" data-aos="fade-up" data-aos-delay="100">
                    {project.demo_url && (
                        <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-accent text-white font-bold tracking-wider hover:bg-accent/80 shadow-[0_0_20px_rgba(139,30,30,0.3)] hover:shadow-[0_0_30px_rgba(139,30,30,0.5)] transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                        >
                            VIEW LIVE DEMO
                        </a>
                    )}
                    {project.repo_url && (
                        <a
                            href={project.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-main text-background font-bold tracking-wider hover:bg-main/80 shadow-[0_0_20px_rgba(0,0,0,0.1)] hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] transition-all duration-300 rounded-sm hover:scale-105 active:scale-95"
                        >
                            GITHUB REPO
                        </a>
                    )}
                    <Link href="/#contact" className="px-8 py-4 border border-border text-main font-bold tracking-wider hover:bg-surface/50 hover:border-accent/50 transition-all duration-300 rounded-sm hover:scale-105 active:scale-95">
                        CONTACT ME
                    </Link>
                </div>
            </section>
        </main>
    );
}
