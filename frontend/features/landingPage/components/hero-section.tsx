"use client"

import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {ArrowRight, Camera, CheckCircle2} from "lucide-react"
import Link from "next/link";
import { useState } from "react";
import { PdfPreviewModal } from "./pdf-preview-modal";

export function HeroSection() {
    const [showPdfModal, setShowPdfModal] = useState(false);
    return (
        <section className="container mx-auto px-4 py-20 md:py-32">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                <div className="flex flex-col justify-center space-y-8">
                    <Badge className="w-fit" variant="secondary">
                        Pripravené na zákon od roku 2026
                    </Badge>

                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
                            Elektronický denník jázd, ktorý vás chráni
                        </h1>
                        <p className="text-lg text-muted-foreground text-pretty md:text-xl">
                            Inteligentná elektronická evidencia jázd podľa § 85n zákona o DPH. Chráni podnikateľa, stráži
                            povinnosti,
                            odhalí chyby skôr než kontrola.
                        </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 rounded-lg border bg-muted/50 p-4">
                        <div className="flex items-center gap-2">
                            <Camera className="h-5 w-5 text-primary"/>
                            <p className="text-sm font-medium">Po jazde stačí odfotiť tachometer v mobilnej appke.</p>
                        </div>
                        <p className="text-sm text-muted-foreground">My uložíme fotku, prečítame stav a doplníme jazdu
                            za vás.</p>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <Link href={"/dashboard"}>
                            <Button size="lg" className="gap-2">
                                Vyskúšať zadarmo
                                <ArrowRight className="h-4 w-4"/>
                            </Button>
                        </Link>
                        <Button size="lg" variant="outline" onClick={() => setShowPdfModal(true)}>
                            Pozrieť ukážku výkazu
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-4 pt-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary"/>
                            <span className="text-sm text-muted-foreground">Bez GPS krabičiek</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary"/>
                            <span className="text-sm text-muted-foreground">100% DPH bezpečne</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-primary"/>
                            <span className="text-sm text-muted-foreground">Pripravené na kontrolu</span>
                        </div>
                    </div>
                </div>

                <div className="relative">
                    <div className="rounded-2xl border bg-card p-8 shadow-2xl">
                        <div className="space-y-6">
                            {/* Desktop mockup */}
                            <div className="rounded-lg border bg-background p-4">
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="h-3 w-3 rounded-full bg-red-500"/>
                                    <div className="h-3 w-3 rounded-full bg-yellow-500"/>
                                    <div className="h-3 w-3 rounded-full bg-green-500"/>
                                </div>
                                <img src="/electronic-driving-logbook-dashboard-with-trip-ent.jpg"
                                     alt="Dashboard knihy jázd" className="w-full rounded"/>
                            </div>

                            {/* Mobile mockup */}
                            <div className="flex justify-center">
                                <div className="w-48 rounded-3xl border-4 border-foreground/20 bg-background p-2">
                                    <img src="/mobile-app-odometer-photo-capture-screen.jpg" alt="Mobilná aplikácia"
                                         className="w-full rounded-2xl"/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* PDF Preview Modal */}
            <PdfPreviewModal 
                isOpen={showPdfModal} 
                onClose={() => setShowPdfModal(false)} 
            />
        </section>
    )
}
