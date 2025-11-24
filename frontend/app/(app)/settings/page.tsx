"use client"

import { useAuth } from "@/providers/auth-provider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Building2, Bell, Users, Zap, Save, MapPin, Plus, Trash2, Calendar } from "lucide-react"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { MOCK_COMPANY_SETTINGS, MOCK_USER_ROLES, MOCK_PLACES } from "@/lib/mock-data"
import type { VatPayerType, VatRegime, NotificationSettings, Place, CalendarSyncSettings } from "@/lib/types"

export default function SettingsPage() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [companyData, setCompanyData] = useState({
    name: user?.company.name || "",
    ico: user?.company.ico || "",
    dic: user?.company.dic || "",
    address: {
      street: user?.company.address?.street || "",
      number: user?.company.address?.number || "",
      postalCode: user?.company.address?.postalCode || "",
      city: user?.company.address?.city || "",
      country: user?.company.address?.country || "",
    },
    isVatPayer: user?.company.isVatPayer || false,
    icdph: user?.company.icdph || "",
  })

  const [companySettings, setCompanySettings] = useState({
    vatPayerType: MOCK_COMPANY_SETTINGS.vatPayerType as VatPayerType,
    autoGenerateVatReports: MOCK_COMPANY_SETTINGS.autoGenerateVatReports,
    defaultVehicleVatRegime: MOCK_COMPANY_SETTINGS.defaultVehicleVatRegime as VatRegime,
  })

  const [notifications, setNotifications] = useState<NotificationSettings[]>(MOCK_COMPANY_SETTINGS.notifications)

  const [automationSettings, setAutomationSettings] = useState({
    mobileAutoGenerateTrips: MOCK_COMPANY_SETTINGS.mobileAutoGenerateTrips,
    mobileRequiresConfirmation: MOCK_COMPANY_SETTINGS.mobileRequiresConfirmation,
    globalKmTolerance: MOCK_COMPANY_SETTINGS.globalKmTolerance,
    autofillDefaultTripPurpose: MOCK_COMPANY_SETTINGS.autofillDefaultTripPurpose ?? false,
  })

  const [calendarSync, setCalendarSync] = useState<CalendarSyncSettings>(
    MOCK_COMPANY_SETTINGS.calendarSync || {
      enabled: false,
      provider: "google",
      syncType: "all",
      autoSync: false,
      syncIntervalMinutes: 60,
    },
  )

  const [companyLocations] = useState<Place[]>(MOCK_PLACES.filter((place) => place.isCompanyLocation))

  const handleSaveCompanySettings = () => {
    toast({
      title: "Nastavenia uložené",
      description: "Nastavenia firmy a DPH boli úspešne aktualizované.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "Notifikácie uložené",
      description: "Nastavenia notifikácií boli úspešne aktualizované.",
    })
  }

  const handleSaveAutomation = () => {
    toast({
      title: "Automatizácia uložená",
      description: "Nastavenia automatizácie boli úspešne aktualizované.",
    })
  }

  const handleSaveCalendarSync = () => {
    toast({
      title: "Nastavenia uložené",
      description: "Nastavenia synchronizácie kalendára boli úspešne aktualizované.",
    })
  }

  const handleConnectCalendar = () => {
    // In real implementation, this would redirect to OAuth flow
    toast({
      title: "Pripájanie kalendára",
      description: "Budete presmerovaný na prihlásenie do Google Calendar...",
    })
  }

  const getNotificationLabel = (type: string) => {
    const labels: Record<string, string> = {
      vat_deadline_approaching: "Blíži sa uzávierka DPH",
      missing_odometer_photo: "Chýba fotka tachometra",
      km_mismatch: "Rozdiel km vs tachometer je príliš veľký",
      fuel_costs_anomaly: "PHL výdavky sú neprimerané k km",
      private_trip_on_business_vehicle: "Súkromná jazda na 100% business vozidle",
      insurance_expiry_approaching: "Blíži sa koniec platnosti poistenia",
    }
    return labels[type] || type
  }

  const isAdmin = user?.role === "admin"

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nastavenia</h1>
        <p className="text-muted-foreground">Správa nastavení systému a notifikácií</p>
      </div>

      <Tabs defaultValue="company" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="company">
            <Building2 className="h-4 w-4 mr-2" />
            Firma & DPH
          </TabsTrigger>
          <TabsTrigger value="branches">
            <MapPin className="h-4 w-4 mr-2" />
            Pobočky
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            Notifikácie
          </TabsTrigger>
          <TabsTrigger value="calendars">
            <Calendar className="h-4 w-4 mr-2" />
            Kalendáre
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Používatelia & roly
          </TabsTrigger>
          <TabsTrigger value="automation">
            <Zap className="h-4 w-4 mr-2" />
            Automatizácia
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Údaje o spoločnosti</CardTitle>
              <CardDescription>Základné informácie o vašej firme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Názov spoločnosti</Label>
                <Input
                  value={companyData.name}
                  onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })}
                  disabled={!isAdmin}
                />
              </div>

              <div className="space-y-2">
                <Label>Sídlo spoločnosti</Label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Ulica</Label>
                  <Input
                    value={companyData.address.street}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        address: { ...companyData.address, street: e.target.value },
                      })
                    }
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Číslo</Label>
                  <Input
                    value={companyData.address.number}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        address: { ...companyData.address, number: e.target.value },
                      })
                    }
                    disabled={!isAdmin}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>PSČ</Label>
                  <Input
                    value={companyData.address.postalCode}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        address: { ...companyData.address, postalCode: e.target.value },
                      })
                    }
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Mesto</Label>
                  <Input
                    value={companyData.address.city}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        address: { ...companyData.address, city: e.target.value },
                      })
                    }
                    disabled={!isAdmin}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Štát</Label>
                  <Input
                    value={companyData.address.country}
                    onChange={(e) =>
                      setCompanyData({
                        ...companyData,
                        address: { ...companyData.address, country: e.target.value },
                      })
                    }
                    disabled={!isAdmin}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>IČO</Label>
                  <Input
                    value={companyData.ico}
                    onChange={(e) => setCompanyData({ ...companyData, ico: e.target.value })}
                    disabled={!isAdmin}
                  />
                </div>

                <div className="space-y-2">
                  <Label>DIČ</Label>
                  <Input
                    value={companyData.dic}
                    onChange={(e) => setCompanyData({ ...companyData, dic: e.target.value })}
                    disabled={!isAdmin}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between border-t pt-4">
                <div className="space-y-0.5">
                  <Label>Firma je platca DPH</Label>
                  <p className="text-sm text-muted-foreground">Aktivujte ak vaša firma platí DPH</p>
                </div>
                <Switch
                  checked={companyData.isVatPayer}
                  onCheckedChange={(checked) => setCompanyData({ ...companyData, isVatPayer: checked })}
                  disabled={!isAdmin}
                />
              </div>

              {companyData.isVatPayer && (
                <div className="space-y-2">
                  <Label>IČ DPH</Label>
                  <Input
                    value={companyData.icdph}
                    onChange={(e) => setCompanyData({ ...companyData, icdph: e.target.value })}
                    placeholder="SK..."
                    disabled={!isAdmin}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {companyData.isVatPayer && (
            <Card>
              <CardHeader>
                <CardTitle>Nastavenie DPH</CardTitle>
                <CardDescription>Režim evidencie pre DPH výkazy</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Typ platcu DPH</Label>
                  <Select
                    value={companySettings.vatPayerType}
                    onValueChange={(value: VatPayerType) =>
                      setCompanySettings({ ...companySettings, vatPayerType: value })
                    }
                    disabled={!isAdmin}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Mesačný platca</SelectItem>
                      <SelectItem value="quarterly">Štvrťročný platca (kvartálny)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Automaticky generovať uzávierky</Label>
                    <p className="text-sm text-muted-foreground">Systém vytvorí uzávierky na konci obdobia</p>
                  </div>
                  <Switch
                    checked={companySettings.autoGenerateVatReports}
                    onCheckedChange={(checked) =>
                      setCompanySettings({ ...companySettings, autoGenerateVatReports: checked })
                    }
                    disabled={!isAdmin}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Default režim pre nové vozidlá</Label>
                  <Select
                    value={companySettings.defaultVehicleVatRegime}
                    onValueChange={(value: VatRegime) =>
                      setCompanySettings({ ...companySettings, defaultVehicleVatRegime: value })
                    }
                    disabled={!isAdmin}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="100_business">100% business (prísna evidencia)</SelectItem>
                      <SelectItem value="50_mixed">50% mix</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Toto nastavenie sa použije pri pridávaní nového vozidla
                  </p>
                </div>

                {isAdmin && (
                  <Button onClick={handleSaveCompanySettings}>
                    <Save className="h-4 w-4 mr-2" />
                    Uložiť nastavenia
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="branches" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pobočky a prevádzky</CardTitle>
                  <CardDescription>Miesta prepojené s firmou (sídlo, pobočky, sklady)</CardDescription>
                </div>
                {isAdmin && (
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Pridať pobočku
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {companyLocations.map((location) => (
                  <div key={location.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{location.name}</p>
                          {location.type === "headquarters" && (
                            <Badge variant="default" className="mt-1">
                              Hlavné sídlo
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="ml-8 space-y-1">
                        {location.address && (
                          <p className="text-sm text-muted-foreground">
                            {typeof location.address === "string"
                              ? location.address
                              : `${location.address.street} ${location.address.number}, ${location.address.postalCode} ${location.address.city}, ${location.address.country}`}
                          </p>
                        )}
                        {location.latitude && location.longitude && (
                          <p className="text-xs text-muted-foreground">
                            GPS: {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
                          </p>
                        )}
                        {location.notes && <p className="text-sm text-muted-foreground mt-2">{location.notes}</p>}
                      </div>
                    </div>
                    {isAdmin && location.type !== "headquarters" && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          Upraviť
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}

                {companyLocations.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Zatiaľ nemáte pridané žiadne pobočky</p>
                    {isAdmin && (
                      <Button variant="outline" className="mt-4 bg-transparent">
                        <Plus className="h-4 w-4 mr-2" />
                        Pridať prvú pobočku
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informácie</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>
                Pobočky a prevádzky sú automaticky prepojené so sekciou <strong>Jazdy → Klienti & Miesta</strong>.
              </p>
              <p>
                GPS súradnice umožňujú presné sledovanie ciest medzi týmito miestami a automatické párovanie s šablónami
                jázd.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Upozornenia a notifikácie</CardTitle>
              <CardDescription>Vyberte si, ktoré upozornenia chcete dostávať</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {notifications.map((notification, index) => (
                <div key={notification.type} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>{getNotificationLabel(notification.type)}</Label>
                      {notification.advanceDays && (
                        <p className="text-sm text-muted-foreground">Upozorniť {notification.advanceDays} dní vopred</p>
                      )}
                    </div>
                    <Switch
                      checked={notification.enabled}
                      onCheckedChange={(checked) => {
                        const updated = [...notifications]
                        updated[index] = { ...updated[index], enabled: checked }
                        setNotifications(updated)
                      }}
                    />
                  </div>

                  {notification.enabled && (
                    <div className="ml-4 space-y-2">
                      {(notification.type === "vat_deadline_approaching" ||
                        notification.type === "insurance_expiry_approaching" ||
                        notification.type === "missing_odometer_photo") && (
                        <div className="mb-3">
                          <Label className="text-sm">
                            {notification.type === "missing_odometer_photo"
                              ? "Počet dní bez fotky"
                              : "Počet dní vopred"}
                          </Label>
                          <Input
                            type="number"
                            min="1"
                            max="90"
                            value={notification.advanceDays || 7}
                            onChange={(e) => {
                              const updated = [...notifications]
                              updated[index] = {
                                ...updated[index],
                                advanceDays: Number.parseInt(e.target.value) || 7,
                              }
                              setNotifications(updated)
                            }}
                            className="mt-1 max-w-[120px]"
                          />
                        </div>
                      )}

                      {notification.type === "km_mismatch" && (
                        <div className="mb-3">
                          <Label className="text-sm">Tolerancia km rozdielu</Label>
                          <Input
                            type="number"
                            min="1"
                            max="100"
                            value={notification.kmTolerance || 10}
                            onChange={(e) => {
                              const updated = [...notifications]
                              updated[index] = {
                                ...updated[index],
                                kmTolerance: Number.parseInt(e.target.value) || 10,
                              }
                              setNotifications(updated)
                            }}
                            className="mt-1 max-w-[120px]"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upozorní, ak rozdiel medzi km z jazd a tachometrom prekročí túto hodnotu
                          </p>
                        </div>
                      )}

                      {notification.type === "fuel_costs_anomaly" && (
                        <div className="mb-3">
                          <Label className="text-sm">Tolerancia rozdiel v litroch</Label>
                          <Input
                            type="number"
                            min="1"
                            max="50"
                            value={notification.fuelLiterTolerance || 5}
                            onChange={(e) => {
                              const updated = [...notifications]
                              updated[index] = {
                                ...updated[index],
                                fuelLiterTolerance: Number.parseInt(e.target.value) || 5,
                              }
                              setNotifications(updated)
                            }}
                            className="mt-1 max-w-[120px]"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Upozorní, ak rozdiel medzi vypočítanou spotrebou a skutočnými PHM výdavkami prekročí túto
                            hodnotu
                          </p>
                        </div>
                      )}

                      <Label className="text-sm">Kanály</Label>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notification.channels.includes("email")}
                            onCheckedChange={(checked) => {
                              const updated = [...notifications]
                              const channels = checked
                                ? [...notification.channels, "email"]
                                : notification.channels.filter((c) => c !== "email")
                              updated[index] = { ...updated[index], channels }
                              setNotifications(updated)
                            }}
                          />
                          <label className="text-sm">Email</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notification.channels.includes("push")}
                            onCheckedChange={(checked) => {
                              const updated = [...notifications]
                              const channels = checked
                                ? [...notification.channels, "push"]
                                : notification.channels.filter((c) => c !== "push")
                              updated[index] = { ...updated[index], channels }
                              setNotifications(updated)
                            }}
                          />
                          <label className="text-sm">Push notifikácia (mobil)</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={notification.channels.includes("in_app")}
                            onCheckedChange={(checked) => {
                              const updated = [...notifications]
                              const channels = checked
                                ? [...notification.channels, "in_app"]
                                : notification.channels.filter((c) => c !== "in_app")
                              updated[index] = { ...updated[index], channels }
                              setNotifications(updated)
                            }}
                          />
                          <label className="text-sm">In-app notifikácia (zvonček)</label>
                        </div>
                      </div>
                    </div>
                  )}

                  {index < notifications.length - 1 && <div className="border-t pt-3" />}
                </div>
              ))}

              <Button onClick={handleSaveNotifications}>
                <Save className="h-4 w-4 mr-2" />
                Uložiť nastavenia
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendars" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Synchronizácia kalendára</CardTitle>
              <CardDescription>Importujte a synchronizujte jazdy s pracovným kalendárom</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Povoliť synchronizáciu kalendára</Label>
                  <p className="text-sm text-muted-foreground">
                    Automaticky synchronizujte jazdy s externým kalendárom
                  </p>
                </div>
                <Switch
                  checked={calendarSync.enabled}
                  onCheckedChange={(checked) => setCalendarSync({ ...calendarSync, enabled: checked })}
                  disabled={!isAdmin}
                />
              </div>

              {calendarSync.enabled && (
                <>
                  <div className="space-y-2">
                    <Label>Kalendárový systém</Label>
                    <Select
                      value={calendarSync.provider}
                      onValueChange={(value: "google" | "outlook" | "apple") =>
                        setCalendarSync({ ...calendarSync, provider: value })
                      }
                      disabled={!isAdmin}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">Google Calendar</SelectItem>
                        <SelectItem value="outlook">Microsoft Outlook</SelectItem>
                        <SelectItem value="apple">Apple Calendar (iCloud)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {!calendarSync.calendarId ? (
                    <div className="border rounded-lg p-4 bg-muted/50">
                      <p className="text-sm text-muted-foreground mb-3">
                        Pre aktiváciu synchronizácie musíte pripojiť svoj{" "}
                        {calendarSync.provider === "google"
                          ? "Google"
                          : calendarSync.provider === "outlook"
                            ? "Microsoft"
                            : "Apple"}{" "}
                        účet.
                      </p>
                      <Button onClick={handleConnectCalendar} disabled={!isAdmin}>
                        Pripojiť{" "}
                        {calendarSync.provider === "google"
                          ? "Google Calendar"
                          : calendarSync.provider === "outlook"
                            ? "Outlook"
                            : "Apple Calendar"}
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="border rounded-lg p-4 bg-green-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-900">Kalendár pripojený</p>
                            <p className="text-xs text-green-700 mt-1">ID: {calendarSync.calendarId}</p>
                            {calendarSync.lastSyncAt && (
                              <p className="text-xs text-green-700 mt-1">
                                Posledná synchronizácia: {new Date(calendarSync.lastSyncAt).toLocaleString("sk-SK")}
                              </p>
                            )}
                          </div>
                          {isAdmin && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setCalendarSync({ ...calendarSync, calendarId: undefined })}
                            >
                              Odpojiť
                            </Button>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Typ synchronizácie</Label>
                        <Select
                          value={calendarSync.syncType}
                          onValueChange={(value: "planned_only" | "actual_only" | "all") =>
                            setCalendarSync({ ...calendarSync, syncType: value })
                          }
                          disabled={!isAdmin}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="planned_only">Len plánované jazdy</SelectItem>
                            <SelectItem value="actual_only">Len reálne jazdy</SelectItem>
                            <SelectItem value="all">Všetky jazdy (plánované + reálne)</SelectItem>
                          </SelectContent>
                        </Select>
                        <p className="text-xs text-muted-foreground">
                          Vyberte, ktoré typy jázd sa majú synchronizovať do kalendára
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label>Automatická synchronizácia</Label>
                          <p className="text-sm text-muted-foreground">Pravidelne kontrolovať a synchronizovať zmeny</p>
                        </div>
                        <Switch
                          checked={calendarSync.autoSync}
                          onCheckedChange={(checked) => setCalendarSync({ ...calendarSync, autoSync: checked })}
                          disabled={!isAdmin}
                        />
                      </div>

                      {calendarSync.autoSync && (
                        <div className="space-y-2">
                          <Label>Interval synchronizácie</Label>
                          <Select
                            value={calendarSync.syncIntervalMinutes.toString()}
                            onValueChange={(value) =>
                              setCalendarSync({ ...calendarSync, syncIntervalMinutes: Number.parseInt(value) })
                            }
                            disabled={!isAdmin}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="15">Každých 15 minút</SelectItem>
                              <SelectItem value="30">Každých 30 minút</SelectItem>
                              <SelectItem value="60">Každú hodinu</SelectItem>
                              <SelectItem value="120">Každé 2 hodiny</SelectItem>
                              <SelectItem value="360">Každých 6 hodín</SelectItem>
                              <SelectItem value="1440">Denne</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </>
                  )}

                  {isAdmin && (
                    <Button onClick={handleSaveCalendarSync}>
                      <Save className="h-4 w-4 mr-2" />
                      Uložiť nastavenia
                    </Button>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informácie</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <p>Synchronizácia kalendára umožňuje:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Automatický import plánovaných jázd do vášho pracovného kalendára</li>
                <li>Vizualizáciu skutočných jázd v kalendári</li>
                <li>Notifikácie pred plánovanými jazdami</li>
                <li>Integráciu s mobilnými aplikáciami kalendára</li>
              </ul>
              <p className="mt-4">
                <strong>Poznámka:</strong> Momentálne je podporovaný iba Google Calendar. Podpora pre Microsoft Outlook
                a Apple Calendar bude pridaná v budúcich verziách.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Používatelia systému</CardTitle>
              <CardDescription>Správa používateľov a ich oprávnení</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {MOCK_USER_ROLES.map((userRole) => (
                  <div key={userRole.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <p className="font-medium">{userRole.name}</p>
                        <Badge
                          variant={
                            userRole.role === "admin"
                              ? "destructive"
                              : userRole.role === "accountant"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {userRole.role === "admin"
                            ? "Administrátor"
                            : userRole.role === "accountant"
                              ? "Účtovník"
                              : userRole.role === "driver"
                                ? "Vodič"
                                : "Pozorovateľ"}
                        </Badge>
                        {userRole.active && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Aktívny
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{userRole.email}</p>
                      {userRole.lastLogin && (
                        <p className="text-xs text-muted-foreground">
                          Posledné prihlásenie: {new Date(userRole.lastLogin).toLocaleString("sk-SK")}
                        </p>
                      )}
                    </div>
                    {isAdmin && userRole.userId !== user?.id && (
                      <Button variant="outline" size="sm">
                        Upraviť
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="automation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mobilná aplikácia</CardTitle>
              <CardDescription>Nastavenie automatického generovania jázd z mobilnej appky</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Povoliť automatické generovanie jázd</Label>
                  <p className="text-sm text-muted-foreground">
                    Mobilná appka môže automaticky vytvárať jazdy po nafotení tachometra
                  </p>
                </div>
                <Switch
                  checked={automationSettings.mobileAutoGenerateTrips}
                  onCheckedChange={(checked) =>
                    setAutomationSettings({ ...automationSettings, mobileAutoGenerateTrips: checked })
                  }
                  disabled={!isAdmin}
                />
              </div>

              {automationSettings.mobileAutoGenerateTrips && (
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Vyžadovať manuálne potvrdenie</Label>
                    <p className="text-sm text-muted-foreground">
                      Appka len predpripraví návrh, používateľ musí potvrdiť
                    </p>
                  </div>
                  <Switch
                    checked={automationSettings.mobileRequiresConfirmation}
                    onCheckedChange={(checked) =>
                      setAutomationSettings({ ...automationSettings, mobileRequiresConfirmation: checked })
                    }
                    disabled={!isAdmin}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Šablóny jázd</CardTitle>
              <CardDescription>Nastavenie automatického párovania na šablóny</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automatické predvyplnenie účelu jazdy</Label>
                  <p className="text-sm text-muted-foreground">
                    Pri vytváraní jazdy sa automaticky predvyplní predvolený účel z vybraného miesta
                  </p>
                </div>
                <Switch
                  checked={automationSettings.autofillDefaultTripPurpose}
                  onCheckedChange={(checked) =>
                    setAutomationSettings({ ...automationSettings, autofillDefaultTripPurpose: checked })
                  }
                  disabled={!isAdmin}
                />
              </div>

              <div className="space-y-2">
                <Label>Globálna tolerancia km</Label>
                <div className="flex items-center gap-4">
                  <Input
                    type="number"
                    value={automationSettings.globalKmTolerance}
                    onChange={(e) =>
                      setAutomationSettings({
                        ...automationSettings,
                        globalKmTolerance: Number.parseInt(e.target.value) || 0,
                      })
                    }
                    disabled={!isAdmin}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">km</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Maximálny rozdiel vzdialenosti pri automatickom párovaní jázd na šablóny
                </p>
              </div>

              {isAdmin && (
                <Button onClick={handleSaveAutomation}>
                  <Save className="h-4 w-4 mr-2" />
                  Uložiť nastavenia
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
