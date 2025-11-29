import {Mail, MapPin, Phone} from "lucide-react"
import {Header} from "@/features/landingPage/components/header";
import {Footer} from "@/features/landingPage/components/footer";
import {ContactForm} from "@/features/landingPage/forms/components/contact-form";
import Link from "next/link";

export const metadata = {
    title: "Kontakt - Kniha jázd",
    description: "Kontaktujte nás pre akékoľvek otázky o aplikácii Kniha jázd",
}

export default function ContactPage() {
    return (
        <>
            <Header/>
            <main className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-bold mb-4 text-balance">Kontaktujte nás</h1>
                            <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
                                Máte otázky alebo potrebujete pomoc? Sme tu pre vás. Napíšte nám a odpovieme čo najskôr.
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {/* Contact Info Cards */}
                            <div className="lg:col-span-1 space-y-6">
                                <div className="bg-card rounded-lg border p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Mail className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Email</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Odpovieme do 24 hodín</p>
                                            <a href="mailto:info@knihajazd.sk"
                                               className="text-sm text-primary hover:underline">
                                                info@knihajazd.sk
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg border p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <Phone className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Telefón</h3>
                                            <p className="text-sm text-muted-foreground mb-2">Po-Pia 9:00 - 17:00</p>
                                            <a href="tel:+421900123456"
                                               className="text-sm text-primary hover:underline">
                                                +421 900 123 456
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-card rounded-lg border p-6">
                                    <div className="flex items-start gap-4">
                                        <div
                                            className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                            <MapPin className="h-6 w-6 text-primary"/>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold mb-1">Adresa</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Hlavná 123
                                                <br/>
                                                811 01 Bratislava
                                                <br/>
                                                Slovensko
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-primary/5 rounded-lg border border-primary/20 p-6">
                                    <h3 className="font-semibold mb-2 text-primary">Rýchla odpoveď</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Väčšinu otázok nájdete v našej{" "}
                                        <Link href={'/#faq'} className="text-primary hover:underline">
                                            FAQ sekcii
                                        </Link>
                                        . Pre technickú podporu použite kontaktný formulár.
                                    </p>
                                </div>
                            </div>

                            {/* Contact Form */}
                            <div className="lg:col-span-2">
                                <div className="bg-card rounded-lg border p-8">
                                    <h2 className="text-2xl font-bold mb-6">Napíšte nám správu</h2>
                                    <ContactForm/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer/>
        </>
    )
}