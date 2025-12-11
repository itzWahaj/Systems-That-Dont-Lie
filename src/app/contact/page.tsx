import { Metadata } from "next";
import ContactContent from "@/components/ContactContent";

export const metadata = {
    metadataBase: new URL("https://wahaj.dev"),

    title: "Contact — Muhammad Wahaj Shafiq",
    description: "Reach out for collaboration, hiring, demos or blockchain engineering work.",

    openGraph: {
        title: "Contact — Muhammad Wahaj Shafiq",
        description: "Email, portfolio links, and hiring inquiries.",
        url: "/contact",
        images: ["/og/contact.png"],
        type: "website"
    },

    twitter: {
        card: "summary_large_image",
        title: "Contact — Muhammad Wahaj Shafiq",
        description: "Reach out for engineering collaboration.",
        images: ["/og/contact.png"]
    }
};

export default function ContactPage() {
    return <ContactContent />;
}
