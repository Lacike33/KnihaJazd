import { Badge } from "@/components/ui/badge"
import type { Role } from "@/lib/types"
import { Shield, Eye, Calculator, Car } from "lucide-react"

interface RoleBadgeProps {
  role: Role
}

const roleConfig = {
  admin: {
    label: "Admin",
    icon: Shield,
    className: "bg-red-500 hover:bg-red-600",
  },
  accountant: {
    label: "Účtovník",
    icon: Calculator,
    className: "bg-blue-500 hover:bg-blue-600",
  },
  driver: {
    label: "Vodič",
    icon: Car,
    className: "bg-green-500 hover:bg-green-600",
  },
  viewer: {
    label: "Pozorovateľ",
    icon: Eye,
    className: "bg-gray-500 hover:bg-gray-600",
  },
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const config = roleConfig[role]
  const Icon = config.icon

  return (
    <Badge variant="default" className={config.className}>
      <Icon className="h-3 w-3 mr-1" />
      {config.label}
    </Badge>
  )
}
