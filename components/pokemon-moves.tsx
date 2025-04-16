"use client"

import { useState, useEffect } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { getTypeColor } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { Search } from "lucide-react"

interface PokemonMovesProps {
  moves: any[]
}

export default function PokemonMoves({ moves }: PokemonMovesProps) {
  const { getPokemon } = usePokemon()
  const [moveDetails, setMoveDetails] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [learnMethodFilter, setLearnMethodFilter] = useState("all")
  const [sortBy, setSortBy] = useState("level")

  useEffect(() => {
    const fetchMoveDetails = async () => {
      setIsLoading(true)

      try {
        // Limit to first 30 moves for performance
        const movesToFetch = moves.slice(0, 30)

        const moveDetailsPromises = movesToFetch.map(async (moveInfo) => {
          const moveUrl = moveInfo.move.url
          const moveId = moveUrl.split("/").filter(Boolean).pop()

          try {
            // Get move details
            const moveData = await fetch(`https://pokeapi.co/api/v2/move/${moveId}`).then((res) => res.json())

            // Get latest game version learn method
            const versionGroupDetails = moveInfo.version_group_details.sort((a: any, b: any) => {
              return b.version_group.name.localeCompare(a.version_group.name)
            })[0]

            return {
              ...moveData,
              level_learned_at: versionGroupDetails.level_learned_at,
              learn_method: versionGroupDetails.move_learn_method.name,
              version_group: versionGroupDetails.version_group.name,
            }
          } catch (err) {
            console.error(`Error fetching move ${moveId}:`, err)
            return null
          }
        })

        const fetchedMoveDetails = await Promise.all(moveDetailsPromises)
        setMoveDetails(fetchedMoveDetails.filter(Boolean))
        setIsLoading(false)
      } catch (err) {
        console.error("Error fetching move details:", err)
        setIsLoading(false)
      }
    }

    fetchMoveDetails()
  }, [moves])

  // Filter and sort moves
  const filteredMoves = moveDetails.filter((move) => {
    // Search filter
    if (searchQuery && !move.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Learn method filter
    if (learnMethodFilter !== "all" && move.learn_method !== learnMethodFilter) {
      return false
    }

    return true
  })

  // Sort moves
  const sortedMoves = [...filteredMoves].sort((a, b) => {
    switch (sortBy) {
      case "level":
        return a.level_learned_at - b.level_learned_at
      case "name":
        return a.name.localeCompare(b.name)
      case "power":
        const powerA = a.power || 0
        const powerB = b.power || 0
        return powerB - powerA
      case "accuracy":
        const accuracyA = a.accuracy || 0
        const accuracyB = b.accuracy || 0
        return accuracyB - accuracyA
      default:
        return 0
    }
  })

  // Get move category badge
  const getMoveCategory = (move: any) => {
    if (move.damage_class.name === "physical") {
      return <Badge className="bg-orange-500">Physical</Badge>
    } else if (move.damage_class.name === "special") {
      return <Badge className="bg-blue-500">Special</Badge>
    } else {
      return <Badge className="bg-gray-500">Status</Badge>
    }
  }

  // Get learn method display
  const getLearnMethodDisplay = (method: string, level: number) => {
    switch (method) {
      case "level-up":
        return `Level ${level}`
      case "machine":
        return "TM/HM"
      case "egg":
        return "Egg"
      case "tutor":
        return "Tutor"
      default:
        return method.replace(/-/g, " ")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search moves..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <div className="flex gap-2">
          <div>
            <Select value={learnMethodFilter} onValueChange={setLearnMethodFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Learn Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="level-up">Level Up</SelectItem>
                <SelectItem value="machine">TM/HM</SelectItem>
                <SelectItem value="egg">Egg</SelectItem>
                <SelectItem value="tutor">Tutor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="level">Level</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="power">Power</SelectItem>
                <SelectItem value="accuracy">Accuracy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Power</TableHead>
              <TableHead className="text-right">Acc.</TableHead>
              <TableHead className="text-right">PP</TableHead>
              <TableHead>Learn Method</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMoves.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                  No moves found matching your criteria
                </TableCell>
              </TableRow>
            ) : (
              sortedMoves.map((move) => (
                <TableRow key={move.id}>
                  <TableCell className="font-medium capitalize">{move.name.replace(/-/g, " ")}</TableCell>
                  <TableCell>
                    <Badge className={cn("uppercase", getTypeColor(move.type.name))}>{move.type.name}</Badge>
                  </TableCell>
                  <TableCell>{getMoveCategory(move)}</TableCell>
                  <TableCell className="text-right">{move.power || "-"}</TableCell>
                  <TableCell className="text-right">{move.accuracy ? `${move.accuracy}%` : "-"}</TableCell>
                  <TableCell className="text-right">{move.pp}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{getLearnMethodDisplay(move.learn_method, move.level_learned_at)}</Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {moveDetails.length > 0 && (
        <div className="text-sm text-muted-foreground text-center">
          Showing {sortedMoves.length} of {moves.length} moves
        </div>
      )}
    </div>
  )
}
