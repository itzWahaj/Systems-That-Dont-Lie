import type { Metadata } from "next";
import { Cinzel, Inter, Source_Code_Pro } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { sharedMetadata } from "./shared-metadata";
import Providers from "@/components/Providers";
import Header from "@/components/Header";
import SplashScreen from "@/components/SplashScreen";

import CustomCursor from "@/components/CustomCursor";

const cinzel = Cinzel({
    subsets: ["latin"],
    variable: "--font-cinzel",
    display: "swap",
});

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap",
});

const sourceCodePro = Source_Code_Pro({
    subsets: ["latin"],
    variable: "--font-source-code",
    display: "swap",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://wahaj.dev"),

    title: "Wahaj — Systems That Don’t Lie",
    description: "Software Engineer specializing in Blockchain, Biometrics, and secure Frontend systems.",

    icons: {
        icon: "/assets/favicon.ico",
    },

    openGraph: {
        title: "Wahaj — Systems That Don’t Lie",
        description: "Blockchain • WebAuthn Biometrics • Smart Contracts • Frontend Engineering",
        url: "/",
        images: ["/og/home.png"],
        type: "website"
    },

    twitter: {
        card: "summary_large_image",
        title: "Wahaj — Systems That Don’t Lie",
        description: "Blockchain • Biometrics • Secure Systems",
        images: ["/og/home.png"]
    }
};

import { Toaster } from "sonner";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="scroll-smooth">
            <body
                suppressHydrationWarning
                className={cn(
                    inter.variable,
                    cinzel.variable,
                    sourceCodePro.variable,
                    "bg-background text-white font-sans antialiased selection:bg-accent selection:text-white"
                )}>
                <Providers>
                    <CustomCursor />
                    <SplashScreen />
                    <div className="grain-overlay" />
                    <Header />
                    <main className="relative z-10">
                        {children}
                    </main>
                    <Toaster position="top-center" theme="dark" />
                </Providers>
            </body>
        </html>
    );
}
