"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import PokemonDetails from "@/components/pokemon-details"
import TeamBuilder from "@/components/team-builder"
import CompareScreen from "@/components/compare-screen"
import WelcomeScreen from "@/components/welcome-screen"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import Footer from "@/components/footer"
import { ToastProvider } from "@/components/ui/toast"
import { ThemeProvider } from "@/components/theme-provider"
import { PokemonProvider } from "@/context/pokemon-context"

export default function Home() {
  const [activeScreen, setActiveScreen] = useState("welcome")
  const [currentPokemonId, setCurrentPokemonId] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const { setTheme } = useTheme()

  // Only access localStorage after component has mounted on the client
  useEffect(() => {
    setMounted(true)

    // Now it's safe to access localStorage
    if (typeof window !== "undefined") {
      const darkMode = localStorage.getItem("darkMode") === "true"
      setTheme(darkMode ? "dark" : "light")
    }
  }, [setTheme])

  // Don't render anything until the component has mounted
  if (!mounted) {
    return (
      <ThemeProvider defaultTheme="light" storageKey="pokedex-theme">
        <div className="flex flex-col min-h-screen bg-background text-foreground">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
          </div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="pokedex-theme">
      <PokemonProvider>
        <ToastProvider>
          <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header
              onTeamBuilderClick={() => setActiveScreen("team-builder")}
              onCompareClick={() => setActiveScreen("compare")}
              onLogoClick={() => setActiveScreen("welcome")}
            />

            <div className="flex flex-1 flex-col md:flex-row">
              <Sidebar
                onSelectPokemon={(id) => {
                  setCurrentPokemonId(id)
                  setActiveScreen("details")
                }}
                currentPokemonId={currentPokemonId}
              />

              <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                {activeScreen === "welcome" && (
                  <WelcomeScreen
                    onExplore={() => {
                      if (currentPokemonId) {
                        setActiveScreen("details")
                      } else {
                        // Select first Pokémon if none is selected
                        setCurrentPokemonId(1)
                        setActiveScreen("details")
                      }
                    }}
                    onRandom={() => {
                      const randomId = Math.floor(Math.random() * 1008) + 1
                      setCurrentPokemonId(randomId)
                      setActiveScreen("details")
                    }}
                  />
                )}

                {activeScreen === "details" && currentPokemonId && (
                  <PokemonDetails pokemonId={currentPokemonId} onEvolutionClick={(id) => setCurrentPokemonId(id)} />
                )}

                {activeScreen === "team-builder" && (
                  <TeamBuilder
                    onSelectPokemon={(id) => {
                      setCurrentPokemonId(id)
                      setActiveScreen("details")
                    }}
                  />
                )}

                {activeScreen === "compare" && (
                  <CompareScreen
                    onSelectPokemon={(id) => {
                      setCurrentPokemonId(id)
                      setActiveScreen("details")
                    }}
                  />
                )}
              </main>
            </div>

            <Footer />
          </div>
        </ToastProvider>
      </PokemonProvider>
    </ThemeProvider>
  )
}
