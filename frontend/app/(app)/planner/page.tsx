"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Plus, CalendarIcon } from "lucide-react"
import Link from "next/link"
import { getPlannedTrips } from "@/lib/api/planner"
import { format, isFuture, isPast } from "date-fns"
import { sk } from "date-fns/locale"

export default function PlannerPage() {
  const [activeTab, setActiveTab] = useState("upcoming")

  const { data: allPlannedTrips = [], isLoading } = useQuery({
    queryKey: ["plannedTrips"],
    queryFn: () => getPlannedTrips(),
  })

  const upcomingTrips = allPlannedTrips.filter((t) => t.status === "planned" && isFuture(new Date(t.plannedDate)))
  const historicalTrips = allPlannedTrips.filter((t) => t.status === "completed" || isPast(new Date(t.plannedDate)))
  const recurringTrips = allPlannedTrips.filter((t) => t.isRecurring)

  const getRecurrenceLabel = (type: string) => {
    switch (type) {
      case "daily":
        return "Denne"
      case "weekly":
        return "Týždenne"
      case "monthly":
        return "Mesačne"
      case "workdays":
        return "Pracovné dni"
      case "custom":
        return "Vlastné"
      default:
        return type
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Plánovač jázd</h1>
          <p className="text-muted-foreground mt-1">Plánované a pravidelné trasy</p>
        </div>
        <Button asChild>
          <Link href="/planner/new">
            <Plus className="mr-2 h-4 w-4" />
            Naplánovať trasu
          </Link>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="upcoming">
            Plánované jazdy
            <Badge variant="secondary" className="ml-2">
              {upcomingTrips.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="historical">
            Historické
            <Badge variant="secondary" className="ml-2">
              {historicalTrips.length}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="recurring">
            Pravidelné jazdy
            <Badge variant="secondary" className="ml-2">
              {recurringTrips.length}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">Načítavam...</div>
          ) : upcomingTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Žiadne plánované jazdy</p>
              </CardContent>
            </Card>
          ) : (
            upcomingTrips.map((trip) => (
              <Link key={trip.id} href={`/planner/${trip.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{trip.description || "Plánovaná jazda"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(trip.plannedDate), "d. MMMM yyyy", { locale: sk })}
                          <Clock className="h-4 w-4 ml-2" />
                          {trip.plannedTimeFrom} - {trip.plannedTimeTo}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={trip.type === "business" ? "default" : "secondary"}>{trip.type}</Badge>
                        {trip.isRecurring && <Badge variant="outline">Pravidelná</Badge>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.distanceKm} km</span>
                      {trip.waypoints && trip.waypoints.length > 0 && (
                        <>
                          <span>•</span>
                          <span>{trip.waypoints.length} zastávok</span>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="historical" className="space-y-4">
          {historicalTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Žiadne historické plánované jazdy</p>
              </CardContent>
            </Card>
          ) : (
            historicalTrips.map((trip) => (
              <Link key={trip.id} href={`/planner/${trip.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{trip.description || "Plánovaná jazda"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {format(new Date(trip.plannedDate), "d. MMMM yyyy", { locale: sk })}
                        </CardDescription>
                      </div>
                      <Badge variant={trip.status === "completed" ? "default" : "secondary"}>{trip.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.distanceKm} km</span>
                      {trip.actualTripId && (
                        <>
                          <span>•</span>
                          <Link
                            href={`/trips/${trip.actualTripId}`}
                            className="text-primary hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Zobraz realizovanú jazdu
                          </Link>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>

        <TabsContent value="recurring" className="space-y-4">
          {recurringTrips.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">Žiadne pravidelné jazdy</p>
              </CardContent>
            </Card>
          ) : (
            recurringTrips.map((trip) => (
              <Link key={trip.id} href={`/planner/${trip.id}`}>
                <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{trip.description || "Pravidelná jazda"}</CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-4 w-4" />
                          {trip.recurrencePattern && getRecurrenceLabel(trip.recurrencePattern.type)}
                          {trip.recurrencePattern?.timeTolerance && (
                            <>
                              <span>•</span>
                              <span>Tolerancia ±{trip.recurrencePattern.timeTolerance} min</span>
                            </>
                          )}
                        </CardDescription>
                      </div>
                      <Badge variant="outline">Aktívna</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{trip.distanceKm} km</span>
                        <span>•</span>
                        <span>
                          {trip.plannedTimeFrom} - {trip.plannedTimeTo}
                        </span>
                      </div>
                      {trip.recurrencePattern?.endDate && (
                        <div className="text-sm text-muted-foreground">
                          Platné do: {format(new Date(trip.recurrencePattern.endDate), "d. MMMM yyyy", { locale: sk })}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
