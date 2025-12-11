import fs from "fs";
import path from "path";
import matter from "gray-matter";

const projectsDirectory = path.join(process.cwd(), "src/content/projects");

export interface Project {
    slug: string;
    frontmatter: {
        title?: string;
        subtitle?: string;
        thumbnail?: string;
        [key: string]: any;
    };
    content: string;
}

export function getProjectBySlug(slug: string): Project {
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    return {
        slug,
        frontmatter: data,
        content,
    };
}

export function getAllProjects(): Project[] {
    const slugs = fs.readdirSync(projectsDirectory);
    const projects = slugs.map((slug) => getProjectBySlug(slug.replace(/\.mdx$/, "")));
    return projects;
}
