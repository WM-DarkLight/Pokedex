"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { initDatabase, dbOperations } from "@/lib/db"

export interface Pokemon {
  id: number
  name: string
  types: { type: { name: string } }[]
  sprites: any
  stats: { base_stat: number; stat: { name: string } }[]
  height: number
  weight: number
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  moves: any[]
  species: { url: string }
}

export interface PokemonSpecies {
  id: number
  flavor_text_entries: { flavor_text: string; language: { name: string } }[]
  evolution_chain: { url: string }
  generation: { name: string }
  habitat: { name: string } | null
  is_legendary: boolean
  is_mythical: boolean
}

export interface EvolutionChain {
  id: number
  chain: any
}

interface PokemonContextType {
  isLoading: boolean
  error: string | null
  favorites: number[]
  team: (Pokemon | null)[]
  comparePokemons: [Pokemon | null, Pokemon | null]
  settings: {
    darkMode: boolean
    animations: boolean
    offlineMode: boolean
    language: string
    units: string
  }
  filters: {
    search: string
    generation: string
    types: string[]
    favorites: boolean
    legendary: boolean
    mega: boolean
    forms: boolean
    minStats: {
      hp: number
      attack: number
      defense: number
      speed: number
    }
    ability: string
  }
  currentPage: number
  totalPages: number
  viewMode: "list" | "grid"
  getPokemon: (idOrName: number | string) => Promise<Pokemon>
  getSpecies: (idOrName: number | string) => Promise<PokemonSpecies>
  getEvolutionChain: (url: string) => Promise<EvolutionChain>
  getPokemonList: (page: number, filters?: any) => Promise<{ results: any[]; count: number }>
  toggleFavorite: (id: number) => void
  updateTeam: (index: number, pokemon: Pokemon | null) => void
  updateCompare: (index: 0 | 1, pokemon: Pokemon | null) => void
  updateSettings: (newSettings: any) => void
  updateFilters: (newFilters: any) => void
  setCurrentPage: (page: number) => void
  setViewMode: (mode: "list" | "grid") => void
  clearCache: () => Promise<void>
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined)

