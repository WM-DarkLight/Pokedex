// API functions for fetching Pokémon data

// Base URL for the PokéAPI
const API_URL = "https://pokeapi.co/api/v2/"

// Fetch a list of Pokémon with pagination
export const fetchPokemonList = async (limit = 20, offset = 0) => {
  try {
    const response = await fetch(`${API_URL}pokemon?limit=${limit}&offset=${offset}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching Pokémon list:", error)
    throw error
  }
}

// Fetch details for a specific Pokémon by ID or name
export const fetchPokemon = async (idOrName: number | string) => {
  try {
    const response = await fetch(`${API_URL}pokemon/${idOrName}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching Pokémon ${idOrName}:`, error)
    throw error
  }
}

// Fetch species data for a Pokémon
export const fetchSpecies = async (idOrName: number | string) => {
  try {
    const response = await fetch(`${API_URL}pokemon-species/${idOrName}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching species for ${idOrName}:`, error)
    throw error
  }
}

// Fetch evolution chain data
export const fetchEvolutionChain = async (id: number | string) => {
  try {
    const response = await fetch(`${API_URL}evolution-chain/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching evolution chain ${id}:`, error)
    throw error
  }
}

// Fetch move data
export const fetchMove = async (id: number | string) => {
  try {
    const response = await fetch(`${API_URL}move/${id}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching move ${id}:`, error)
    throw error
  }
}

// Fetch type data
export const fetchType = async (idOrName: number | string) => {
  try {
    const response = await fetch(`${API_URL}type/${idOrName}`)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error(`Error fetching type ${idOrName}:`, error)
    throw error
  }
}
