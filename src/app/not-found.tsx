import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background text-white p-6 text-center">
            <h2 className="text-6xl font-serif font-bold text-accent mb-4">404</h2>
            <p className="text-xl text-gray-400 mb-8">This page has been lost in the chain.</p>
            <Link
                href="/"
                className="px-8 py-3 bg-surface border border-gray-700 hover:border-accent transition-colors"
            >
                Return Home
            </Link>
        </div>
    );
}
