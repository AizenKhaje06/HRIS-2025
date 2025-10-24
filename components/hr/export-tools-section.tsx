"use client"

import { motion } from "framer-motion"
import { Download, FileJson, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Employee {
  id: string
  full_name: string
  email: string
  position: string
  department: string
  employment_status?: string
}

interface ExportToolsSectionProps {
  employees: Employee[]
}

export function ExportToolsSection({ employees }: ExportToolsSectionProps) {
  const exportToExcel = () => {
    const headers = ["Full Name", "Email", "Position", "Department", "Status"]
    const rows = employees.map((emp) => [emp.full_name, emp.email, emp.position, emp.department, emp.employment_status])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `201-files-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  const exportToPDF = () => {
    alert("PDF export functionality will be implemented with a PDF library")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tools</h3>
      <div className="flex flex-wrap gap-3">
        <Button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white gap-2 flex items-center">
          <Download size={18} />
          Export 201 Files (Excel)
        </Button>
        <Button onClick={exportToPDF} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 flex items-center">
          <FileText size={18} />
          Download All PDFs
        </Button>
        <Button
          variant="outline"
          className="gap-2 flex items-center border-orange-300 text-orange-600 hover:bg-orange-50 bg-transparent"
        >
          <FileJson size={18} />
          Government Links
        </Button>
      </div>
    </motion.div>
  )
}
