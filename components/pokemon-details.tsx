"use client"

import { useState, useEffect } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/toast"
import { Star, Shuffle, Scale, Users, Info, Activity, Dna, Zap } from "lucide-react"
import { formatId, formatHeight, formatWeight, getGeneration, getTypeColor } from "@/lib/utils"
import PokemonEvolutions from "./pokemon-evolutions"
import PokemonMoves from "./pokemon-moves"
import PokemonStats from "./pokemon-stats"
import PokemonTypeEffectiveness from "./pokemon-type-effectiveness"

interface PokemonDetailsProps {
  pokemonId: number
  onEvolutionClick: (id: number) => void
}

export default function PokemonDetails({ pokemonId, onEvolutionClick }: PokemonDetailsProps) {
  const { getPokemon, getSpecies, favorites, toggleFavorite, updateTeam, updateCompare, team, settings } = usePokemon()
  const { toast } = useToast()

  const [pokemon, setPokemon] = useState<any>(null)
  const [species, setSpecies] = useState<any>(null)
  const [activeSprite, setActiveSprite] = useState<string>("default")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPokemonData = async () => {
      setIsLoading(true)
      setError(null)

      try {
        // Fetch Pokémon data
        const pokemonData = await getPokemon(pokemonId)
        setPokemon(pokemonData)

        // Fetch species data
        const speciesData = await getSpecies(pokemonId)
        setSpecies(speciesData)

        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching Pokémon details:", err)
        setError("Failed to load Pokémon data. Please try again.")
        setIsLoading(false)
      }
    }

    fetchPokemonData()
  }, [pokemonId, getPokemon, getSpecies])

  const handleToggleFavorite = () => {
    toggleFavorite(pokemonId)

    if (favorites.includes(pokemonId)) {
      toast({
        title: "Removed from favorites",
        description: `${pokemon?.name} has been removed from your favorites.`,
      })
    } else {
      toast({
        title: "Added to favorites",
        description: `${pokemon?.name} has been added to your favorites.`,
      })
    }
  }

  const handleAddToTeam = () => {
    // Find first empty slot
    const emptySlot = team.findIndex((slot) => slot === null)

    if (emptySlot === -1) {
      toast({
        title: "Team is full",
        description: "Your team already has 6 Pokémon. Remove one to add another.",
        variant: "destructive",
      })
      return
    }

    updateTeam(emptySlot, pokemon)
    toast({
      title: "Added to team",
      description: `${pokemon?.name} has been added to your team.`,
    })
  }

  const handleAddToCompare = () => {
    // Add to first empty compare slot
    if (updateCompare) {
      updateCompare(0, pokemon)
      toast({
        title: "Added to comparison",
        description: `${pokemon?.name} has been added to the comparison.`,
      })
    }
  }

  const handleRandomPokemon = () => {
    const randomId = Math.floor(Math.random() * 1008) + 1
    window.location.href = `?id=${randomId}`
  }

  const getAvailableSprites = () => {
    if (!pokemon) return []

    const sprites = []

    if (pokemon.sprites.front_default) {
      sprites.push({
        id: "default",
        name: "Default",
        url: pokemon.sprites.front_default,
      })
    }

    if (pokemon.sprites.front_shiny) {
      sprites.push({
        id: "shiny",
        name: "Shiny",
        url: pokemon.sprites.front_shiny,
      })
    }

    // Add animated sprites if available
    if (pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_default) {
      sprites.push({
        id: "animated",
        name: "Animated",
        url: pokemon.sprites.versions["generation-v"]["black-white"].animated.front_default,
      })
    }

    if (pokemon.sprites.versions?.["generation-v"]?.["black-white"]?.animated?.front_shiny) {
      sprites.push({
        id: "animated-shiny",
        name: "Animated Shiny",
        url: pokemon.sprites.versions["generation-v"]["black-white"].animated.front_shiny,
      })
    }

    return sprites
  }

  const getDescription = () => {
    if (!species) return "Loading description..."

    // Find English flavor text
    const englishEntry = species.flavor_text_entries.find(
      (entry: any) => entry.language.name === settings.language || entry.language.name === "en",
    )

    if (englishEntry) {
      return englishEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ").replace(/\r/g, " ").replace(/\v/g, " ")
    }

    return "No description available."
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-medium">Loading Pokémon data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-destructive mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2">Error Loading Data</h2>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    )
  }

  if (!pokemon || !species) {
    return null
  }

  const isFavorite = favorites.includes(pokemonId)
  const availableSprites = getAvailableSprites()
  const currentSprite = availableSprites.find((sprite) => sprite.id === activeSprite) || availableSprites[0]

  return (
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold capitalize">{pokemon.name}</h1>
          <span className="text-xl text-muted-foreground">{formatId(pokemon.id)}</span>
        </div>

        <div className="flex gap-2 mt-2 md:mt-0">
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={handleToggleFavorite}
            className={isFavorite ? "bg-yellow-500 hover:bg-yellow-600" : ""}
          >
            <Star className="mr-2 h-4 w-4" />
            {isFavorite ? "Favorited" : "Favorite"}
          </Button>

          <Button variant="outline" onClick={handleAddToTeam}>
            <Users className="mr-2 h-4 w-4" />
            Add to Team
          </Button>

          <Button variant="outline" onClick={handleAddToCompare}>
            <Scale className="mr-2 h-4 w-4" />
            Compare
          </Button>

          <Button variant="outline" onClick={handleRandomPokemon}>
            <Shuffle className="mr-2 h-4 w-4" />
            Random
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="bg-accent/30 rounded-lg p-6 flex items-center justify-center mb-4">
                <img
                  src={currentSprite?.url || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className="w-48 h-48 object-contain"
                />
              </div>

              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {availableSprites.map((sprite) => (
                  <Button
                    key={sprite.id}
                    variant={activeSprite === sprite.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSprite(sprite.id)}
                    className="relative p-1 h-12 w-12"
                  >
                    <img
                      src={sprite.url || "/placeholder.svg"}
                      alt={sprite.name}
                      title={sprite.name}
                      className="w-full h-full object-contain"
                    />
                  </Button>
                ))}
              </div>

              <div className="flex justify-center gap-2 mb-4">
                {pokemon.types.map((typeInfo: any) => (
                  <Badge
                    key={typeInfo.type.name}
                    className={`${getTypeColor(typeInfo.type.name)} text-white uppercase px-3 py-1`}
                  >
                    {typeInfo.type.name}
                  </Badge>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-accent/20 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Height</div>
                  <div className="font-medium">{formatHeight(pokemon.height, settings.units)}</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Weight</div>
                  <div className="font-medium">{formatWeight(pokemon.weight, settings.units)}</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Base Exp</div>
                  <div className="font-medium">{pokemon.base_experience || "N/A"}</div>
                </div>
                <div className="bg-accent/20 p-3 rounded-md text-center">
                  <div className="text-sm text-muted-foreground">Generation</div>
                  <div className="font-medium">{getGeneration(pokemon.id)}</div>
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-medium mb-2">Abilities</h3>
                <div className="space-y-2">
                  {pokemon.abilities.map((abilityInfo: any) => (
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
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="stats">
            <TabsList className="grid grid-cols-4">
              <TabsTrigger value="stats">
                <Activity className="h-4 w-4 mr-2" />
                Stats
              </TabsTrigger>
              <TabsTrigger value="evolution">
                <Dna className="h-4 w-4 mr-2" />
                Evolution
              </TabsTrigger>
              <TabsTrigger value="moves">
                <Zap className="h-4 w-4 mr-2" />
                Moves
              </TabsTrigger>
              <TabsTrigger value="about">
                <Info className="h-4 w-4 mr-2" />
                About
              </TabsTrigger>
            </TabsList>

            <TabsContent value="stats" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Base Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <PokemonStats stats={pokemon.stats} />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Type Effectiveness</CardTitle>
                </CardHeader>
                <CardContent>
                  <PokemonTypeEffectiveness types={pokemon.types.map((t: any) => t.type.name)} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="evolution">
              <Card>
                <CardHeader>
                  <CardTitle>Evolution Chain</CardTitle>
                </CardHeader>
                <CardContent>
                  <PokemonEvolutions
                    speciesId={pokemon.id}
                    evolutionChainUrl={species.evolution_chain.url}
                    onEvolutionClick={onEvolutionClick}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="moves">
              <Card>
                <CardHeader>
                  <CardTitle>Moves</CardTitle>
                </CardHeader>
                <CardContent>
                  <PokemonMoves moves={pokemon.moves} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{getDescription()}</p>
                </CardContent>
              </Card>

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Habitat</h4>
                      <p className="capitalize">{species.habitat?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Shape</h4>
                      <p className="capitalize">{species.shape?.name || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Growth Rate</h4>
                      <p className="capitalize">{species.growth_rate?.name.replace("-", " ") || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Capture Rate</h4>
                      <p>{species.capture_rate || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Base Happiness</h4>
                      <p>{species.base_happiness || "Unknown"}</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-muted-foreground mb-1">Egg Groups</h4>
                      <p className="capitalize">
                        {species.egg_groups?.map((g: any) => g.name).join(", ") || "Unknown"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    {species.is_legendary && (
                      <Badge variant="secondary" className="bg-yellow-500/20">
                        Legendary
                      </Badge>
                    )}
                    {species.is_mythical && (
                      <Badge variant="secondary" className="bg-purple-500/20">
                        Mythical
                      </Badge>
                    )}
                    {species.is_baby && (
                      <Badge variant="secondary" className="bg-pink-500/20">
                        Baby
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
