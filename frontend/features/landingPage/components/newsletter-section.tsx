"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Mail} from "lucide-react"

interface NewsletterSectionProps {
    variant?: "full" | "compact"
    className?: string
}

export function NewsletterSection({variant = "full", className = ""}: NewsletterSectionProps) {
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setIsSubmitted(true)
        setEmail("")
        setIsLoading(false)

        // Reset success message after 5 seconds
        setTimeout(() => {
            setIsSubmitted(false)
        }, 5000)
    }

    if (variant === "compact") {
        return (
            <div className={className}>
                <h3 className="mb-4 font-semibold">Newsletter</h3>
                {isSubmitted ? (
                    <div
                        className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-sm text-primary">Ďakujeme!</div>
                ) : (
                    <div className="space-y-3">
                        <p className="text-sm text-muted-foreground">Zostaňte v obraze o novinkách a zmenách.</p>
                        <form onSubmit={handleSubmit} className="space-y-2">
                            <Input
                                type="email"
                                placeholder="váš@email.sk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="w-full"
                            />
                            <Button type="submit" size="sm" disabled={isLoading} className="w-full">
                                {isLoading ? "..." : "Prihlásiť"}
                            </Button>
                        </form>
                    </div>
                )}
            </div>
        )
    }

    return (
        <section id="newsletter" className={`py-20 ${className}`}>
            <div className="container mx-auto px-4">
                <div
                    className="mx-auto max-w-3xl rounded-2xl border bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 p-8 text-center shadow-lg md:p-12">
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <Mail className="h-8 w-8 text-primary"/>
                    </div>

                    <h2 className="mb-4 text-balance text-3xl font-bold md:text-4xl">Zostaňte v obraze</h2>

                    <p className="mb-8 text-pretty text-lg text-muted-foreground">
                        Prihlás sa na odber newslettera a získaj najnovšie informácie o zmenách v legislatíve,
                        aktualizáciách
                        aplikácie a praktických tipoch pre vedenie knihy jázd.
                    </p>

                    {isSubmitted ? (
                        <div
                            className="mx-auto max-w-md rounded-lg border border-primary/20 bg-primary/10 p-6 text-primary">
                            <div className="mb-2 text-xl font-semibold">Ďakujeme za prihlásenie!</div>
                            <p className="text-sm">Potvrdzovací email bol odoslaný na vašu adresu.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="mx-auto flex max-w-md flex-col gap-3 sm:flex-row">
                            <Input
                                type="email"
                                placeholder="váš@email.sk"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoading}
                                className="flex-1 text-base"
                            />
                            <Button type="submit" size="lg" disabled={isLoading} className="sm:w-auto">
                                {isLoading ? "Odosielam..." : "Prihlásiť sa"}
                            </Button>
                        </form>
                    )}

                    <p className="mt-6 text-sm text-muted-foreground">Žiadny spam, kedykoľvek sa môžete odhlásiť.</p>
                </div>
            </div>
        </section>
    )
}
