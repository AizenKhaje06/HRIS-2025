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

interface ComplianceAuditDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function ComplianceAuditDialog({ open, onOpenChange, onSuccess }: ComplianceAuditDialogProps) {
  const [auditName, setAuditName] = useState("")
  const [auditType, setAuditType] = useState("Internal")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!auditName) return

    try {
      setLoading(true)
      const { error } = await supabase.from("compliance_audits").insert({
        audit_name: auditName,
        audit_type: auditType,
        description,
        status: "scheduled",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      })

      if (error) throw error

      setAuditName("")
      setAuditType("Internal")
      setDescription("")
      onSuccess()
    } catch (error) {
      console.error("Error creating audit:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-slate-200 max-h-96 overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Audit</DialogTitle>
          <DialogDescription>Create a new compliance audit</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="auditName">Audit Name</Label>
            <Input
              id="auditName"
              value={auditName}
              onChange={(e) => setAuditName(e.target.value)}
              placeholder="e.g., Q1 Compliance Audit"
              required
            />
          </div>

          <div>
            <Label htmlFor="auditType">Audit Type</Label>
            <Select value={auditType} onValueChange={setAuditType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Internal">Internal</SelectItem>
                <SelectItem value="External">External</SelectItem>
                <SelectItem value="Regulatory">Regulatory</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Audit description and scope"
              rows={3}
            />
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !auditName}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
            >
              {loading ? "Scheduling..." : "Schedule Audit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
