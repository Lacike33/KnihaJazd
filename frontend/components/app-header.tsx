"use client";

import { MobileSidebar } from "./app-sidebar";
import { useAuth } from "@/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        {onMenuClick && (
          <Button variant="ghost" size="icon" className="hidden lg:flex" onClick={onMenuClick}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <MobileSidebar />
        <div className="flex flex-1 items-center justify-between">
          <div className="text-sm text-muted-foreground lg:hidden">Kniha jázd</div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden text-sm md:block">
              <span className="text-muted-foreground">{user?.organization_name}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
