import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Type effectiveness calculation
export const calculateTypeEffectiveness = (types: string[]) => {
  const effectiveness: { [key: string]: number } = {
    normal: 1,
    fire: 1,
    water: 1,
    electric: 1,
    grass: 1,
    ice: 1,
    fighting: 1,
    poison: 1,
    ground: 1,
    flying: 1,
    psychic: 1,
    bug: 1,
    rock: 1,
    ghost: 1,
    dragon: 1,
    dark: 1,
    steel: 1,
    fairy: 1,
  }

  // Type effectiveness chart
  const typeChart: { [key: string]: { [key: string]: number } } = {
    normal: { rock: 0.5, ghost: 0, steel: 0.5, fighting: 2 },
    fire: { fire: 0.5, water: 2, grass: 0.5, ice: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5, ground: 2 },
    water: { fire: 0.5, water: 0.5, grass: 2, electric: 2, ice: 0.5, steel: 0.5, dragon: 0.5 },
    electric: { water: 0.5, electric: 0.5, grass: 0.5, ground: 2, flying: 0.5, dragon: 0.5 },
    grass: {
      fire: 2,
      water: 0.5,
      grass: 0.5,
      poison: 2,
      ground: 0.5,
      flying: 2,
      bug: 2,
      rock: 0.5,
      dragon: 0.5,
      steel: 0.5,
      ice: 2,
    },
    ice: { fire: 2, ice: 0.5, fighting: 2, rock: 2, steel: 2, water: 0.5, grass: 0.5, dragon: 0.5 },
    fighting: {
      normal: 0.5,
      ice: 0.5,
      poison: 0.5,
      flying: 2,
      psychic: 2,
      bug: 0.5,
      rock: 0.5,
      ghost: 1,
      dark: 0.5,
      steel: 0.5,
      fairy: 2,
    },
    poison: { grass: 0.5, poison: 0.5, ground: 2, psychic: 2, bug: 0.5, fairy: 0.5, rock: 0.5, ghost: 0.5, steel: 0 },
    ground: { fire: 0.5, electric: 0, poison: 0.5, rock: 0.5, steel: 0.5, grass: 2, ice: 2, water: 2 },
    flying: { grass: 0.5, fighting: 0.5, bug: 0.5, rock: 2, electric: 2, ice: 2 },
    psychic: { fighting: 0.5, psychic: 0.5, dark: 2, bug: 2, ghost: 2 },
    bug: { fire: 2, grass: 0.5, fighting: 0.5, ground: 0.5, flying: 2, rock: 2, steel: 0.5, poison: 0.5 },
    rock: { normal: 0.5, fire: 0.5, water: 2, grass: 2, fighting: 2, poison: 0.5, ground: 2, flying: 0.5, steel: 2 },
    ghost: { normal: 0, fighting: 0, poison: 0.5, bug: 0.5, ghost: 2, dark: 2 },
    dragon: { dragon: 2, steel: 0.5, fairy: 2, ice: 2 },
    dark: { fighting: 2, psychic: 0, bug: 2, ghost: 0.5, dark: 0.5, fairy: 2 },
    steel: {
      normal: 0.5,
      fire: 2,
      grass: 0.5,
      ice: 0.5,
      rock: 0.5,
      bug: 0.5,
      steel: 0.5,
      fairy: 0.5,
      fighting: 2,
      ground: 2,
    },
    fairy: { fighting: 0.5, poison: 2, bug: 0.5, dragon: 0, dark: 0.5, steel: 2 },
  }

  // Calculate effectiveness for each type
  types.forEach((type) => {
    if (!typeChart[type]) return

    Object.entries(typeChart[type]).forEach(([defenderType, multiplier]) => {
      effectiveness[defenderType] *= multiplier
    })
  })

  return effectiveness
}

// Format number as ID
export const formatId = (id: number) => {
  return `#${String(id).padStart(3, "0")}`
}

// Format height (m to ft/in)
export const formatHeight = (height: number, units: string) => {
  if (units === "imperial") {
    // Convert decimeters to inches
    const inches = height * 3.937
    const feet = Math.floor(inches / 12)
    const remainingInches = Math.round(inches % 12)
    return `${feet}'${remainingInches}"`
  } else {
    // Convert decimeters to meters
    return `${(height / 10).toFixed(1)} m`
  }
}

// Format weight (kg to lbs)
export const formatWeight = (weight: number, units: string) => {
  if (units === "imperial") {
    // Convert hectograms to pounds
    const pounds = weight / 4.536
    return `${pounds.toFixed(1)} lbs`
  } else {
    // Convert hectograms to kilograms
    return `${(weight / 10).toFixed(1)} kg`
  }
}

// Get generation from ID
export const getGeneration = (id: number) => {
  if (id <= 151) return "I"
  if (id <= 251) return "II"
  if (id <= 386) return "III"
  if (id <= 493) return "IV"
  if (id <= 649) return "V"
  if (id <= 721) return "VI"
  if (id <= 809) return "VII"
  if (id <= 905) return "VIII"
  return "IX"
}

// Get color for stat
export const getStatColor = (statName: string) => {
  const colors: { [key: string]: string } = {
    hp: "bg-red-500",
    attack: "bg-orange-500",
    defense: "bg-yellow-500",
    "special-attack": "bg-blue-500",
    "special-defense": "bg-green-500",
    speed: "bg-pink-500",
    total: "bg-gray-500",
  }

  return colors[statName] || "bg-gray-500"
}

// Get color for type
export const getTypeColor = (type: string) => {
  const colors: { [key: string]: string } = {
    normal: "bg-[#A8A77A]",
    fire: "bg-[#EE8130]",
    water: "bg-[#6390F0]",
    electric: "bg-[#F7D02C]",
    grass: "bg-[#7AC74C]",
    ice: "bg-[#96D9D6]",
    fighting: "bg-[#C22E28]",
    poison: "bg-[#A33EA1]",
    ground: "bg-[#E2BF65]",
    flying: "bg-[#A98FF3]",
    psychic: "bg-[#F95587]",
    bug: "bg-[#A6B91A]",
    rock: "bg-[#B6A136]",
    ghost: "bg-[#735797]",
    dragon: "bg-[#6F35FC]",
    dark: "bg-[#705746]",
    steel: "bg-[#B7B7CE]",
    fairy: "bg-[#D685AD]",
  }

  return colors[type] || "bg-gray-500"
}

// Get effectiveness text
export const getEffectivenessText = (value: number) => {
  if (value === 0) return "No effect"
  if (value === 0.25) return "Very weak"
  if (value === 0.5) return "Not very effective"
  if (value === 1) return "Normal"
  if (value === 2) return "Super effective"
  if (value === 4) return "Extremely effective"
  return "Normal"
}

// Get effectiveness class
export const getEffectivenessClass = (value: number) => {
  if (value === 0) return "text-gray-500"
  if (value === 0.25) return "text-red-600"
  if (value === 0.5) return "text-orange-500"
  if (value === 1) return "text-gray-700 dark:text-gray-300"
  if (value === 2) return "text-green-600"
  if (value === 4) return "text-blue-600"
  return "text-gray-700 dark:text-gray-300"
}
