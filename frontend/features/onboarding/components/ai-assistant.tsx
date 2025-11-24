"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Sparkles } from "lucide-react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickQuestions = [
  "Ako mám evidovať jazdy kvôli 100% DPH?",
  "Ako vygenerujem výkaz pre Finančnú správu?",
  "Ako funguje autogenerovanie jázd?",
  "Čo je to šablóna jazdy?",
  "Ako pridám nové vozidlo?",
]

export function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Ahoj! Som tu, aby som ti pomohol s Knihou jázd. Opýtaj sa ma na čokoľvek.",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleQuickQuestion = async (question: string) => {
    await handleSendMessage(question)
  }

  const handleSendMessage = async (text?: string) => {
    const messageText = text || input
    if (!messageText.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const response = getAIResponse(messageText)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1000)
  }

  const getAIResponse = (question: string): string => {
    const q = question.toLowerCase()

    if (q.includes("dph") || q.includes("evidovať")) {
      return "Pre správnu evidenciu jázd kvôli 100% DPH musíš zaznamenať každú jazdu s presným účelom, vzdialenosťou a časom. V nastaveniach si zvoľ režim DPH a aplikácia ti automaticky vygeneruje výkaz podľa § 85n zákona o DPH."
    }

    if (q.includes("výkaz") || q.includes("finančn")) {
      return 'Výkaz pre Finančnú správu vygeneruješ v sekcii Výkazy → DPH. Vyber obdobie, skontroluj jazdy a stlač "Exportovať PDF". Výkaz bude obsahovať všetky potrebné údaje v zákonnej forme.'
    }

    if (q.includes("autogenerovanie") || q.includes("generova")) {
      return "Autogenerovanie ti ušetrí hodiny práce. Choď do sekcie Generovanie jázd, vyber vozidlo, obdobie (od-do dátumu), partnera a appka ti automaticky vygeneruje všetky jazdy. Stačí ich skontrolovať a potvrdiť."
    }

    if (q.includes("šablón")) {
      return "Šablóny sú perfektné pre pravidelné trasy. Napríklad každé pondelky: Domov → Firma. Vytvoríš ju raz v sekcii Šablóny a potom ju použiješ jedným klikom pri vytváraní jazdy."
    }

    if (q.includes("vozidlo")) {
      return "Nové vozidlo pridáš v sekcii Vozidlá → Pridať vozidlo. Zadaj ŠPZ, názov, stav tachometra a technické údaje. Môžeš ho nastaviť ako default pre konkrétneho vodiča."
    }

    return "To je zaujímavá otázka. Pre viac informácií skús niektorú z rýchlych otázok alebo konkretizuj, s čím potrebuješ pomôcť."
  }

  return (
    <Card className="flex flex-col h-[600px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-primary" />
          AI Pomocník
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col gap-4 p-0">
        <ScrollArea className="flex-1 px-6">
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <Avatar className="h-8 w-8 bg-primary/10">
                    <AvatarFallback>
                      <Sparkles className="h-4 w-4 text-primary" />
                    </AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.role === "user" && (
                  <Avatar className="h-8 w-8 bg-primary">
                    <AvatarFallback className="text-primary-foreground text-xs">TY</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8 bg-primary/10">
                  <AvatarFallback>
                    <Sparkles className="h-4 w-4 text-primary animate-pulse" />
                  </AvatarFallback>
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <p className="text-sm text-muted-foreground">Píšem...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="px-6 pb-6 space-y-3">
          <div className="flex flex-wrap gap-2">
            {quickQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleQuickQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Opýtaj sa..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={isLoading}
            />
            <Button size="icon" onClick={() => handleSendMessage()} disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
