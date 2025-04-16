"use client"

import { useState, useEffect } from "react"
import { getStatColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface PokemonStatsProps {
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}

export default function PokemonStats({ stats }: PokemonStatsProps) {
  const [totalStat, setTotalStat] = useState(0)

  useEffect(() => {
    // Calculate total stat
    const total = stats.reduce((sum, stat) => sum + stat.base_stat, 0)
    setTotalStat(total)
  }, [stats])

  const getStatName = (name: string) => {
    const statNames: { [key: string]: string } = {
      hp: "HP",
      attack: "Attack",
      defense: "Defense",
      "special-attack": "Sp. Attack",
      "special-defense": "Sp. Defense",
      speed: "Speed",
    }

    return statNames[name] || name
  }

  const getStatPercentage = (value: number) => {
    // Max stat value is around 255, but we'll use 200 for better visualization
    return Math.min(100, (value / 200) * 100)
  }

  return (
    <div className="space-y-4">
      {stats.map((stat) => (
        <div key={stat.stat.name} className="flex items-center gap-4">
          <div className="w-24 font-medium text-sm">{getStatName(stat.stat.name)}</div>
          <div className="w-10 text-right font-bold">{stat.base_stat}</div>
          <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", getStatColor(stat.stat.name))}
              style={{ width: `${getStatPercentage(stat.base_stat)}%` }}
            ></div>
          </div>
        </div>
      ))}

      <div className="flex items-center gap-4 pt-2 border-t">
        <div className="w-24 font-medium text-sm">Total</div>
        <div className="w-10 text-right font-bold">{totalStat}</div>
        <div className="flex-1 h-2 bg-accent rounded-full overflow-hidden">
          <div
            className="bg-gray-500 h-full rounded-full"
            style={{ width: `${getStatPercentage(totalStat / 6)}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}
