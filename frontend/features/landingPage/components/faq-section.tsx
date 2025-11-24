import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function FaqSection() {
  const faqs = [
    {
      question: "Potrebujem GPS?",
      answer: "Nie. Evidencia funguje na princípe šablón jázd a fotenia tachometra. GPS krabičky nie sú potrebné.",
    },
    {
      question: "Je to legálne?",
      answer:
        "Áno, aplikácia je navrhnutá tak, aby spĺňala požiadavky § 85n zákona o DPH na elektronickú evidenciu jázd.",
    },
    {
      question: "Čo ak spravím chybu v jazde?",
      answer:
        "Jazdu môžete opraviť, ale všetky zmeny sa logujú. Appka vás upozorní, ak by úprava mohla vyzerať podozrivo pri kontrole.",
    },
    {
      question: "Prečo mi nestačí Excel?",
      answer:
        "Nové pravidlá kladú dôraz na elektronickú evidenciu, archiváciu, konzistenciu s tachometrom a dôkazmi. Appka vám to všetko postráži a vygeneruje výkaz pre DPH.",
    },
    {
      question: "Musí vodič po každej jazde niečo vypĺňať?",
      answer:
        "Najčastejšie mu stačí otvoriť mobil, odfotiť tachometer a potvrdiť navrhnutú jazdu podľa šablóny. Celý proces trvá pár sekúnd.",
    },
    {
      question: "Funguje aplikácia offline?",
      answer:
        "Áno, mobilná aplikácia funguje aj bez pripojenia na internet. Dáta sa automaticky synchronizujú po obnovení pripojenia.",
    },
    {
      question: "Ako dlho sú dáta archivované?",
      answer:
        "Dáta sú archivované v súlade s požiadavkami zákona o DPH, typicky 10 rokov. Všetky fotky tachometra a záznamy jázd sú bezpečne uložené.",
    },
    {
      question: "Čo ak mám viac ako 5 áut?",
      answer:
        "Pre firmy s väčším počtom vozidiel pripravujeme Enterprise plán. Kontaktujte nás pre individuálnu cenovú ponuku.",
    },
    {
      question: "Môžem zarábať, keď odporučím aplikáciu svojim klientom alebo známym?",
      answer:
        "Áno. Každý zákazník má v aplikácii vlastný odporúčací link. Účtovníci a partneri si môžu vytvoriť partnerský profil a získavať províziu alebo bonusové mesiace predplatného za každého platiaceho klienta.",
    },
    {
      question: "Je partnerský program len pre účtovníkov?",
      answer:
        "Nie. Účtovníkov cielime ako hlavných partnerov, ale odporúčací link má k dispozícii každý platící zákazník.",
    },
  ]

  return (
    <section id="faq" className="border-t bg-muted/30 py-20">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl space-y-12">
          <div className="space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">Často kladené otázky</h2>
            <p className="text-lg text-muted-foreground">Všetko, čo potrebujete vedieť o aplikácii Kniha jázd</p>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
