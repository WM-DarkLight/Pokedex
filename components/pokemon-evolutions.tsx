"use client"

import { useState, useEffect } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PokemonEvolutionsProps {
  speciesId: number
  evolutionChainUrl: string
  onEvolutionClick: (id: number) => void
}

export default function PokemonEvolutions({ speciesId, evolutionChainUrl, onEvolutionClick }: PokemonEvolutionsProps) {
  const { getEvolutionChain } = usePokemon()
  const [evolutionChain, setEvolutionChain] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvolutionChain = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const data = await getEvolutionChain(evolutionChainUrl)
        setEvolutionChain(data)
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching evolution chain:", err)
        setError("Failed to load evolution data")
        setIsLoading(false)
      }
    }

    fetchEvolutionChain()
  }, [evolutionChainUrl, getEvolutionChain])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-4 text-destructive">
        <p>{error}</p>
      </div>
    )
  }

  if (!evolutionChain || !evolutionChain.chain) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        <p>No evolution data available</p>
      </div>
    )
  }

  // Function to extract evolution details
  const getEvolutionDetails = (details: any) => {
    if (!details || details.length === 0) return "???"

    const detail = details[0]

    if (detail.min_level) {
      return `Level ${detail.min_level}`
    } else if (detail.item) {
      return `Use ${detail.item.name.replace(/-/g, " ")}`
    } else if (detail.trigger && detail.trigger.name === "trade") {
      return detail.held_item ? `Trade with ${detail.held_item.name.replace(/-/g, " ")}` : "Trade"
    } else if (detail.min_happiness) {
      return `Happiness (${detail.min_happiness}+)`
    } else if (detail.time_of_day) {
      return `Level up during ${detail.time_of_day}`
    } else {
      return "Special condition"
    }
  }

  // Function to extract Pokémon ID from URL
  const getIdFromUrl = (url: string) => {
    const parts = url.split("/")
    return Number.parseInt(parts[parts.length - 2])
  }

  // Recursive function to render evolution chain
  const renderEvolutionChain = (chain: any) => {
    const pokemonId = getIdFromUrl(chain.species.url)
    const isCurrentPokemon = pokemonId === speciesId

    return (
      <div key={chain.species.name} className="flex flex-col items-center">
        <div className={`flex flex-col items-center ${isCurrentPokemon ? "ring-2 ring-primary p-2 rounded-lg" : ""}`}>
          <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
              alt={chain.species.name}
              className="w-20 h-20"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=80&width=80"
              }}
            />
          </div>

          <div className="text-center mt-2">
            <Button variant="link" onClick={() => onEvolutionClick(pokemonId)} className="font-medium capitalize p-0">
              {chain.species.name.replace(/-/g, " ")}
            </Button>
            <div className="text-xs text-muted-foreground">#{pokemonId.toString().padStart(3, "0")}</div>
          </div>
        </div>

        {chain.evolves_to && chain.evolves_to.length > 0 && (
          <div className="flex flex-col items-center mt-2">
            {chain.evolves_to.map((evolution: any) => (
              <div key={evolution.species.name} className="flex flex-col items-center">
                <div className="flex flex-col items-center my-2">
                  <ChevronRight className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground text-center max-w-32">
                    {getEvolutionDetails(evolution.evolution_details)}
                  </span>
                </div>
                {renderEvolutionChain(evolution)}
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return <div className="flex flex-wrap justify-center gap-4">{renderEvolutionChain(evolutionChain.chain)}</div>
}
