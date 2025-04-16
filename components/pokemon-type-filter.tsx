"use client"

import { Check, ChevronDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface PokemonTypeFilterProps {
  selectedType: string | null
  setSelectedType: (type: string | null) => void
}

export default function PokemonTypeFilter({ selectedType, setSelectedType }: PokemonTypeFilterProps) {
  const pokemonTypes = [
    "normal",
    "fire",
    "water",
    "electric",
    "grass",
    "ice",
    "fighting",
    "poison",
    "ground",
    "flying",
    "psychic",
    "bug",
    "rock",
    "ghost",
    "dragon",
    "dark",
    "steel",
    "fairy",
  ]

  // Get type colors for styling
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      normal: "bg-gray-400",
      fire: "bg-orange-500",
      water: "bg-blue-500",
      electric: "bg-yellow-400",
      grass: "bg-green-500",
      ice: "bg-cyan-300",
      fighting: "bg-red-700",
      poison: "bg-purple-600",
      ground: "bg-amber-600",
      flying: "bg-indigo-300",
      psychic: "bg-pink-500",
      bug: "bg-lime-500",
      rock: "bg-yellow-700",
      ghost: "bg-purple-800",
      dragon: "bg-indigo-700",
      dark: "bg-stone-700",
      steel: "bg-slate-400",
      fairy: "bg-pink-300",
    }
    return typeColors[type] || "bg-gray-400"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedType ? <span className="capitalize">{selectedType} Type</span> : "Filter by Type"}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem onClick={() => setSelectedType(null)}>
          <span className="flex items-center">
            {!selectedType && <Check className="mr-2 h-4 w-4" />}
            All Types
          </span>
        </DropdownMenuItem>
        {pokemonTypes.map((type) => (
          <DropdownMenuItem key={type} onClick={() => setSelectedType(type)} className="capitalize">
            <span className="flex items-center">
              {selectedType === type && <Check className="mr-2 h-4 w-4" />}
              <span className={`w-3 h-3 rounded-full mr-2 ${getTypeColor(type)}`}></span>
              {type}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
