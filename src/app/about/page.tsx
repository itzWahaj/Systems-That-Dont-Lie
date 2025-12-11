import { Metadata } from "next";
import AboutContent from "@/components/AboutContent";

export const metadata = {
    metadataBase: new URL("https://wahaj.dev"),

    title: "About — Muhammad Wahaj Shafiq",
    description: "Learn about Wahaj's background, skills, education, and engineering philosophy.",

    openGraph: {
        title: "About — Muhammad Wahaj Shafiq",
        description: "Software Engineer focused on trust, transparency, and secure systems.",
        url: "/about",
        images: ["/og/about.png"],
        type: "article"
    },

    twitter: {
        card: "summary_large_image",
        title: "About — Muhammad Wahaj Shafiq",
        description: "Engineering with a focus on security and integrity.",
        images: ["/og/about.png"]
    }
};

export default function AboutPage() {
    return <AboutContent />;
}
