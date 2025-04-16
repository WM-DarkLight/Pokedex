"use client"

import { useState, useEffect, useCallback } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTypeColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Plus, ArrowLeftRight, Activity, Dna, Info, Search } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

interface CompareScreenProps {
  onSelectPokemon: (id: number) => void
}

export default function CompareScreen({ onSelectPokemon }: CompareScreenProps) {
  const { comparePokemons, updateCompare, getPokemon, getPokemonList } = usePokemon()
  const [isLoading, setIsLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [selectedSlot, setSelectedSlot] = useState<0 | 1 | null>(null)
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)

  // Load Pokémon for comparison
  const handleSelectPokemon = async (id: number, slot: 0 | 1) => {
    setIsLoading(true)
    try {
      const pokemon = await getPokemon(id)
      updateCompare(slot, pokemon)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading Pokémon:", error)
      setIsLoading(false)
    }
  }

  // Swap the two Pokémon being compared
  const handleSwapPokemon = () => {
    if (comparePokemons[0] && comparePokemons[1]) {
      updateCompare(0, comparePokemons[1])
      updateCompare(1, comparePokemons[0])
    }
  }

  // Clear a comparison slot
  const handleClearSlot = (slot: 0 | 1) => {
    updateCompare(slot, null)
  }

  // Render a comparison slot
  const renderCompareSlot = (slot: 0 | 1) => {
    const pokemon = comparePokemons[slot]

    if (!pokemon) {
      return (
        <div
          className="bg-accent/30 rounded-lg h-64 flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => {
            setSelectedSlot(slot)
            setIsSelectModalOpen(true)
          }}
        >
          <div className="flex flex-col items-center">
            <Plus className="h-12 w-12 text-muted-foreground mb-2" />
            <span className="text-muted-foreground">Select Pokémon</span>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-card rounded-lg border p-4 h-full">
        <div className="flex flex-col items-center">
          <img
            src={pokemon.sprites.front_default || "/placeholder.svg"}
            alt={pokemon.name}
            className="w-32 h-32"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=128&width=128"
            }}
          />

          <h3 className="font-medium capitalize text-lg mt-2">{pokemon.name}</h3>
          <div className="text-sm text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</div>

          <div className="flex gap-2 mt-3">
            {pokemon.types.map((typeInfo: any) => (
              <Badge key={typeInfo.type.name} className={cn("uppercase", getTypeColor(typeInfo.type.name))}>
                {typeInfo.type.name}
              </Badge>
            ))}
          </div>

          <div className="flex gap-2 mt-4">
            <Button variant="outline" size="sm" onClick={() => onSelectPokemon(pokemon.id)}>
              View Details
            </Button>
            <Button variant="destructive" size="sm" onClick={() => handleClearSlot(slot)}>
              Clear
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Compare stats between the two Pokémon
  const compareStats = () => {
    if (!comparePokemons[0] || !comparePokemons[1]) return null

    const pokemon1 = comparePokemons[0]
    const pokemon2 = comparePokemons[1]

    const statNames = ["hp", "attack", "defense", "special-attack", "special-defense", "speed"]

    return (
      <div className="space-y-4">
        {statNames.map((statName) => {
          const stat1 = pokemon1.stats.find((s: any) => s.stat.name === statName)?.base_stat || 0
          const stat2 = pokemon2.stats.find((s: any) => s.stat.name === statName)?.base_stat || 0
          const diff = stat1 - stat2

          return (
            <div key={statName} className="grid grid-cols-9 gap-2 items-center">
              <div className="col-span-2 text-right font-medium">{stat1}</div>
              <div className="col-span-5 flex items-center justify-center">
                <div className="w-full h-6 bg-accent/30 rounded-full relative">
                  <div
                    className={cn(
                      "absolute top-0 bottom-0 rounded-full",
                      diff > 0 ? "bg-green-500 left-1/2" : "bg-red-500 right-1/2",
                    )}
                    style={{
                      width: `${Math.abs(diff) / 2}%`,
                      maxWidth: "50%",
                    }}
                  ></div>
                  <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
                    {statName.replace("-", " ")}
                    {diff !== 0 && (
                      <span className={diff > 0 ? "text-green-600" : "text-red-600"}>
                        {" "}
                        ({diff > 0 ? "+" : ""}
                        {diff})
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-span-2 font-medium">{stat2}</div>
            </div>
          )
        })}

        {/* Total stats comparison */}
        <div className="grid grid-cols-9 gap-2 items-center pt-2 border-t">
          <div className="col-span-2 text-right font-medium">
            {pokemon1.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)}
          </div>
          <div className="col-span-5 flex items-center justify-center">
            <div className="text-sm font-medium">Total</div>
          </div>
          <div className="col-span-2 font-medium">
            {pokemon2.stats.reduce((sum: number, stat: any) => sum + stat.base_stat, 0)}
          </div>
        </div>
      </div>
    )
  }

  // Add this function to load Pokémon list
  const loadPokemonList = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getPokemonList(1)
      setPokemonList(data.results)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading Pokémon list:", error)
      setIsLoading(false)
    }
  }, [getPokemonList])

  // Add this effect to load Pokémon when the modal opens
  useEffect(() => {
    if (isSelectModalOpen) {
      loadPokemonList()
    }
  }, [isSelectModalOpen, loadPokemonList])

  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">Compare Pokémon</span>

            {comparePokemons[0] && comparePokemons[1] && (
              <Button variant="outline" onClick={handleSwapPokemon} className="flex items-center">
                <ArrowLeftRight className="h-4 w-4 mr-2" />
                Swap
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderCompareSlot(0)}
            {renderCompareSlot(1)}
          </div>
        </CardContent>
      </Card>

      {comparePokemons[0] && comparePokemons[1] ? (
        <Card>
          <CardHeader>
            <CardTitle>Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="stats">
              <TabsList>
                <TabsTrigger value="stats">
                  <Activity className="h-4 w-4 mr-2" />
                  Stats
                </TabsTrigger>
                <TabsTrigger value="abilities">
                  <Dna className="h-4 w-4 mr-2" />
                  Abilities
                </TabsTrigger>
                <TabsTrigger value="details">
                  <Info className="h-4 w-4 mr-2" />
                  Details
                </TabsTrigger>
              </TabsList>

              <TabsContent value="stats" className="space-y-4">
                {compareStats()}
              </TabsContent>

              <TabsContent value="abilities">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3 capitalize">{comparePokemons[0].name}'s Abilities</h3>
                    <div className="space-y-2">
                      {comparePokemons[0].abilities.map((abilityInfo: any) => (
                        <div
                          key={abilityInfo.ability.name}
                          className="bg-accent/20 p-3 rounded-md flex items-center justify-between"
                        >
                          <div className="capitalize font-medium">{abilityInfo.ability.name.replace("-", " ")}</div>
                          {abilityInfo.is_hidden && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 capitalize">{comparePokemons[1].name}'s Abilities</h3>
                    <div className="space-y-2">
                      {comparePokemons[1].abilities.map((abilityInfo: any) => (
                        <div
                          key={abilityInfo.ability.name}
                          className="bg-accent/20 p-3 rounded-md flex items-center justify-between"
                        >
                          <div className="capitalize font-medium">{abilityInfo.ability.name.replace("-", " ")}</div>
                          {abilityInfo.is_hidden && (
                            <Badge variant="outline" className="text-xs">
                              Hidden
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium mb-3 capitalize">{comparePokemons[0].name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Height</div>
                        <div>{comparePokemons[0].height / 10} m</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Weight</div>
                        <div>{comparePokemons[0].weight / 10} kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Base Experience</div>
                        <div>{comparePokemons[0].base_experience || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium mb-3 capitalize">{comparePokemons[1].name}</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-muted-foreground">Height</div>
                        <div>{comparePokemons[1].height / 10} m</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Weight</div>
                        <div>{comparePokemons[1].weight / 10} kg</div>
                      </div>
                      <div>
                        <div className="text-sm text-muted-foreground">Base Experience</div>
                        <div>{comparePokemons[1].base_experience || "N/A"}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Select two Pokémon to compare their stats and abilities</p>
          </CardContent>
        </Card>
      )}

      {/* Pokémon Selection Modal */}
      <Dialog open={isSelectModalOpen} onOpenChange={setIsSelectModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select a Pokémon</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="relative mb-4">
              <Input
                type="text"
                placeholder="Search Pokémon..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>

            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-[400px] overflow-y-auto p-2">
                {pokemonList
                  .filter(
                    (pokemon) =>
                      !searchQuery ||
                      pokemon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      pokemon.url.split("/").filter(Boolean).pop().toString().includes(searchQuery),
                  )
                  .map((pokemon) => {
                    const id = pokemon.url.split("/").filter(Boolean).pop()
                    return (
                      <div
                        key={id}
                        className="bg-accent/20 p-3 rounded-md flex flex-col items-center cursor-pointer hover:bg-accent/40 transition-colors"
                        onClick={() => handleSelectPokemon(Number(id), selectedSlot as 0 | 1)}
                      >
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
                          alt={pokemon.name}
                          className="w-16 h-16"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=64&width=64"
                          }}
                        />
                        <div className="text-center mt-2">
                          <div className="font-medium capitalize">{pokemon.name}</div>
                          <div className="text-xs text-muted-foreground">#{id.toString().padStart(3, "0")}</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
