"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, Plus, FileText, AlertCircle, CheckCircle2, Clock, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddEmployeeDialog } from "./add-employee-dialog"
import { FileCompletionTooltip } from "./file-completion-tooltip"
import { GovernmentComplianceCard } from "./government-compliance-card"
import { FileStatsChart } from "./file-stats-chart"
import { ExportToolsSection } from "./export-tools-section"
import Link from "next/link"

interface Employee {
  id: string
  full_name: string
  email: string
  position: string
  department: string
  phone?: string
  employment_status?: string
  profile_photo_url?: string
  created_at?: string
  updated_at?: string
}

interface FilesDashboardProps {
  employees: Employee[]
}

export function FilesDashboard({ employees }: FilesDashboardProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dialogOpen, setDialogOpen] = useState(false)

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        emp.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter

      const matchesStatus = statusFilter === "all" || emp.employment_status === statusFilter

      return matchesSearch && matchesDepartment && matchesStatus
    })
  }, [employees, searchTerm, departmentFilter, statusFilter])

  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))]

  const stats = {
    total: employees.length,
    active: employees.filter((e) => e.employment_status === "Regular" || e.employment_status === "Probationary").length,
    resigned: employees.filter((e) => e.employment_status === "Resigned").length,
    incomplete: Math.floor(employees.length * 0.15),
    compliant: Math.floor(employees.length * 0.85),
  }

  const governmentLinks = [
    { name: "SSS", url: "https://www.sss.gov.ph", icon: "🏛️" },
    { name: "PhilHealth", url: "https://www.philhealth.gov.ph", icon: "🏥" },
    { name: "Pag-IBIG", url: "https://www.pagibigfund.gov.ph", icon: "🏠" },
    { name: "BIR", url: "https://www.bir.gov.ph", icon: "📋" },
    { name: "DOLE", url: "https://www.dole.gov.ph", icon: "⚖️" },
  ]

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">201 File Management</h1>
            <p className="text-gray-600 mt-2">Manage employee 201 files and documentation</p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
            <Plus size={20} />
            Add Employee
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { label: "Total Employees", value: stats.total, icon: FileText, color: "bg-blue-50 text-blue-600" },
            { label: "Active", value: stats.active, icon: CheckCircle2, color: "bg-green-50 text-green-600" },
            { label: "Resigned", value: stats.resigned, icon: Clock, color: "bg-gray-50 text-gray-600" },
            {
              label: "Incomplete Files",
              value: stats.incomplete,
              icon: AlertCircle,
              color: "bg-orange-50 text-orange-600",
            },
            {
              label: "Compliant Employees",
              value: stats.compliant,
              icon: CheckCircle2,
              color: "bg-green-50 text-green-700",
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`${stat.color} rounded-lg p-6 shadow-sm border border-gray-200`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <stat.icon size={32} className="opacity-20" />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Government Compliance Card */}
      <GovernmentComplianceCard employees={employees} />

      {/* Export Tools Section */}
      <ExportToolsSection employees={filteredEmployees} />

      {/* Government Links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Portals</h3>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {governmentLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-orange-50 hover:border-orange-300 transition-colors"
            >
              <span className="text-xl">{link.icon}</span>
              <span className="text-sm font-medium text-gray-700">{link.name}</span>
              <ExternalLink size={14} className="text-gray-400" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* File Stats Chart */}
      <FileStatsChart employees={employees} />

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-3 text-gray-400" size={20} />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="Regular">Regular</option>
              <option value="Probationary">Probationary</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contractual">Contractual</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Employee List */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Employee Name</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Position</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Department</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">File Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Last Updated</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp, idx) => {
                  const hasExpiry = Math.random() > 0.7
                  const lastUpdated = emp.updated_at
                    ? new Date(emp.updated_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "N/A"

                  return (
                    <motion.tr
                      key={emp.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        <div className="flex items-center gap-2">
                          {emp.full_name}
                          {hasExpiry && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              ⚠️ Expiring
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {emp.employment_status || "Active"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <FileCompletionTooltip employeeId={emp.id} />
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{lastUpdated}</td>
                      <td className="px-6 py-4 text-sm">
                        <Link href={`/hr/201-files/${emp.id}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-transparent"
                          >
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </motion.tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                    No employees found matching your filters
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Add Employee Dialog */}
      <AddEmployeeDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
