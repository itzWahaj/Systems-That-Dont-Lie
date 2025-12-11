import { getAllProjects } from "@/lib/projects";
import ProjectsContent from "@/components/ProjectsContent";

export const metadata = {
    metadataBase: new URL("https://wahaj.dev"),

    title: "Projects — Muhammad Wahaj Shafiq",
    description: "A collection of engineering work: Blockchain, Biometrics, Frontend systems.",

    openGraph: {
        title: "Projects — Muhammad Wahaj Shafiq",
        description: "Blockchain • Authentication • Frontend Systems",
        url: "/projects",
        images: ["/og/projects.png"],
        type: "website"
    },

    twitter: {
        card: "summary_large_image",
        title: "Projects — Muhammad Wahaj Shafiq",
        description: "Blockchain • Biometrics • Smart Contracts",
        images: ["/og/projects.png"]
    }
};

export default function ProjectsPage() {
    const projects = getAllProjects();

    return <ProjectsContent projects={projects} />;
}
