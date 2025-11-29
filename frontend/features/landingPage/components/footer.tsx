import {Separator} from "@/components/ui/separator"
import {APP_CONFIG} from "@/config/app";
import Link from "next/link";
import {NewsletterSection} from "@/features/landingPage/components/newsletter-section";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30 py-12">
            <div className="container mx-auto px-4">
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Link href={'/'}>
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="h-6 w-6 text-primary-foreground"
                                    >
                                        <path
                                            d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/>
                                        <circle cx="7" cy="17" r="2"/>
                                        <circle cx="17" cy="17" r="2"/>
                                    </svg>
                                </div>
                            </Link>
                            <span className="text-xl font-bold">{APP_CONFIG.name}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Elektronická evidencia jázd podľa zákona o DPH pre podnikateľov.
                        </p>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Produkt</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#features" className="text-muted-foreground hover:text-foreground">
                                    Funkcie
                                </a>
                            </li>
                            <li>
                                <a href="#pricing" className="text-muted-foreground hover:text-foreground">
                                    Cenník
                                </a>
                            </li>
                            <li>
                                <a href="#faq" className="text-muted-foreground hover:text-foreground">
                                    FAQ
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="mb-4 font-semibold">Spoločnosť</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    O nás
                                </a>
                            </li>
                            <li>
                                <Link href={'/contact'} className="text-muted-foreground hover:text-foreground">
                                    Kontakt
                                </Link>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground">
                                    Blog
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/*<div>*/}
                    {/*    <h3 className="mb-4 font-semibold">Právne</h3>*/}
                    {/*    <ul className="space-y-2 text-sm">*/}
                    {/*        <li>*/}
                    {/*            <a href="#" className="text-muted-foreground hover:text-foreground">*/}
                    {/*                Podmienky používania*/}
                    {/*            </a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <a href="#" className="text-muted-foreground hover:text-foreground">*/}
                    {/*                Ochrana osobných údajov (GDPR)*/}
                    {/*            </a>*/}
                    {/*        </li>*/}
                    {/*        <li>*/}
                    {/*            <a href="#" className="text-muted-foreground hover:text-foreground">*/}
                    {/*                Cookies*/}
                    {/*            </a>*/}
                    {/*        </li>*/}
                    {/*    </ul>*/}
                    {/*</div>*/}

                    <div>
                        <NewsletterSection variant="compact"/>
                    </div>
                </div>

                <Separator className="my-8"/>

                <div
                    className="flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
                    <p>© {new Date().getFullYear()} {APP_CONFIG.name}. Všetky práva vyhradené.</p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link href="/terms" className="hover:text-foreground transition-colors">
                            Podmienky použitia
                        </Link>
                        <span>•</span>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            GDPR
                        </Link>
                        <span>•</span>
                        <span>Vyrobené s ❤️ na Slovensku</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
