"use client"

import {Button} from "@/components/ui/button"
import {useState} from "react"

const categories = ["Všetky", "Legislatíva", "Finančné tipy", "Návody"]

interface BlogCategoriesProps {
    onCategoryChange: (category: string) => void
}

export function BlogCategories({onCategoryChange}: BlogCategoriesProps) {
    const [activeCategory, setActiveCategory] = useState("Všetky")

    const handleCategoryClick = (category: string) => {
        setActiveCategory(category)
        onCategoryChange(category)
    }

    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
                <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    onClick={() => handleCategoryClick(category)}
                    size="sm"
                >
                    {category}
                </Button>
            ))}
        </div>
    )
}
