"use client"

import { useState, useEffect } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import {
  ChevronDown,
  ChevronUp,
  List,
  Grid,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { getTypeColor } from "@/lib/utils"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onSelectPokemon: (id: number) => void
  currentPokemonId: number | null
}

export default function Sidebar({ onSelectPokemon, currentPokemonId }: SidebarProps) {
  const {
    getPokemonList,
    currentPage,
    setCurrentPage,
    totalPages,
    viewMode,
    setViewMode,
    filters,
    updateFilters,
    favorites,
    toggleFavorite,
    isLoading,
  } = usePokemon()

  const [pokemonList, setPokemonList] = useState<any[]>([])
  const [expandedFilters, setExpandedFilters] = useState({
    basic: true,
    advanced: false,
  })
  const [localFilters, setLocalFilters] = useState(filters)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)

  // Fetch Pokémon list when page or filters change
  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoadingList(true)
      try {
        const data = await getPokemonList(currentPage)
        setPokemonList(data.results)
        setIsLoadingList(false)
      } catch (error) {
        console.error("Error fetching Pokémon list:", error)
        setIsLoadingList(false)
      }
    }

    fetchPokemon()
  }, [currentPage, filters, getPokemonList])

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) => {
      if (prev.includes(type)) {
        return prev.filter((t) => t !== type)
      } else {
        return [...prev, type]
      }
    })
  }

  const applyFilters = () => {
    updateFilters({
      ...localFilters,
      types: selectedTypes,
    })
  }

  const resetFilters = () => {
    setLocalFilters({
      search: "",
      generation: "",
      types: [],
      favorites: false,
      legendary: false,
      mega: false,
      forms: false,
      minStats: {
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      },
      ability: "",
    })
    setSelectedTypes([])
    updateFilters({
      search: "",
      generation: "",
      types: [],
      favorites: false,
      legendary: false,
      mega: false,
      forms: false,
      minStats: {
        hp: 0,
        attack: 0,
        defense: 0,
        speed: 0,
      },
      ability: "",
    })
  }

  const toggleFilterSection = (section: "basic" | "advanced") => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const renderPokemonItem = (pokemon: any) => {
    const id = pokemon.id || pokemon.url?.split("/").filter(Boolean).pop()
    const name = pokemon.name
    const isFavorite = favorites.includes(Number(id))

    if (viewMode === "list") {
      return (
        <li
          key={id}
          className={cn(
            "flex items-center p-3 rounded-md cursor-pointer transition-all hover:bg-accent",
            currentPokemonId === Number(id) && "bg-accent border-primary",
          )}
          onClick={() => onSelectPokemon(Number(id))}
        >
          <div className="w-12 h-12 bg-accent/50 rounded-full flex items-center justify-center mr-3">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
              alt={name}
              className="w-10 h-10"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect width="40" height="40" fill="%23ddd"/><text x="50%" y="50%" fontFamily="Arial" fontSize="12" textAnchor="middle" dy=".3em">?</text></svg>'
              }}
            />
          </div>

          <div className="flex-1">
            <div className="font-medium capitalize">{name}</div>
            <div className="text-sm text-muted-foreground">#{String(id).padStart(3, "0")}</div>

            {pokemon.types && (
              <div className="flex gap-1 mt-1">
                {pokemon.types.map((typeInfo: any) => (
                  <div
                    key={typeInfo.type.name}
                    className={cn("w-5 h-5 rounded-full", getTypeColor(typeInfo.type.name))}
                    title={typeInfo.type.name}
                  />
                ))}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={cn("text-muted-foreground", isFavorite && "text-yellow-500")}
            onClick={(e) => {
              e.stopPropagation()
              toggleFavorite(Number(id))
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isFavorite ? "currentColor" : "none"}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
              />
            </svg>
          </Button>
        </li>
      )
    } else {
      return (
        <div
          key={id}
          className={cn(
            "bg-card p-3 rounded-md cursor-pointer transition-all hover:shadow-md text-center relative",
            currentPokemonId === Number(id) && "border-2 border-primary",
          )}
          onClick={() => onSelectPokemon(Number(id))}
        >
          {isFavorite && (
            <div className="absolute top-1 right-1 text-yellow-500">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path
                  fillRule="evenodd"
                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          <div className="flex justify-center">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`}
              alt={name}
              className="w-16 h-16"
              onError={(e) => {
                ;(e.target as HTMLImageElement).src =
                  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60"><rect width="60" height="60" fill="%23ddd"/><text x="50%" y="50%" fontFamily="Arial" fontSize="12" textAnchor="middle" dy=".3em">?</text></svg>'
              }}
            />
          </div>

          <div className="mt-2 font-medium capitalize truncate">{name}</div>
          <div className="text-xs text-muted-foreground">#{String(id).padStart(3, "0")}</div>

          {pokemon.types && (
            <div className="flex gap-1 mt-1 justify-center">
              {pokemon.types.map((typeInfo: any) => (
                <div
                  key={typeInfo.type.name}
                  className={cn("w-4 h-4 rounded-full", getTypeColor(typeInfo.type.name))}
                  title={typeInfo.type.name}
                />
              ))}
            </div>
          )}
        </div>
      )
    }
  }

  return (
    <aside className="w-full md:w-72 lg:w-80 border-r bg-card flex flex-col h-[calc(100vh-3.5rem)] md:h-[calc(100vh-3.5rem)]">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="font-semibold">Pokémon List</h2>
        <div className="flex gap-1">
          <Button
            variant={viewMode === "list" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            title="List view"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "grid" ? "secondary" : "outline"}
            size="icon"
            onClick={() => setViewMode("grid")}
            title="Grid view"
          >
            <Grid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {/* Basic Filters */}
        <div className="mb-4 bg-background/50 rounded-md border">
          <div
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleFilterSection("basic")}
          >
            <h3 className="font-medium">Basic Filters</h3>
            {expandedFilters.basic ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedFilters.basic && (
            <div className="p-3 border-t">
              <div className="mb-3">
                <label className="text-sm text-muted-foreground block mb-1">Generation</label>
                <Select
                  value={localFilters.generation}
                  onValueChange={(value) => setLocalFilters((prev) => ({ ...prev, generation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Generations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Generations</SelectItem>
                    <SelectItem value="1">Generation I</SelectItem>
                    <SelectItem value="2">Generation II</SelectItem>
                    <SelectItem value="3">Generation III</SelectItem>
                    <SelectItem value="4">Generation IV</SelectItem>
                    <SelectItem value="5">Generation V</SelectItem>
                    <SelectItem value="6">Generation VI</SelectItem>
                    <SelectItem value="7">Generation VII</SelectItem>
                    <SelectItem value="8">Generation VIII</SelectItem>
                    <SelectItem value="9">Generation IX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="mb-3">
                <label className="text-sm text-muted-foreground block mb-1">Type</label>
                <div className="flex flex-wrap gap-1">
                  {[
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
                  ].map((type) => (
                    <div
                      key={type}
                      className={cn(
                        "px-2 py-1 rounded-full text-xs uppercase text-white cursor-pointer transition-all",
                        getTypeColor(type),
                        selectedTypes.includes(type)
                          ? "ring-2 ring-white ring-offset-1 ring-offset-background"
                          : "opacity-60",
                      )}
                      onClick={() => handleTypeToggle(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="favorites-only"
                  checked={localFilters.favorites}
                  onCheckedChange={(checked) => setLocalFilters((prev) => ({ ...prev, favorites: checked === true }))}
                />
                <label
                  htmlFor="favorites-only"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Show favorites only
                </label>
              </div>
            </div>
          )}
        </div>

        {/* Advanced Filters */}
        <div className="mb-4 bg-background/50 rounded-md border">
          <div
            className="flex justify-between items-center p-3 cursor-pointer"
            onClick={() => toggleFilterSection("advanced")}
          >
            <h3 className="font-medium">Advanced Filters</h3>
            {expandedFilters.advanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </div>

          {expandedFilters.advanced && (
            <div className="p-3 border-t">
              <div className="mb-3">
                <label className="text-sm text-muted-foreground block mb-1">Minimum Stats</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">HP: {localFilters.minStats.hp}</label>
                    <Slider
                      value={[localFilters.minStats.hp]}
                      min={0}
                      max={255}
                      step={5}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minStats: { ...prev.minStats, hp: value[0] },
                        }))
                      }
                      className="my-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Attack: {localFilters.minStats.attack}</label>
                    <Slider
                      value={[localFilters.minStats.attack]}
                      min={0}
                      max={255}
                      step={5}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minStats: { ...prev.minStats, attack: value[0] },
                        }))
                      }
                      className="my-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Defense: {localFilters.minStats.defense}</label>
                    <Slider
                      value={[localFilters.minStats.defense]}
                      min={0}
                      max={255}
                      step={5}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minStats: { ...prev.minStats, defense: value[0] },
                        }))
                      }
                      className="my-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Speed: {localFilters.minStats.speed}</label>
                    <Slider
                      value={[localFilters.minStats.speed]}
                      min={0}
                      max={255}
                      step={5}
                      onValueChange={(value) =>
                        setLocalFilters((prev) => ({
                          ...prev,
                          minStats: { ...prev.minStats, speed: value[0] },
                        }))
                      }
                      className="my-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <label className="text-sm text-muted-foreground block mb-1">Ability</label>
                <Input
                  placeholder="Filter by ability..."
                  value={localFilters.ability}
                  onChange={(e) => setLocalFilters((prev) => ({ ...prev, ability: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="legendary-only"
                    checked={localFilters.legendary}
                    onCheckedChange={(checked) => setLocalFilters((prev) => ({ ...prev, legendary: checked === true }))}
                  />
                  <label
                    htmlFor="legendary-only"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Legendary Pokémon only
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="mega-evolutions"
                    checked={localFilters.mega}
                    onCheckedChange={(checked) => setLocalFilters((prev) => ({ ...prev, mega: checked === true }))}
                  />
                  <label
                    htmlFor="mega-evolutions"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Include Mega Evolutions
                  </label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alternate-forms"
                    checked={localFilters.forms}
                    onCheckedChange={(checked) => setLocalFilters((prev) => ({ ...prev, forms: checked === true }))}
                  />
                  <label
                    htmlFor="alternate-forms"
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Show alternate forms
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between mb-4">
          <Button variant="outline" size="sm" onClick={resetFilters}>
            Reset Filters
          </Button>
          <Button size="sm" onClick={applyFilters}>
            Apply Filters
          </Button>
        </div>

        {/* Pokémon List */}
        {isLoadingList ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-muted-foreground">Loading Pokémon...</p>
          </div>
        ) : pokemonList.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No Pokémon found</p>
            <Button variant="link" onClick={resetFilters}>
              Clear filters
            </Button>
          </div>
        ) : (
          <div className={viewMode === "list" ? "space-y-2" : "grid grid-cols-2 gap-2"}>
            {viewMode === "list" ? (
              <ul>{pokemonList.map((pokemon) => renderPokemonItem(pokemon))}</ul>
            ) : (
              pokemonList.map((pokemon) => renderPokemonItem(pokemon))
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="p-3 border-t flex justify-between items-center">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(1)}
            title="First Page"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            title="Previous Page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            title="Next Page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(totalPages)}
            title="Last Page"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  )
}
