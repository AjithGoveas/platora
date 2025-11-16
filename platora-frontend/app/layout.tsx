import type {Metadata} from "next";
import {Geist, Geist_Mono} from "next/font/google";
import "./globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Toaster from "@/components/Toaster";
import {ThemeProvider} from "next-themes";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Platora — Online Food Delivery",
    description: "Platora — discover local restaurants and get food delivered fast",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
        >
        <ThemeProvider attribute="class" defaultTheme="system">
            <NavBar/>
            <main className="page-max min-h-[70vh] px-4 py-8">
                {children}
            </main>
            <Footer/>
            <Toaster/>
        </ThemeProvider>
        </body>
        </html>
    );
}
