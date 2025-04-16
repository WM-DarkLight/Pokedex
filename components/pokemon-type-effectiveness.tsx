"use client"

import { useState, useEffect } from "react"
import { calculateTypeEffectiveness, getTypeColor, getEffectivenessText, getEffectivenessClass } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PokemonTypeEffectivenessProps {
  types: string[]
}

export default function PokemonTypeEffectiveness({ types }: PokemonTypeEffectivenessProps) {
  const [effectiveness, setEffectiveness] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    const typeEffectiveness = calculateTypeEffectiveness(types)
    setEffectiveness(typeEffectiveness)
  }, [types])

  // Group effectiveness by value
  const groupedEffectiveness: { [key: string]: string[] } = {
    "0": [],
    "0.25": [],
    "0.5": [],
    "2": [],
    "4": [],
  }

  Object.entries(effectiveness).forEach(([type, value]) => {
    if (value !== 1) {
      const key = value.toString()
      if (!groupedEffectiveness[key]) {
        groupedEffectiveness[key] = []
      }
      groupedEffectiveness[key].push(type)
    }
  })

  return (
    <div className="space-y-4">
      {Object.entries(groupedEffectiveness).map(([value, types]) => {
        if (types.length === 0) return null

        return (
          <div key={value} className="space-y-2">
            <h3 className={cn("font-medium", getEffectivenessClass(Number.parseFloat(value)))}>
              {getEffectivenessText(Number.parseFloat(value))} ({value}x)
            </h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Badge key={type} className={cn("uppercase", getTypeColor(type))}>
                  {type}
                </Badge>
              ))}
            </div>
          </div>
        )
      })}

      {Object.values(groupedEffectiveness).every((group) => group.length === 0) && (
        <p className="text-muted-foreground">No special type effectiveness.</p>
      )}
    </div>
  )
}
