"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateWatchlistDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateWatchlist: (name: string) => void
}

export function CreateWatchlistDialog({ open, onOpenChange, onCreateWatchlist }: CreateWatchlistDialogProps) {
  const [name, setName] = useState("")

  const handleCreate = () => {
    if (name.trim()) {
      onCreateWatchlist(name.trim())
      onOpenChange(false)
      setName("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Create New Watchlist</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Watchlist Name</Label>
            <Input
              id="name"
              placeholder="e.g., Tech Stocks, Growth Picks..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleCreate()}
            />
          </div>

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={!name.trim()}>
              Create Watchlist
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
