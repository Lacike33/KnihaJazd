"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { AffiliateStats } from "@/lib/types"
import { Users, CreditCard, Gift } from "lucide-react"

interface StatsCardsProps {
  stats: AffiliateStats
  isPartner: boolean
}

export function StatsCards({ stats, isPartner }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Odporučení klienti</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalReferrals}</div>
          <p className="text-xs text-muted-foreground">Počet registrácií cez váš link</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Platiaci zákazníci</CardTitle>
          <CreditCard className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.payingCustomers}</div>
          <p className="text-xs text-muted-foreground">Aktivovali platený plán</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Získaná odmena</CardTitle>
          <Gift className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isPartner ? (
            <>
              <div className="text-2xl font-bold">€ {stats.totalCommission.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Celková provízia</p>
            </>
          ) : (
            <>
              <div className="text-2xl font-bold">{stats.bonusMonths}</div>
              <p className="text-xs text-muted-foreground">Bonusových mesiacov</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
