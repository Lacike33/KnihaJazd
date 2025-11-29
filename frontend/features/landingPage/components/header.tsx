"use client";

import {Button} from "@/components/ui/button";
import {TopBar} from "@/features/landingPage/components/top-bar";
import {Menu, X} from "lucide-react";
import Link from "next/link";
import {useState} from "react";
import {APP_CONFIG} from "@/config/app";


export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <>
            <TopBar/>
            <header
                className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                    <div className="flex items-center gap-2">
                        <Link href={'/'}>
                            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
                                     stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                                     className="h-6 w-6 text-primary-foreground">
                                    <path
                                        d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                    <circle cx="7" cy="17" r="2"/>
                                    <circle cx="17" cy="17" r="2"/>
                                </svg>
                            </div>
                        </Link>
                        <span className="text-xl font-bold">{APP_CONFIG.name}</span>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden items-center gap-6 md:flex">
                        <a href="#features" className="text-sm font-medium hover:text-primary transition-colors">
                            Funkcie
                        </a>
                        <a href="#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                            Cenník
                        </a>
                        <a href="/partners" className="text-sm font-medium hover:text-primary transition-colors">
                            Pre partnerov
                        </a>
                        <a href="#faq" className="text-sm font-medium hover:text-primary transition-colors">
                            FAQ
                        </a>
                        {/*<a href="/contact" className="text-sm font-medium hover:text-primary transition-colors">*/}
                        {/*    Kontakt*/}
                        {/*</a>*/}
                        <Link href={"/demo"}>
                            <Button className="w-full">Vyskúšať DEMO</Button>
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                        {mobileMenuOpen ? <X className="h-6 w-6"/> : <Menu className="h-6 w-6"/>}
                    </button>

                    {/* Mobile Menu */}
                    {mobileMenuOpen && (
                        <div className="absolute top-full left-0 right-0 border-t md:hidden bg-background">
                            <div className="container mx-auto space-y-4 px-4 py-6">
                                <a href="#features" className="block text-sm font-medium hover:text-primary">
                                    Funkcie
                                </a>
                                <a href="#pricing" className="block text-sm font-medium hover:text-primary">
                                    Cenník
                                </a>
                                <a href="#partners" className="block text-sm font-medium hover:text-primary">
                                    Pre partnerov
                                </a>
                                <a href="#faq" className="block text-sm font-medium hover:text-primary">
                                    FAQ
                                </a>
                                <Link href={"/dashboard"}>
                                    <Button className="w-full">Vyskúšať zadarmo</Button>
                                </Link>
                            </div>
                        </div>
                    )}
                </nav>
            </header>
        </>
    );
}