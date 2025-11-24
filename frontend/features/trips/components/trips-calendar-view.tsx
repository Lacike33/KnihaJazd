"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, startOfDay, endOfDay, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays } from "date-fns";
import { sk } from "date-fns/locale";
import Link from "next/link";
import type { Trip, Vehicle, Driver } from "@/lib/types";
import { TripTypeBadge } from "@/features/trips/components/trip-type-badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TripsCalendarViewProps {
  trips: Trip[];
  vehicles: Vehicle[];
  drivers: Driver[];
  isLoading: boolean;
}

type CalendarMode = "day" | "week" | "month";

export function TripsCalendarView({ trips, vehicles, isLoading }: TripsCalendarViewProps) {
  const [calendarMode, setCalendarMode] = useState<CalendarMode>("month");
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDateRange = () => {
    switch (calendarMode) {
      case "day":
        return {
          start: startOfDay(currentDate),
          end: endOfDay(currentDate),
        };
      case "week":
        return {
          start: startOfWeek(currentDate, { locale: sk }),
          end: endOfWeek(currentDate, { locale: sk }),
        };
      case "month":
      default:
        return {
          start: startOfMonth(currentDate),
          end: endOfMonth(currentDate),
        };
    }
  };

  const { start, end } = getDateRange();
  const days = eachDayOfInterval({ start, end });

  const visibleTrips = trips.filter((trip) => {
    const tripDate = new Date(trip.startTime);
    return tripDate >= start && tripDate <= end;
  });

  const getTripsForDay = (date: Date) => {
    return visibleTrips.filter((trip) => isSameDay(new Date(trip.startTime), date));
  };

  const getVehicleRegistration = (vehicleId: string) => {
    return vehicles.find((v) => v.id === vehicleId)?.registrationNo || "N/A";
  };

  const handlePrevious = () => {
    switch (calendarMode) {
      case "day":
        setCurrentDate(subDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (calendarMode) {
      case "day":
        setCurrentDate(addDays(currentDate, 1));
        break;
      case "week":
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case "month":
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const getTitle = () => {
    switch (calendarMode) {
      case "day":
        return format(currentDate, "d. MMMM yyyy", { locale: sk });
      case "week":
        return `${format(start, "d. MMM", { locale: sk })} - ${format(end, "d. MMM yyyy", { locale: sk })}`;
      case "month":
        return format(currentDate, "LLLL yyyy", { locale: sk });
    }
  };

  if (isLoading) {
    return <div className="text-center text-muted-foreground py-8">Načítavam jazdy...</div>;
  }

  const hourSlots = Array.from({ length: 24 }, (_, i) => i);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle>{getTitle()}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
              Dnes
            </Button>
            <Button variant="outline" size="sm" onClick={handleNext}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Tabs value={calendarMode} onValueChange={(v) => setCalendarMode(v as CalendarMode)}>
          <TabsList>
            <TabsTrigger value="day">Deň</TabsTrigger>
            <TabsTrigger value="week">Týždeň</TabsTrigger>
            <TabsTrigger value="month">Mesiac</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {calendarMode === "day" && (
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground mb-4">{format(currentDate, "EEEE", { locale: sk })}</div>
            <div className="relative border rounded-lg p-4">
              {/* Timeline grid */}
              <div className="space-y-0">
                {hourSlots.map((hour) => {
                  const dayTripsForHour = getTripsForDay(currentDate).filter((trip) => {
                    const tripStart = new Date(trip.startTime);
                    return tripStart.getHours() === hour;
                  });

                  return (
                    <div key={hour} className="flex border-b last:border-b-0 min-h-16">
                      {/* Hour label */}
                      <div className="w-16 flex-shrink-0 py-2 pr-4 text-sm text-muted-foreground text-right">{hour.toString().padStart(2, "0")}:00</div>

                      {/* Trip slot */}
                      <div className="flex-1 py-2 pl-4 border-l">
                        {dayTripsForHour.length > 0 ? (
                          <div className="space-y-1">
                            {dayTripsForHour.map((trip) => (
                              <Link key={trip.id} href={`/trips/${trip.id}`} className="block p-2 border rounded-lg hover:bg-muted bg-primary/5 border-primary/20">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <TripTypeBadge type={trip.type} />
                                    <div>
                                      <div className="font-medium text-sm">{getVehicleRegistration(trip.vehicleId)}</div>
                                      <div className="text-xs text-muted-foreground">
                                        {format(new Date(trip.startTime), "HH:mm")} - {format(new Date(trip.endTime), "HH:mm")}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {trip.startOdometer} - {trip.endOdometer} km
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        ) : (
                          <div className="h-full" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Week and Month views unchanged */}
        {(calendarMode === "week" || calendarMode === "month") && (
          <div className="grid grid-cols-7 gap-2">
            {["Po", "Ut", "St", "Št", "Pi", "So", "Ne"].map((day) => (
              <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                {day}
              </div>
            ))}
            {days.map((day) => {
              const dayTrips = getTripsForDay(day);
              const isToday = isSameDay(day, new Date());
              const isCurrentMonth = isSameMonth(day, currentDate);

              return (
                <div key={day.toString()} className={`min-h-24 p-2 border rounded-lg ${isToday ? "border-primary bg-primary/5" : ""} ${calendarMode === "month" && !isCurrentMonth ? "opacity-40" : ""}`}>
                  <div className="text-sm font-medium mb-1">{format(day, "d")}</div>
                  <div className="space-y-1">
                    {dayTrips.slice(0, 3).map((trip) => (
                      <Link key={trip.id} href={`/trips/${trip.id}`} className="block text-xs p-1 rounded hover:bg-muted">
                        <div className="flex items-center gap-1">
                          <TripTypeBadge type={trip.type} className="scale-75" />
                          <span className="truncate">{getVehicleRegistration(trip.vehicleId)}</span>
                        </div>
                      </Link>
                    ))}
                    {dayTrips.length > 3 && <div className="text-xs text-muted-foreground">+{dayTrips.length - 3} ďalších</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
