"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Share2, QrCode, Check } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface ReferralLinkSectionProps {
  referralCode: string
}

const PROMO_TEXTS = [
  "Ahoj, odporúčam ti aplikáciu na vedenie elektronickej knihy jázd podľa § 85n. Jednoduchá evidencia, mobilná appka, fotka tachometra a hotovo. Registruj sa tu:",
  "Túto aplikáciu používam na knihu jázd – po jazde odfotím tachometer, appka doplní všetko sama. Môžeš to skúsiť tu:",
  "Použi túto appku na knihu jázd a máš pokoj s DPH kontrolou. Registrácia:",
]

export function ReferralLinkSection({ referralCode }: ReferralLinkSectionProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const { toast } = useToast()
  const referralLink = `https://app.kniha-jazd.sk/ref/${referralCode}`

  const copyToClipboard = async (text: string, index?: number) => {
    try {
      await navigator.clipboard.writeText(text)
      if (index !== undefined) {
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
      }
      toast({
        title: "Skopírované",
        description: "Link bol skopírovaný do schránky",
      })
    } catch (err) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa skopírovať link",
        variant: "destructive",
      })
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Kniha jázd - odporúčanie",
          text: "Skús túto aplikáciu na vedenie knihy jázd",
          url: referralLink,
        })
      } catch (err) {
        console.log("Share cancelled")
      }
    } else {
      copyToClipboard(referralLink)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Váš odkaz</CardTitle>
          <CardDescription>
            Toto je váš jedinečný odporúčací link. Keď sa niekto zaregistruje cez tento link, automaticky sa priradí k
            vášmu účtu.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input value={referralLink} readOnly className="font-mono text-sm" />
            <Button onClick={() => copyToClipboard(referralLink)} size="icon">
              <Copy className="h-4 w-4" />
            </Button>
            <Button onClick={shareLink} size="icon" variant="outline">
              <Share2 className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="outline">
              <QrCode className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Promo texty</CardTitle>
          <CardDescription>Texty, ktoré môžete poslať klientom alebo kolegom</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {PROMO_TEXTS.map((text, index) => (
            <div key={index} className="flex items-start gap-2 rounded-lg border p-3">
              <p className="flex-1 text-sm">
                {text} {referralLink}
              </p>
              <Button onClick={() => copyToClipboard(`${text} ${referralLink}`, index)} size="sm" variant="ghost">
                {copiedIndex === index ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
