"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Compass, Shuffle } from "lucide-react"

interface WelcomeScreenProps {
  onExplore: () => void
  onRandom: () => void
}

export default function WelcomeScreen({ onExplore, onRandom }: WelcomeScreenProps) {
  return (
    <div className="container mx-auto">
      <Card className="mb-6">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-b from-red-500 via-red-500 to-white relative rounded-full border-4 border-black">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded-full border-2 border-black"></div>
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to PokéVault</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
            Your comprehensive Pokémon database with advanced features. Explore detailed stats, moves, evolutions, and
            build your dream team with our powerful tools.
          </p>

          <div className="flex justify-center gap-4">
            <Button onClick={onExplore} className="gap-2">
              <Compass className="h-5 w-5" />
              Start Exploring
            </Button>
            <Button variant="outline" onClick={onRandom} className="gap-2">
              <Shuffle className="h-5 w-5" />
              Random Pokémon
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Complete Pokédex</h3>
              <p className="text-sm text-muted-foreground">
                Access comprehensive data for all Pokémon across all generations with detailed information.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Team Builder</h3>
              <p className="text-sm text-muted-foreground">
                Create and analyze your perfect Pokémon team with type coverage analysis and stat comparisons.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 20V10" />
                  <path d="M18 20V4" />
                  <path d="M6 20v-6" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Compare Tool</h3>
              <p className="text-sm text-muted-foreground">
                Compare stats and abilities between different Pokémon side by side to make informed decisions.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/10 p-3 rounded-full mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4" />
                  <path d="M17 9 12 4 7 9" />
                  <path d="M12 4v12" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Offline Access</h3>
              <p className="text-sm text-muted-foreground">
                All data is stored locally for fast, offline access anytime, even when you're not connected.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
