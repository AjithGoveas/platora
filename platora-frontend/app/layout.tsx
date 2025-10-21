import {Metadata} from "next";
import "./globals.css";
import {Inter} from "next/font/google";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {Toaster} from "@/components/ui/sonner";

const inter = Inter({subsets: ["latin"], variable: "--font-inter"});

export const metadata: Metadata = {
    title: "Platora Delivery",
    description: "Online delivery app built with Next.js, Tailwind, and shadcn/ui",
};

export default function RootLayout({children}: { children: React.ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} antialiased`}>
        <div className="flex min-h-screen flex-col">
            <header>
                <Navbar/>
            </header>

            <main className="flex-1">
                {children}
            </main>

            <footer>
                <Footer/>
            </footer>

            <Toaster position={"top-center"} richColors={true}/>
        </div>
        </body>
        </html>
    );
}
