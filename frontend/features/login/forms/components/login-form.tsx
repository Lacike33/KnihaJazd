"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Eye, EyeOff} from "lucide-react"
import Link from "next/link"

export function LoginForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        // Email validation
        if (!formData.email) {
            newErrors.email = "E-mail je povinný"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Neplatný formát e-mailu"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Heslo je povinné"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        // Here you would handle the login logic
        console.log("[v0] Login attempt with:", formData.email)

        setIsSubmitting(false)
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: ""}))
        }
    }

    return (
        <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Vitajte späť</h2>
                    <p className="text-sm text-muted-foreground">Pokračujte tam, kde ste skončili</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="vas@email.sk"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="password">Heslo</Label>
                        <Link href="#" className="text-xs text-primary hover:underline">
                            Zabudli ste heslo?
                        </Link>
                    </div>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Vaše heslo"
                            value={formData.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                            className={errors.password ? "border-destructive pr-10" : "pr-10"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                    </div>
                    {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Prihlasovanie..." : "Prihlásiť sa"}
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t"/>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Alebo</span>
                    </div>
                </div>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Ste partner?{" "}
                        <Link href="/partners/register" className="text-primary font-semibold hover:underline">
                            Registrácia partnera
                        </Link>
                    </p>
                </div>

                <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Ešte nemáte účet?{" "}
                        <Link href="/register" className="text-primary font-semibold hover:underline">
                            Zaregistrovať sa
                        </Link>
                    </p>
                </div>
            </form>
        </Card>
    )
}