"use client";

import {
  Car,
  LayoutDashboard,
  Users,
  Route,
  Upload,
  Settings,
  LogOut,
  Menu,
  Satellite,
  Handshake,
  Fuel,
  Wrench,
  ChevronDown,
  ChevronRight,
  MapPin,
  FileText,
  BarChart3,
  Gauge,
  Sparkles,
  ChevronLeft,
  Calendar,
  LifeBuoy,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { logoutClient } from "@/features/login/actions/logoutClient";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["admin", "accountant", "driver", "viewer"] },
  {
    name: "Affiliate & Partneri",
    href: "/affiliate",
    icon: Handshake,
    roles: ["admin", "accountant", "driver", "viewer"],
  },
  { name: "Generovanie jázd", href: "/generate-trips", icon: Sparkles, roles: ["admin", "accountant"] },
  { name: "Sviatky", href: "/holidays", icon: Calendar, roles: ["admin", "accountant"] },
  { name: "Import", href: "/import", icon: Upload, roles: ["admin", "accountant"] },
  { name: "Pomocník", href: "/helper", icon: LifeBuoy, roles: ["admin", "accountant", "driver", "viewer"] },
  { name: "Nastavenia", href: "/settings", icon: Settings, roles: ["admin", "accountant", "driver", "viewer"] },
];

const tripsNavigation = {
  name: "Jazdy",
  icon: Route,
  roles: ["admin", "accountant", "driver", "viewer"],
  items: [
    { name: "Prehľad jázd", href: "/trips", roles: ["admin", "accountant", "driver", "viewer"] },
    { name: "Plánovač jázd", href: "/planner", icon: Calendar, roles: ["admin", "accountant"] },
    { name: "Klienti & Miesta", href: "/places", icon: MapPin, roles: ["admin", "accountant"] },
    { name: "Šablóny", href: "/templates", icon: FileText, roles: ["admin", "accountant"] },
  ],
};

const vehicleNavigation = {
  name: "Vozidlá",
  icon: Car,
  roles: ["admin", "accountant", "driver", "viewer"],
  items: [
    { name: "Prehľad vozidiel", href: "/vehicles", roles: ["admin", "accountant", "driver", "viewer"] },
    { name: "GPS zariadenia", href: "/gps-devices", icon: Satellite, roles: ["admin", "accountant"] },
    { name: "Tachometer & Fotky", href: "/odometer", icon: Gauge, roles: ["admin", "accountant"] },
    { name: "Tankovania", href: "/refuelings", icon: Fuel, roles: ["admin", "accountant"] },
    { name: "Prevádzka", href: "/maintenance", icon: Wrench, roles: ["admin", "accountant"] },
  ],
};

const reportsNavigation = {
  name: "Výkazy & Uzávierky",
  icon: BarChart3,
  roles: ["admin", "accountant"],
  items: [
    { name: "DPH výkazy", href: "/reports/vat", roles: ["admin", "accountant"] },
    { name: "Interné reporty", href: "/reports/internal", roles: ["admin", "accountant"] },
    { name: "Exporty", href: "/reports/exports", roles: ["admin", "accountant"] },
  ],
};

const peopleNavigation = {
  name: "Ľudia",
  icon: Users,
  roles: ["admin", "accountant"],
  items: [
    { name: "Vodiči", href: "/drivers", roles: ["admin", "accountant"] },
    { name: "Používatelia", href: "/users", roles: ["admin"] },
  ],
};

