"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Briefcase, Plus, Trash2 } from "lucide-react"
import { DepartmentDialog } from "./department-dialog"
import { PositionDialog } from "./position-dialog"
import { motion } from "framer-motion"

interface Department {
  id: string
  name: string
  description: string
  created_at: string
}

interface Position {
  id: string
  title: string
  department: string
  description: string
  created_at: string
}

export function HRSettings() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [positions, setPositions] = useState<Position[]>([])
  const [departmentOpen, setDepartmentOpen] = useState(false)
  const [positionOpen, setPositionOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [deptData, posData] = await Promise.all([
        supabase.from("departments").select("*").order("created_at", { ascending: false }),
        supabase.from("positions").select("*").order("created_at", { ascending: false }),
      ])

      setDepartments(deptData.data || [])
      setPositions(posData.data || [])
    } catch (error) {
      console.error("Error fetching settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDepartment = async (id: string) => {
    try {
      const { error } = await supabase.from("departments").delete().eq("id", id)
      if (error) throw error
      setDepartments(departments.filter((d) => d.id !== id))
    } catch (error) {
      console.error("Error deleting department:", error)
    }
  }

  const handleDeletePosition = async (id: string) => {
    try {
      const { error } = await supabase.from("positions").delete().eq("id", id)
      if (error) throw error
      setPositions(positions.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting position:", error)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">System Settings</h1>
        <p className="mt-2 text-slate-600">Manage departments, positions, and system configuration</p>
      </div>

      {/* Departments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-slate-900">Departments</h2>
          </div>
          <Button
            onClick={() => setDepartmentOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Department
          </Button>
        </div>

        {loading ? (
          <Card className="border-slate-200">
            <CardContent className="flex items-center justify-center py-8">
              <div className="h-6 w-6 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
            </CardContent>
          </Card>
        ) : departments.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Building2 className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-slate-600">No departments yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {departments.map((dept, index) => (
              <motion.div
                key={dept.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                      <p className="text-sm text-slate-600">{dept.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteDepartment(dept.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Positions Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-orange-600" />
            <h2 className="text-xl font-semibold text-slate-900">Positions</h2>
          </div>
          <Button
            onClick={() => setPositionOpen(true)}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            size="sm"
          >
            <Plus className="h-4 w-4" />
            Add Position
          </Button>
        </div>

        {positions.length === 0 ? (
          <Card className="border-slate-200">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Briefcase className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-slate-600">No positions yet</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-3">
            {positions.map((pos, index) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="border-slate-200 hover:shadow-md transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{pos.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                          {pos.department}
                        </Badge>
                        <p className="text-sm text-slate-600">{pos.description}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePosition(pos.id)}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <DepartmentDialog open={departmentOpen} onOpenChange={setDepartmentOpen} onSuccess={fetchData} />
      <PositionDialog
        open={positionOpen}
        onOpenChange={setPositionOpen}
        departments={departments}
        onSuccess={fetchData}
      />
    </div>
  )
}
