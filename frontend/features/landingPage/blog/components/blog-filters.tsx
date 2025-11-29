"use client"

import {Search, SortAsc} from "lucide-react"
import {Input} from "@/components/ui/input"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"

interface BlogFiltersProps {
    searchQuery: string
    onSearchChange: (query: string) => void
    sortBy: string
    onSortChange: (sort: string) => void
}

export function BlogFilters({searchQuery, onSearchChange, sortBy, onSortChange}: BlogFiltersProps) {
    return (
        <div className="bg-card border rounded-lg p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search Input */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"/>
                    <Input
                        type="text"
                        placeholder="Hľadať v článkoch..."
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {/* Sort Select */}
                <Select value={sortBy} onValueChange={onSortChange}>
                    <SelectTrigger>
                        <SortAsc className="w-4 h-4 mr-2"/>
                        <SelectValue placeholder="Zoradiť podľa"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="newest">Najnovšie</SelectItem>
                        <SelectItem value="oldest">Najstaršie</SelectItem>
                        <SelectItem value="title-asc">Názov (A-Z)</SelectItem>
                        <SelectItem value="title-desc">Názov (Z-A)</SelectItem>
                        <SelectItem value="reading-time">Čas čítania</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Active filters display */}
            {searchQuery && (
                <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Hľadám:</span>
                    <div
                        className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                        {searchQuery}
                        <button
                            onClick={() => onSearchChange("")}
                            className="hover:text-primary/70 transition-colors"
                            aria-label="Zrušiť vyhľadávanie"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
