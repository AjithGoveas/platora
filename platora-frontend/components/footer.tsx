import Link from "next/link";

export default function Footer() {
    return (
        <footer className="border-t">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-4 px-4 py-6 text-sm">
                {/* Left side */}
                <p className="text-muted-foreground">
                    © {new Date().getFullYear()} <span className="font-bold">Platora</span>. All rights reserved.
                </p>

                {/* Right side */}
                <nav className="flex gap-4 text-muted-foreground">
                    <Link href="/about" className="hover:text-foreground">
                        About
                    </Link>
                    <Link href="/contact" className="hover:text-foreground">
                        Contact
                    </Link>
                    <Link href="/terms" className="hover:text-foreground">
                        Terms
                    </Link>
                </nav>
            </div>
        </footer>
    );
}
