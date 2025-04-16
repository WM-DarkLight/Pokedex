"use client"

import { useState, useEffect } from "react"
import { usePokemon } from "@/context/pokemon-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/toast"
import { Loader2 } from "lucide-react"
import { useTheme } from "next-themes"

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { settings, updateSettings, clearCache } = usePokemon()
  const { toast } = useToast()
  const { setTheme } = useTheme()

  const [localSettings, setLocalSettings] = useState(settings)
  const [isClearingCache, setIsClearingCache] = useState(false)

  useEffect(() => {
    setLocalSettings(settings)
  }, [settings])

  const handleSave = () => {
    updateSettings(localSettings)

    // Update theme based on dark mode setting
    setTheme(localSettings.darkMode ? "dark" : "light")

    toast({
      title: "Settings saved",
      description: "Your settings have been updated successfully.",
    })
    onClose()
  }

  const handleClearCache = async () => {
    setIsClearingCache(true)
    try {
      await clearCache()
      toast({
        title: "Cache cleared",
        description: "The application cache has been cleared successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cache. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsClearingCache(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>

        <div className="py-4 space-y-6">
          <div className="space-y-4">
            <h3 className="font-medium">Appearance</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode">Dark Mode</Label>
              <Switch
                id="dark-mode"
                checked={localSettings.darkMode}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, darkMode: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="animations">Enable Animations</Label>
              <Switch
                id="animations"
                checked={localSettings.animations}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, animations: checked })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-medium">Data & Storage</h3>

            <div className="flex items-center justify-between">
              <Label htmlFor="offline-mode">Offline Mode</Label>
              <Switch
                id="offline-mode"
                checked={localSettings.offlineMode}
                onCheckedChange={(checked) => setLocalSettings({ ...localSettings, offlineMode: checked })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={localSettings.language}
                onValueChange={(value) => setLocalSettings({ ...localSettings, language: value })}
              >
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="ja">Japanese</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="units">Measurement Units</Label>
              <Select
                value={localSettings.units}
                onValueChange={(value) => setLocalSettings({ ...localSettings, units: value })}
              >
                <SelectTrigger id="units">
                  <SelectValue placeholder="Select units" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="metric">Metric (cm, kg)</SelectItem>
                  <SelectItem value="imperial">Imperial (ft, lbs)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="destructive" onClick={handleClearCache} disabled={isClearingCache} className="w-full">
              {isClearingCache ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Clearing Cache...
                </>
              ) : (
                "Clear Cache"
              )}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