function SidebarContent({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const pathname = usePathname();
  const { user, hasRole } = useAuth();

  const [vehiclesOpen, setVehiclesOpen] = useState(false);
  const [tripsOpen, setTripsOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [peopleOpen, setPeopleOpen] = useState(false);

  const filteredNavigation = navigation.filter((item) => item.roles.some((role) => hasRole(role)));
  const filteredTripsItems = tripsNavigation.items.filter((item) => item.roles.some((role) => hasRole(role)));
  const filteredVehicleItems = vehicleNavigation.items.filter((item) => item.roles.some((role) => hasRole(role)));
  const filteredReportsItems = reportsNavigation.items.filter((item) => item.roles.some((role) => hasRole(role)));
  const filteredPeopleItems = peopleNavigation.items.filter((item) => item.roles.some((role) => hasRole(role)));

  const isTripsSectionActive = pathname.startsWith("/trips") || pathname.startsWith("/places") || pathname.startsWith("/templates") || pathname.startsWith("/planner");
  const isVehiclesSectionActive = pathname.startsWith("/vehicles") || pathname.startsWith("/refuelings") || pathname.startsWith("/maintenance") || pathname.startsWith("/gps-devices") || pathname.startsWith("/odometer");
  const isReportsSectionActive = pathname.startsWith("/reports");
  const isPeopleSectionActive = pathname.startsWith("/drivers") || pathname.startsWith("/users");

  return (
    <div className="flex h-full flex-col">
      {!isCollapsed && (
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary">
              <Car className="h-5 w-5 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">Kniha jázd</span>
          </div>
        </div>
      )}

      {isCollapsed && (
        <div className="flex h-16 items-center justify-center border-b border-sidebar-border">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary">
            <Car className="h-5 w-5 text-sidebar-primary-foreground" />
          </div>
        </div>
      )}

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {filteredNavigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && item.name}
            </Link>
          );
        })}

        {peopleNavigation.roles.some((role) => hasRole(role)) && (
          <Collapsible open={peopleOpen} onOpenChange={setPeopleOpen}>
            <CollapsibleTrigger
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isPeopleSectionActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
              title={isCollapsed ? peopleNavigation.name : undefined}
            >
              <peopleNavigation.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="flex-1 text-left">{peopleNavigation.name}</span>}
              {!isCollapsed && (peopleOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="space-y-1 pl-6 pt-1">
                {filteredPeopleItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        )}

        <Collapsible open={tripsOpen} onOpenChange={setTripsOpen}>
          <CollapsibleTrigger
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isTripsSectionActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            title={isCollapsed ? tripsNavigation.name : undefined}
          >
            <tripsNavigation.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">{tripsNavigation.name}</span>}
            {!isCollapsed && (tripsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="space-y-1 pl-6 pt-1">
              {filteredTripsItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
            </CollapsibleContent>
          )}
        </Collapsible>

        <Collapsible open={vehiclesOpen} onOpenChange={setVehiclesOpen}>
          <CollapsibleTrigger
            data-mission-target="vehicles-menu"
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isVehiclesSectionActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
            )}
            title={isCollapsed ? vehicleNavigation.name : undefined}
          >
            <vehicleNavigation.icon className="h-5 w-5 shrink-0" />
            {!isCollapsed && <span className="flex-1 text-left">{vehicleNavigation.name}</span>}
            {!isCollapsed && (vehiclesOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
          </CollapsibleTrigger>
          {!isCollapsed && (
            <CollapsibleContent className="space-y-1 pl-6 pt-1">
              {filteredVehicleItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                );
              })}
            </CollapsibleContent>
          )}
        </Collapsible>

        {reportsNavigation.roles.some((role) => hasRole(role)) && (
          <Collapsible open={reportsOpen} onOpenChange={setReportsOpen}>
            <CollapsibleTrigger
              className={cn(
                "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isReportsSectionActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
              title={isCollapsed ? reportsNavigation.name : undefined}
            >
              <reportsNavigation.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="flex-1 text-left">{reportsNavigation.name}</span>}
              {!isCollapsed && (reportsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />)}
            </CollapsibleTrigger>
            {!isCollapsed && (
              <CollapsibleContent className="space-y-1 pl-6 pt-1">
                {filteredReportsItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                })}
              </CollapsibleContent>
            )}
          </Collapsible>
        )}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        {!isCollapsed && (
          <>
            <div className="mb-3 rounded-lg bg-sidebar-accent p-3">
              <div className="text-sm font-medium text-sidebar-accent-foreground">{user?.email}</div>
              <div className="mt-1 text-xs text-muted-foreground capitalize">{user?.role}</div>
            </div>
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={logoutClient}>
              <LogOut className="mr-2 h-4 w-4" />
              Odhlásiť sa
            </Button>
          </>
        )}
        {isCollapsed && (
          <Button variant="outline" size="icon" className="w-full bg-transparent" onClick={logoutClient} title="Odhlásiť sa">
            <LogOut className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

export function AppSidebar({ isOpen, onToggle }: { isOpen: boolean; onToggle: () => void }) {
  return (
    <>
      <aside className={cn("fixed left-0 top-0 z-40 h-screen border-r border-sidebar-border bg-sidebar transition-all duration-300 hidden lg:block", isOpen ? "w-64" : "w-16")}>
        <SidebarContent isCollapsed={!isOpen} />
        <Button variant="ghost" size="icon" className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border border-sidebar-border bg-sidebar shadow-md" onClick={onToggle}>
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>
      </aside>
    </>
  );
}

export function MobileSidebar() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Otvoriť menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}
