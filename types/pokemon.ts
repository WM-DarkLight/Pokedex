export interface Pokemon {
  id: number
  name: string
  types: string[]
  sprites: {
    default: string
    animated: string | null
    official: string
  }
  stats: {
    name: string
    value: number
  }[]
  height: number
  weight: number
  abilities: string[]
}
