import { getAllProjects as getAllProjectsFromMDX, Project } from "./mdx";

export type { Project };

export function getAllProjects() {
    return getAllProjectsFromMDX();
}

