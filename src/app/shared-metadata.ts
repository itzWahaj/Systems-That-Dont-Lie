import { Metadata } from "next";

export const sharedMetadata: Metadata = {
    metadataBase: new URL("https://wahaj.dev"), // Replace with actual domain later
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://wahaj.dev",
        siteName: "Wahaj Portfolio",
        images: [
            {
                url: "/og/main.png",
                width: 1200,
                height: 630,
                alt: "Wahaj - Blockchain Engineer",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Wahaj | Systems That Don't Break",
        creator: "@wahaj", // Replace with actual handle
    },
    robots: {
        index: true,
        follow: true,
    },
};
