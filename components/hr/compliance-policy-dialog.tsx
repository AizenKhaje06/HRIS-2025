"use client"

import type React from "react"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CompliancePolicyDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CompliancePolicyDialog({ open, onOpenChange, onSuccess }: CompliancePolicyDialogProps) {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("Data Protection")
  const [version, setVersion] = useState("1.0")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    try {
      setLoading(true)
      const { error } = await supabase.from("compliance_policies").insert({
        title,
        category,
        version,
        description,
        effective_date: new Date().toISOString(),
      })

      if (error) throw error

      setTitle("")
      setCategory("Data Protection")
      setVersion("1.0")
      setDescription("")
      onSuccess()
    } catch (error) {
      console.error("Error creating policy:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-200 max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Compliance Policy</DialogTitle>
          <DialogDescription>Create a new compliance policy</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Policy Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Data Protection Policy"
              required
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Data Protection">Data Protection</SelectItem>
                <SelectItem value="Safety">Safety</SelectItem>
                <SelectItem value="Code of Conduct">Code of Conduct</SelectItem>
                <SelectItem value="Anti-Harassment">Anti-Harassment</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="version">Version</Label>
            <Input id="version" value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0" />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Policy description"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !title}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? "Creating..." : "Create Policy"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
