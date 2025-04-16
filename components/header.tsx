"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { usePokemon } from "@/context/pokemon-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Moon, Sun, Users, BarChart2, Star, Settings, X } from "lucide-react"
import SettingsModal from "./settings-modal"

interface HeaderProps {
  onTeamBuilderClick: () => void
  onCompareClick: () => void
  onLogoClick: () => void
}

export default function Header({ onTeamBuilderClick, onCompareClick, onLogoClick }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const { updateFilters, updateSettings, settings } = usePokemon()
  const [searchValue, setSearchValue] = useState("")
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (settings.darkMode) {
      setTheme("dark")
    } else {
      setTheme("light")
    }
  }, [settings.darkMode, setTheme])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: searchValue })
  }

  const clearSearch = () => {
    setSearchValue("")
    updateFilters({ search: "" })
  }

  const handleThemeToggle = () => {
    const newDarkMode = theme === "light"
    updateSettings({ darkMode: newDarkMode })
    setTheme(newDarkMode ? "dark" : "light")
  }

  return (
    <>
      <header className="bg-primary text-white h-14 sticky top-0 z-50 shadow-md">
        <div className="container mx-auto h-full flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <button onClick={onLogoClick} className="flex items-center gap-2 font-bold text-lg">
              <div className="w-7 h-7 rounded-full bg-gradient-to-b from-red-500 via-red-500 to-white relative border border-black">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full border border-black"></div>
                </div>
              </div>
              <span>PokéVault</span>
            </button>
          </div>

          <div className="hidden md:flex relative flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search Pokémon by name or number..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full pl-9 pr-9 py-2 bg-white/20 border-none text-white placeholder:text-white/70 focus:ring-2 focus:ring-white/30"
              />
              {searchValue && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </form>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onTeamBuilderClick}
              title="Team Builder"
              className="text-white hover:bg-white/20"
            >
              <Users className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={onCompareClick}
              title="Compare Pokémon"
              className="text-white hover:bg-white/20"
            >
              <BarChart2 className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => updateFilters({ favorites: true })}
              title="Favorites"
              className="text-white hover:bg-white/20"
            >
              <Star className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowSettings(true)}
              title="Settings"
              className="text-white hover:bg-white/20"
            >
              <Settings className="h-5 w-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleThemeToggle}
              title="Toggle Theme"
              className="text-white hover:bg-white/20"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </header>

      <div className="md:hidden px-4 py-2 bg-background border-b">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search Pokémon..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full pl-9 pr-9"
          />
          {searchValue && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
