"use client"

import { useState } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTypeColor, calculateTypeEffectiveness } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Plus, X, Info, Shield, Zap, Search } from "lucide-react"
import PokemonStats from "./pokemon-stats"

interface TeamBuilderProps {
  onSelectPokemon: (id: number) => void
}

export default function TeamBuilder({ onSelectPokemon }: TeamBuilderProps) {
  const { team, updateTeam, getPokemonList } = usePokemon()
  const [isSelectModalOpen, setIsSelectModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null)
  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPokemon, setSelectedPokemon] = useState<any | null>(null)

  // Team analysis
  const [teamAnalysis, setTeamAnalysis] = useState({
    weaknesses: {} as Record<string, number>,
    resistances: {} as Record<string, number>,
    coverageGaps: [] as string[],
    typeDistribution: {} as Record<string, number>,
  })

  // Handle opening the Pokémon selection modal
  const handleOpenSelectModal = (slot: number) => {
    setSelectedSlot(slot)
    setIsSelectModalOpen(true)
    loadPokemonList()
  }

  // Load Pokémon list for selection
  const loadPokemonList = async () => {
    setIsLoading(true)
    try {
      const data = await getPokemonList(currentPage)
      setPokemonList(data.results)
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading Pokémon list:", error)
      setIsLoading(false)
    }
  }

  // Handle Pokémon selection
  const handleSelectPokemon = (pokemon: any) => {
    if (selectedSlot !== null) {
      updateTeam(selectedSlot, pokemon)
      setIsSelectModalOpen(false)
      setSelectedSlot(null)
      analyzeTeam()
    }
  }

  // Handle removing a Pokémon from the team
  const handleRemovePokemon = (slot: number) => {
    updateTeam(slot, null)
    analyzeTeam()
  }

  // Analyze team for type coverage, weaknesses, etc.
  const analyzeTeam = () => {
    const weaknesses: Record<string, number> = {}
    const resistances: Record<string, number> = {}
    const typeDistribution: Record<string, number> = {}

    // Analyze each team member
    team.forEach((pokemon) => {
      if (!pokemon) return

      // Count type distribution
      pokemon.types.forEach((typeInfo: any) => {
        const typeName = typeInfo.type.name
        typeDistribution[typeName] = (typeDistribution[typeName] || 0) + 1

        // Calculate type effectiveness
        const effectiveness = calculateTypeEffectiveness([typeName])

        // Add weaknesses and resistances
        Object.entries(effectiveness).forEach(([defenderType, multiplier]) => {
          if (multiplier > 1) {
            weaknesses[defenderType] = (weaknesses[defenderType] || 0) + 1
          } else if (multiplier < 1) {
            resistances[defenderType] = (resistances[defenderType] || 0) + 1
          }
        })
      })
    })

    // Find coverage gaps (types that more than half the team is weak to)
    const coverageGaps = Object.entries(weaknesses)
      .filter(([type, count]) => count >= Math.ceil(team.filter(Boolean).length / 2))
      .map(([type]) => type)

    setTeamAnalysis({
      weaknesses,
      resistances,
      coverageGaps,
      typeDistribution,
    })
  }

  // Render a team slot
  const renderTeamSlot = (slot: number) => {
    const pokemon = team[slot]

    if (!pokemon) {
      return (
        <div
          className="bg-accent/30 rounded-lg h-40 flex items-center justify-center cursor-pointer hover:bg-accent/50 transition-colors"
          onClick={() => handleOpenSelectModal(slot)}
        >
          <div className="flex flex-col items-center">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <span className="text-muted-foreground">Add Pokémon</span>
          </div>
        </div>
      )
    }

    return (
      <div className="bg-card rounded-lg border p-4 relative">
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={() => handleRemovePokemon(slot)}
        >
          <X className="h-3 w-3" />
        </Button>

        <div className="flex flex-col items-center">
          <img
            src={pokemon.sprites.front_default || "/placeholder.svg"}
            alt={pokemon.name}
            className="w-24 h-24"
            onError={(e) => {
              ;(e.target as HTMLImageElement).src = "/placeholder.svg?height=96&width=96"
            }}
          />

          <h3 className="font-medium capitalize mt-1">{pokemon.name}</h3>
          <div className="text-xs text-muted-foreground">#{pokemon.id.toString().padStart(3, "0")}</div>

          <div className="flex gap-1 mt-2">
            {pokemon.types.map((typeInfo: any) => (
              <Badge key={typeInfo.type.name} className={cn("uppercase", getTypeColor(typeInfo.type.name))}>
                {typeInfo.type.name}
              </Badge>
            ))}
          </div>

          <Button
            variant="link"
            size="sm"
            className="mt-2 p-0 h-auto"
            onClick={() => {
              setSelectedPokemon(pokemon)
              onSelectPokemon(pokemon.id)
            }}
          >
            View Details
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <span className="text-2xl font-bold">Team Builder</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index}>{renderTeamSlot(index)}</div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Team Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="coverage">
            <TabsList>
              <TabsTrigger value="coverage">
                <Shield className="h-4 w-4 mr-2" />
                Type Coverage
              </TabsTrigger>
              <TabsTrigger value="weaknesses">
                <Zap className="h-4 w-4 mr-2" />
                Weaknesses
              </TabsTrigger>
              <TabsTrigger value="stats">
                <Info className="h-4 w-4 mr-2" />
                Team Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="coverage" className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Type Distribution</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(teamAnalysis.typeDistribution).map(([type, count]) => (
                    <div key={type} className="flex items-center">
                      <Badge className={cn("uppercase mr-1", getTypeColor(type))}>{type}</Badge>
                      <span className="text-sm">×{count}</span>
                    </div>
                  ))}

                  {Object.keys(teamAnalysis.typeDistribution).length === 0 && (
                    <p className="text-muted-foreground">Add Pokémon to your team to see type distribution</p>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Coverage Gaps</h3>
                {teamAnalysis.coverageGaps.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {teamAnalysis.coverageGaps.map((type) => (
                      <Badge key={type} variant="outline" className="uppercase">
                        {type}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    {team.some(Boolean)
                      ? "No significant coverage gaps detected"
                      : "Add Pokémon to your team to analyze coverage gaps"}
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="weaknesses">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Team Weaknesses</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(teamAnalysis.weaknesses)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <Badge className={cn("uppercase mr-1", getTypeColor(type))}>{type}</Badge>
                          <span className="text-sm">×{count}</span>
                        </div>
                      ))}

                    {Object.keys(teamAnalysis.weaknesses).length === 0 && (
                      <p className="text-muted-foreground">Add Pokémon to your team to see weaknesses</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Team Resistances</h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(teamAnalysis.resistances)
                      .sort((a, b) => b[1] - a[1])
                      .map(([type, count]) => (
                        <div key={type} className="flex items-center">
                          <Badge className={cn("uppercase mr-1", getTypeColor(type))}>{type}</Badge>
                          <span className="text-sm">×{count}</span>
                        </div>
                      ))}

                    {Object.keys(teamAnalysis.resistances).length === 0 && (
                      <p className="text-muted-foreground">Add Pokémon to your team to see resistances</p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="stats">
              <div className="space-y-4">
                <h3 className="font-medium">Team Stats Overview</h3>

                {team.some(Boolean) ? (
                  <div>
                    {/* Calculate and display average team stats */}
                    {team.filter(Boolean).length > 0 && (
                      <PokemonStats
                        stats={[
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "hp").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "hp" },
                          },
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "attack").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "attack" },
                          },
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "defense").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "defense" },
                          },
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "special-attack").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "special-attack" },
                          },
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "special-defense").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "special-defense" },
                          },
                          {
                            base_stat: Math.round(
                              team
                                .filter(Boolean)
                                .reduce(
                                  (sum, pokemon) =>
                                    sum + pokemon.stats.find((s: any) => s.stat.name === "speed").base_stat,
                                  0,
                                ) / team.filter(Boolean).length,
                            ),
                            stat: { name: "speed" },
                          },
                        ]}
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-muted-foreground">Add Pokémon to your team to see team stats</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Pokémon Selection Modal */}
      <Dialog open={isSelectModalOpen} onOpenChange={setIsSelectModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Select a Pokémon</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search Pokémon..."
                className="w-full p-2 pl-10 border rounded-md"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                        onClick={() => handleSelectPokemon(pokemon)}
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