export function PokemonProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<number[]>([])
  const [team, setTeam] = useState<(Pokemon | null)[]>(Array(6).fill(null))
  const [comparePokemons, setComparePokemons] = useState<[Pokemon | null, Pokemon | null]>([null, null])
  const [settings, setSettings] = useState({
    darkMode: false,
    animations: true,
    offlineMode: true,
    language: "en",
    units: "metric",
  })
  const [filters, setFilters] = useState({
    search: "",
    generation: "",
    types: [] as string[],
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
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(Math.ceil(1008 / 20))
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")
  const [dbInitialized, setDbInitialized] = useState(false)

  // Load settings from localStorage only on the client side
  useEffect(() => {
    // Check for dark mode preference in localStorage
    try {
      const storedDarkMode = localStorage.getItem("darkMode") === "true"
      setSettings((prev) => ({ ...prev, darkMode: storedDarkMode }))

      // Check for view mode preference
      const storedViewMode = localStorage.getItem("viewMode")
      if (storedViewMode === "grid" || storedViewMode === "list") {
        setViewMode(storedViewMode)
      }
    } catch (e) {
      console.error("Error reading from localStorage:", e)
    }
  }, [])

  // Initialize database
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase()
        setDbInitialized(true)

        // Load favorites
        const storedFavorites = await dbOperations.getAll("favorites")
        if (storedFavorites && storedFavorites.length > 0) {
          setFavorites(storedFavorites.map((f) => f.id))
        }

        // Load team
        const storedTeam = await dbOperations.get("teams", "current")
        if (storedTeam && storedTeam.members) {
          const teamMembers = await Promise.all(
            storedTeam.members.map(async (member: number | null) => {
              if (member === null) return null
              try {
                return await getPokemon(member)
              } catch (e) {
                return null
              }
            }),
          )
          setTeam(teamMembers)
        }

        // Load settings
        const storedSettings = await dbOperations.get("settings", "user")
        if (storedSettings) {
          setSettings((prev) => ({ ...prev, ...storedSettings }))
        }

        setIsLoading(false)
      } catch (err) {
        console.error("Failed to initialize database:", err)
        setError("Failed to initialize database. Some features may not work properly.")
        setIsLoading(false)
      }
    }

    init()
  }, [])

  // API functions
  const API_URL = "https://pokeapi.co/api/v2/"

  const fetchWithCache = async (endpoint: string, storeName: string, id: number | string) => {
    // Try to get from IndexedDB first
    if (settings.offlineMode && dbInitialized) {
      try {
        const cachedData = await dbOperations.get(storeName, id)
        if (cachedData) {
          return cachedData
        }
      } catch (error) {
        console.error("Error getting from cache:", error)
      }
    }

    // Fetch from API if not in cache
    try {
      const response = await fetch(`${API_URL}${endpoint}`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      // Store in IndexedDB if offline mode is enabled
      if (settings.offlineMode && dbInitialized) {
        try {
          await dbOperations.put(storeName, { id, ...data })
        } catch (error) {
          console.error("Error caching data:", error)
        }
      }

      return data
    } catch (error) {
      console.error("Fetch error:", error)
      throw error
    }
  }

  const getPokemon = async (idOrName: number | string): Promise<Pokemon> => {
    return fetchWithCache(`pokemon/${idOrName}`, "pokemon", idOrName)
  }

  const getSpecies = async (idOrName: number | string): Promise<PokemonSpecies> => {
    return fetchWithCache(`pokemon-species/${idOrName}`, "species", idOrName)
  }

  const getEvolutionChain = async (url: string): Promise<EvolutionChain> => {
    const id = url.split("/").filter(Boolean).pop()
    if (!id) throw new Error("Invalid evolution chain URL")
    return fetchWithCache(`evolution-chain/${id}`, "evolution", id)
  }

  const getPokemonList = async (page: number, filterOptions = filters) => {
    const limit = 20
    const offset = (page - 1) * limit

    try {
      // If we have filters, we need to fetch all Pokémon and filter them
      if (
        filterOptions.search ||
        filterOptions.types.length > 0 ||
        filterOptions.favorites ||
        filterOptions.legendary ||
        filterOptions.minStats.hp > 0 ||
        filterOptions.minStats.attack > 0 ||
        filterOptions.minStats.defense > 0 ||
        filterOptions.minStats.speed > 0 ||
        filterOptions.ability
      ) {
        // Fetch all Pokémon (or use cached data)
        let allPokemon = []

        if (settings.offlineMode && dbInitialized) {
          try {
            allPokemon = await dbOperations.getAll("pokemon")
          } catch (err) {
            console.error("Error getting Pokémon from cache:", err)
          }
        }

        // If we don't have cached data, fetch from API
        if (allPokemon.length === 0) {
          const response = await fetch(`${API_URL}pokemon?limit=1008`)
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`)
          }
          const data = await response.json()
          allPokemon = data.results
        }

        // Apply filters
        let filteredPokemon = allPokemon

        // Search filter
        if (filterOptions.search) {
          const searchTerm = filterOptions.search.toLowerCase()
          filteredPokemon = filteredPokemon.filter((pokemon: any) => {
            const name = pokemon.name.toLowerCase()
            const id = pokemon.id || pokemon.url.split("/").filter(Boolean).pop()
            return name.includes(searchTerm) || id.toString() === searchTerm
          })
        }

        // Generation filter
        if (filterOptions.generation) {
          const genRanges: { [key: string]: [number, number] } = {
            "1": [1, 151],
            "2": [152, 251],
            "3": [252, 386],
            "4": [387, 493],
            "5": [494, 649],
            "6": [650, 721],
            "7": [722, 809],
            "8": [810, 905],
            "9": [906, 1008],
          }

          const range = genRanges[filterOptions.generation]
          if (range) {
            filteredPokemon = filteredPokemon.filter((pokemon: any) => {
              const id = pokemon.id || pokemon.url.split("/").filter(Boolean).pop()
              return id >= range[0] && id <= range[1]
            })
          }
        }

        // Favorites filter
        if (filterOptions.favorites) {
          filteredPokemon = filteredPokemon.filter((pokemon: any) => {
            const id = pokemon.id || pokemon.url.split("/").filter(Boolean).pop()
            return favorites.includes(Number(id))
          })
        }

        // For more complex filters (type, stats, etc.), we need to fetch details for each Pokémon
        if (
          filterOptions.types.length > 0 ||
          filterOptions.legendary ||
          filterOptions.minStats.hp > 0 ||
          filterOptions.minStats.attack > 0 ||
          filterOptions.minStats.defense > 0 ||
          filterOptions.minStats.speed > 0 ||
          filterOptions.ability
        ) {
          // This would be inefficient in a real app, but for demonstration purposes:
          const detailedPokemon = []

          for (const pokemon of filteredPokemon) {
            const id = pokemon.id || pokemon.url.split("/").filter(Boolean).pop()
            try {
              const details = await getPokemon(id)

              // Type filter
              if (filterOptions.types.length > 0) {
                const pokemonTypes = details.types.map((t) => t.type.name)
                if (!filterOptions.types.some((type) => pokemonTypes.includes(type))) {
                  continue
                }
              }

              // Stats filter
              if (
                filterOptions.minStats.hp > 0 ||
                filterOptions.minStats.attack > 0 ||
                filterOptions.minStats.defense > 0 ||
                filterOptions.minStats.speed > 0
              ) {
                const stats: { [key: string]: number } = {}
                details.stats.forEach((stat: any) => {
                  stats[stat.stat.name] = stat.base_stat
                })

                if (
                  (filterOptions.minStats.hp > 0 && stats.hp < filterOptions.minStats.hp) ||
                  (filterOptions.minStats.attack > 0 && stats.attack < filterOptions.minStats.attack) ||
                  (filterOptions.minStats.defense > 0 && stats.defense < filterOptions.minStats.defense) ||
                  (filterOptions.minStats.speed > 0 && stats.speed < filterOptions.minStats.speed)
                ) {
                  continue
                }
              }

              // Ability filter
              if (filterOptions.ability) {
                const abilityName = filterOptions.ability.toLowerCase()
                const hasAbility = details.abilities.some((ability: any) =>
                  ability.ability.name.toLowerCase().includes(abilityName),
                )

                if (!hasAbility) {
                  continue
                }
              }

              // Legendary filter
              if (filterOptions.legendary) {
                try {
                  const species = await getSpecies(id)
                  if (!species.is_legendary && !species.is_mythical) {
                    continue
                  }
                } catch (err) {
                  console.error(`Error fetching species for Pokémon ${id}:`, err)
                  continue
                }
              }

              detailedPokemon.push(details)
            } catch (err) {
              console.error(`Error fetching details for Pokémon ${id}:`, err)
            }
          }

          filteredPokemon = detailedPokemon
        }

        // Paginate results
        const paginatedResults = filteredPokemon.slice(offset, offset + limit)
        return { results: paginatedResults, count: filteredPokemon.length }
      } else {
        // No filters, just fetch the page
        const response = await fetch(`${API_URL}pokemon?limit=${limit}&offset=${offset}`)
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        return await response.json()
      }
    } catch (error) {
      console.error("Error fetching Pokémon list:", error)
      throw error
    }
  }

  // State update functions
  const toggleFavorite = async (id: number) => {
    const newFavorites = favorites.includes(id) ? favorites.filter((fav) => fav !== id) : [...favorites, id]

    setFavorites(newFavorites)

    // Update in database
    if (dbInitialized) {
      if (newFavorites.includes(id)) {
        await dbOperations.put("favorites", { id })
      } else {
        await dbOperations.delete("favorites", id)
      }
    }
  }

  const updateTeam = async (index: number, pokemon: Pokemon | null) => {
    const newTeam = [...team]
    newTeam[index] = pokemon
    setTeam(newTeam)

    // Update in database
    if (dbInitialized) {
      await dbOperations.put("teams", {
        id: "current",
        members: newTeam.map((p) => p?.id || null),
      })
    }
  }

  const updateCompare = (index: 0 | 1, pokemon: Pokemon | null) => {
    const newCompare = [...comparePokemons] as [Pokemon | null, Pokemon | null]
    newCompare[index] = pokemon
    setComparePokemons(newCompare)
  }

  const updateSettings = async (newSettings: any) => {
    const updatedSettings = { ...settings, ...newSettings }
    setSettings(updatedSettings)

    // Update in database
    if (dbInitialized) {
      await dbOperations.put("settings", { id: "user", ...updatedSettings })
    }

    // Update localStorage for theme
    if (typeof window !== "undefined" && newSettings.darkMode !== undefined) {
      localStorage.setItem("darkMode", newSettings.darkMode.toString())
    }
  }

  const updateFilters = (newFilters: any) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setCurrentPage(1) // Reset to first page when filters change
  }

  const clearCache = async () => {
    if (!dbInitialized) return

    try {
      await dbOperations.clear("pokemon")
      await dbOperations.clear("species")
      await dbOperations.clear("evolution")
      await dbOperations.clear("moves")
      await dbOperations.clear("abilities")
      await dbOperations.clear("types")
      return
    } catch (err) {
      console.error("Error clearing cache:", err)
      throw err
    }
  }

  const value = {
    isLoading,
    error,
    favorites,
    team,
    comparePokemons,
    settings,
    filters,
    currentPage,
    totalPages,
    viewMode,
    getPokemon,
    getSpecies,
    getEvolutionChain,
    getPokemonList,
    toggleFavorite,
    updateTeam,
    updateCompare,
    updateSettings,
    updateFilters,
    setCurrentPage,
    setViewMode: (mode: "list" | "grid") => {
      setViewMode(mode)
      if (typeof window !== "undefined") {
        localStorage.setItem("viewMode", mode)
      }
    },
    clearCache,
  }

  return <PokemonContext.Provider value={value}>{children}</PokemonContext.Provider>
}

export function usePokemon() {
  const context = useContext(PokemonContext)
  if (context === undefined) {
    throw new Error("usePokemon must be used within a PokemonProvider")
  }
  return context
}
