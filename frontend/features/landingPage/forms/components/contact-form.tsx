"use client"

import type React from "react"

import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {useState} from "react"
import {Send} from "lucide-react"

export function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subjectType: "",
        customSubject: "",
        message: "",
        sendCopy: false,
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSuccess(true)

        // Reset form after success
        setTimeout(() => {
            setFormData({
                name: "",
                email: "",
                subjectType: "",
                customSubject: "",
                message: "",
                sendCopy: false,
            })
            setIsSuccess(false)
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    const handleSelectChange = (value: string) => {
        setFormData((prev) => ({
            ...prev,
            subjectType: value,
            // Clear custom subject if switching away from "other"
            customSubject: value !== "other" ? "" : prev.customSubject,
        }))
    }

    const handleCheckboxChange = (checked: boolean) => {
        setFormData((prev) => ({
            ...prev,
            sendCopy: checked,
        }))
    }

    if (isSuccess) {
        return (
            <div className="py-12 text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 mb-4">
                    <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
                    </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Správa bola odoslaná!</h3>
                <p className="text-muted-foreground">
                    Ďakujeme za vašu správu. Odpovieme vám čo najskôr.
                    {formData.sendCopy && " Kópia správy bola odoslaná na váš email."}
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        Meno a priezvisko <span className="text-destructive">*</span>
                    </Label>
                    <Input id="name" name="name" placeholder="Ján Novák" value={formData.name} onChange={handleChange}
                           required/>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">
                        Email <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="jan.novak@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="subjectType">
                    Predmet <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.subjectType} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                        <SelectValue placeholder="Vyberte typ dotazu"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="technical">Technická podpora</SelectItem>
                        <SelectItem value="pricing">Otázka ohľadom cenníka</SelectItem>
                        <SelectItem value="partnership">Partnerstvo</SelectItem>
                        <SelectItem value="billing">Fakturácia a platby</SelectItem>
                        <SelectItem value="feature">Nová funkcia / Návrh</SelectItem>
                        <SelectItem value="bug">Nahlásenie chyby</SelectItem>
                        <SelectItem value="other">Iné</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {formData.subjectType === "other" && (
                <div className="space-y-2">
                    <Label htmlFor="customSubject">
                        Vlastný predmet <span className="text-destructive">*</span>
                    </Label>
                    <Input
                        id="customSubject"
                        name="customSubject"
                        placeholder="Zadajte vlastný predmet správy"
                        value={formData.customSubject}
                        onChange={handleChange}
                        required
                    />
                </div>
            )}

            <div className="space-y-2">
                <Label htmlFor="message">
                    Správa <span className="text-destructive">*</span>
                </Label>
                <Textarea
                    id="message"
                    name="message"
                    placeholder="Napíšte vašu správu..."
                    className="min-h-[150px] resize-none"
                    value={formData.message}
                    onChange={handleChange}
                    required
                />
                <p className="text-xs text-muted-foreground">Minimálne 10 znakov</p>
            </div>

            <div className="flex items-center space-x-2">
                <Checkbox id="sendCopy" checked={formData.sendCopy} onCheckedChange={handleCheckboxChange}/>
                <Label htmlFor="sendCopy" className="text-sm font-normal cursor-pointer">
                    Zaslať kópiu správy na môj email
                </Label>
            </div>

            <Button type="submit" size="lg" className="w-full md:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <span className="animate-spin mr-2">⏳</span>
                        Odosielam...
                    </>
                ) : (
                    <>
                        <Send className="mr-2 h-4 w-4"/>
                        Odoslať správu
                    </>
                )}
            </Button>

            <p className="text-xs text-muted-foreground">
                Odoslaním formulára súhlasíte so spracovaním osobných údajov podľa{" "}
                <a href="#" className="text-primary hover:underline">
                    GDPR
                </a>
                .
            </p>
        </form>
    )
}
