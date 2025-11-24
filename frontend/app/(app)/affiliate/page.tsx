"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatsCards } from "@/features/affiliate/components/stats-cards";
import { ReferralLinkSection } from "@/features/affiliate/components/referral-link-section";
import { useAuth } from "@/providers/auth-provider";
import { useQuery } from "@tanstack/react-query";
import { getAffiliateStats, getPartnerSettings, getAffiliateReferrals, getAffiliateHistory, requestPayout } from "@/lib/api/affiliate";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { sk } from "date-fns/locale";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AlertCircle, CheckCircle2, Clock } from "lucide-react";

export default function AffiliatePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRequesting, setIsRequesting] = useState(false);

  const { data: partnerSettings, isLoading: isLoadingSettings } = useQuery({
    queryKey: ["partnerSettings", user?.id],
    queryFn: () => getPartnerSettings(user!.id),
    enabled: !!user,
  });

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["affiliateStats", user?.id],
    queryFn: () => getAffiliateStats(user!.id),
    enabled: !!user,
  });

  const { data: referrals, isLoading: isLoadingReferrals } = useQuery({
    queryKey: ["affiliateReferrals", user?.id],
    queryFn: () => getAffiliateReferrals(user!.id),
    enabled: !!user && !!partnerSettings,
  });

  const { data: history, isLoading: isLoadingHistory } = useQuery({
    queryKey: ["affiliateHistory", user?.id],
    queryFn: () => getAffiliateHistory(user!.id),
    enabled: !!user,
  });

  const isPartner = partnerSettings?.isPartner || user?.role === "accountant" || user?.role === "admin";
  const isLoading = isLoadingSettings || isLoadingStats;

  const handleRequestPayout = async () => {
    if (!stats?.pendingCommission || stats.pendingCommission <= 0) return;

    setIsRequesting(true);
    try {
      await requestPayout(user!.id, stats.pendingCommission);
      toast({
        title: "Žiadosť odoslaná",
        description: "Vaša žiadosť o vyplatenie bola úspešne odoslaná.",
      });
    } catch (error) {
      toast({
        title: "Chyba",
        description: "Nepodarilo sa odoslať žiadosť o vyplatenie.",
        variant: "destructive",
      });
    } finally {
      setIsRequesting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 p-6">
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Affiliate & Partnerský Program</h1>
        <p className="mt-2 text-muted-foreground">
          {isPartner
            ? "Pomáhajte klientom viesť elektronickú knihu jázd podľa zákona a získajte odmenu za každého platiaceho používateľa, ktorého odporučíte."
            : "Odporučte aplikáciu známym alebo kolegom a získajte bonusové mesiace predplatného alebo províziu."}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Prehľad</TabsTrigger>
          <TabsTrigger value="link">Odporúčací link</TabsTrigger>
          {isPartner && <TabsTrigger value="rewards">Odmeny</TabsTrigger>}
          {isPartner && <TabsTrigger value="history">História</TabsTrigger>}
          <TabsTrigger value="howto">Ako to funguje?</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {stats && <StatsCards stats={stats} isPartner={isPartner} />}

          <Card>
            <CardHeader>
              <CardTitle>Informácie</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {isPartner
                  ? "Ako partner získavate províziu za každého odporučeného platiaceho používateľa. Provízia sa počíta z prvého zaplateného obdobia aj z každého ďalšieho predĺženia predplatného."
                  : "Každý mesiac predplatného, ktorý odporučený zákazník uhradí, vám prináša kredit na váš vlastný účet alebo zvýhodnené mesiace."}
              </p>
            </CardContent>
          </Card>

          {stats && stats.totalReferrals === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">{isPartner ? "Zatiaľ nemáte žiadnych odporučených klientov" : "Začnite odporúčať"}</h3>
                <p className="mb-4 text-sm text-muted-foreground">{isPartner ? "Začnite tým, že skopírujete svoj odporúčací link a pošlete ho klientom." : "Odporučte aplikáciu a získajte bonusové mesiace predplatného."}</p>
                <Button asChild>
                  <a href="#link">Zobraziť odporúčací link</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="link">
          {partnerSettings?.referralCode ? (
            <ReferralLinkSection referralCode={partnerSettings.referralCode} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-semibold">Affiliate program nie je aktivovaný</h3>
                <p className="mb-4 text-sm text-muted-foreground">Kontaktujte podporu pre aktiváciu affiliate programu.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {isPartner && (
          <TabsContent value="rewards" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Celková provízia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€ {stats?.totalCommission.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Čakajúca provízia</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€ {stats?.pendingCommission.toFixed(2)}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Vyplatené</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€ {stats?.paidCommission.toFixed(2)}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Vyplatenie provízie</CardTitle>
                    <CardDescription>Požiadajte o vyplatenie vašej provízie</CardDescription>
                  </div>
                  <Button onClick={handleRequestPayout} disabled={!stats?.pendingCommission || stats.pendingCommission <= 0 || isRequesting}>
                    {isRequesting ? "Spracováva sa..." : "Požiadať o vyplatenie"}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dátum</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead>Stav</TableHead>
                      <TableHead className="text-right">Suma</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {referrals && referrals.length > 0 ? (
                      referrals.map((referral) => (
                        <TableRow key={referral.id}>
                          <TableCell>{referral.activationDate ? format(new Date(referral.activationDate), "dd.MM.yyyy", { locale: sk }) : "-"}</TableCell>
                          <TableCell>{referral.referredEmail}</TableCell>
                          <TableCell>
                            <Badge variant={referral.status === "active" ? "default" : "secondary"}>{referral.status === "active" ? "Aktívny" : "Čakajúci"}</Badge>
                          </TableCell>
                          <TableCell className="text-right">€ {referral.commissionAmount.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Zatiaľ žiadne provízie
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {isPartner && (
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>História aktivít</CardTitle>
                <CardDescription>Prehľad všetkých aktivít vo vašom affiliate účte</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Dátum</TableHead>
                      <TableHead>Akcia</TableHead>
                      <TableHead>Klient</TableHead>
                      <TableHead className="text-right">Hodnota</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history && history.length > 0 ? (
                      history.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{format(new Date(item.date), "dd.MM.yyyy HH:mm", { locale: sk })}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {item.action === "activation" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              {item.action === "signup" && <Clock className="h-4 w-4 text-blue-500" />}
                              {item.action === "renewal" && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                              <span className="text-sm">{item.description}</span>
                            </div>
                          </TableCell>
                          <TableCell>{item.clientEmail || "-"}</TableCell>
                          <TableCell className="text-right">{item.amount ? `€ ${item.amount.toFixed(2)}` : "-"}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center text-muted-foreground">
                          Zatiaľ žiadna história
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="howto">
          <Card>
            <CardHeader>
              <CardTitle>Jednoduchý spôsob, ako zarábať pomocou odporúčaní</CardTitle>
              <CardDescription>Ako funguje affiliate program</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">1</div>
                  <div>
                    <h3 className="font-semibold">Zdieľajte svoj link</h3>
                    <p className="text-sm text-muted-foreground">Každý klik, registrácia a platba sa sleduje automaticky.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">2</div>
                  <div>
                    <h3 className="font-semibold">Klient si vytvorí účet</h3>
                    <p className="text-sm text-muted-foreground">Nie je potrebné nič potvrdzovať.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">3</div>
                  <div>
                    <h3 className="font-semibold">Klient začne platiť za aplikáciu</h3>
                    <p className="text-sm text-muted-foreground">A vám sa započíta provízia / bonus.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">4</div>
                  <div>
                    <h3 className="font-semibold">Odmenu si môžete vybrať</h3>
                    <p className="text-sm text-muted-foreground">Buď vyplatenie alebo bonusové mesiace.</p>
                  </div>
                </div>
              </div>

              <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                <CardContent className="pt-6">
                  <p className="text-sm">
                    <strong>Upozornenie:</strong> Affiliate program je určený pre všetkých používateľov, partnerský program je určený pre účtovníkov, poradcov a firmy.
                  </p>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
