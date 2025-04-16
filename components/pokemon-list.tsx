"use client"

import type { Pokemon } from "@/types/pokemon"
import { Loader2 } from "lucide-react"

interface PokemonListProps {
  pokemon: Pokemon[]
  selectedPokemonId: number | null
  setSelectedPokemonId: (id: number) => void
  isLoading: boolean
  error: string | null
}

export default function PokemonList({
  pokemon,
  selectedPokemonId,
  setSelectedPokemonId,
  isLoading,
  error,
}: PokemonListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
        <p className="mt-2 text-gray-600">Loading Pokémon...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
      </div>
    )
  }

  if (pokemon.length === 0) {
    return (
      <div className="p-4 bg-yellow-100 text-yellow-700 rounded-md">
        <p>No Pokémon found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="h-[500px] overflow-y-auto pr-1 custom-scrollbar">
      <ul className="space-y-1">
        {pokemon.map((p) => (
          <li
            key={p.id}
            className={`flex items-center p-2 rounded-md cursor-pointer transition-all ${
              selectedPokemonId === p.id ? "bg-red-500 text-white font-medium" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedPokemonId(p.id)}
          >
            <div className="w-10 h-10 mr-2 flex-shrink-0 bg-gray-200 rounded-full overflow-hidden">
              <img
                src={p.sprites.default || "/placeholder.svg"}
                alt={p.name}
                className="w-full h-full object-contain"
              />
            </div>
            <span className="capitalize">
              #{p.id.toString().padStart(3, "0")} {p.name}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
