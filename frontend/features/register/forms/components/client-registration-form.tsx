"use client"

import type React from "react"

import {useState} from "react"
import {Button} from "@/components/ui/button"
import {Card} from "@/components/ui/card"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Eye, EyeOff, CheckCircle2} from "lucide-react"
import Link from "next/link"

export function ClientRegistrationForm() {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        confirmPassword: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

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
        } else if (formData.password.length < 8) {
            newErrors.password = "Heslo musí mať aspoň 8 znakov"
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Potvrdenie hesla je povinné"
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Heslá sa nezhodujú"
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

        setIsSubmitting(false)
        setIsSuccess(true)
    }

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({...prev, [field]: value}))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({...prev, [field]: ""}))
        }
    }

    if (isSuccess) {
        return (
            <Card className="p-8 text-center space-y-6">
                <div className="flex justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <CheckCircle2 className="h-8 w-8 text-primary"/>
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Registrácia úspešná!</h3>
                    <p className="text-muted-foreground">
                        Poslali sme vám potvrdzovací e-mail na adresu <strong>{formData.email}</strong>
                    </p>
                </div>
                <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                        Kliknite na odkaz v e-maile na dokončenie registrácie a získanie prístupu k vašej Knihe jázd.
                    </p>
                    <Button className="w-full" asChild>
                        <Link href="/login">Prihlásiť sa</Link>
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <h2 className="text-2xl font-bold">Vytvoriť účet</h2>
                    <p className="text-sm text-muted-foreground">Začnite evidovať jazdy jednoducho a bezpečne</p>
                </div>

                {/* Email */}
                <div className="space-y-2">
                    <Label htmlFor="email">
                        E-mail <span className="text-destructive">*</span>
                    </Label>
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
                    <Label htmlFor="password">
                        Heslo <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Minimálne 8 znakov"
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
                    <p className="text-xs text-muted-foreground">Heslo musí obsahovať minimálne 8 znakov</p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-2">
                    <Label htmlFor="confirmPassword">
                        Potvrdenie hesla <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                        <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Zopakujte heslo"
                            value={formData.confirmPassword}
                            onChange={(e) => handleChange("confirmPassword", e.target.value)}
                            className={errors.confirmPassword ? "border-destructive pr-10" : "pr-10"}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Vytváram účet..." : "Vytvoriť účet"}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                    Kliknutím na tlačidlo súhlasíte s našimi{" "}
                    <Link href="#" className="text-primary hover:underline">
                        podmienkami používania
                    </Link>{" "}
                    a{" "}
                    <Link href="#" className="text-primary hover:underline">
                        zásadami ochrany osobných údajov
                    </Link>
                </p>

                <div className="text-center pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                        Už máte účet?{" "}
                        <Link href="/login" className="text-primary font-semibold hover:underline">
                            Prihlásiť sa
                        </Link>
                    </p>
                </div>
            </form>
        </Card>
    )
}