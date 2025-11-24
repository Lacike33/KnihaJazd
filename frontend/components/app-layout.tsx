"use client";

import type React from "react";
import { AppSidebar } from "./app-sidebar";
import { AppHeader } from "./app-header";
import { RequireAuth } from "@/features/login/components/require-auth";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <RequireAuth>
      <div className="flex h-screen overflow-hidden">
        <AppSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className={cn("flex flex-1 flex-col overflow-hidden transition-all", sidebarOpen ? "lg:ml-64" : "lg:ml-16")}>
          <AppHeader onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </RequireAuth>
  );
}
