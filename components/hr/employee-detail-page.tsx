"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, Download, Edit2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PersonalInfoTab } from "./tabs/personal-info-tab"
import { EmploymentInfoTab } from "./tabs/employment-info-tab"
import { GovernmentInfoTab } from "./tabs/government-info-tab"
import { AttendanceLeaveTab } from "./tabs/attendance-leave-tab"
import { CompensationTab } from "./tabs/compensation-tab"
import { ComplianceTab } from "./tabs/compliance-tab"
import { ExitTab } from "./tabs/exit-tab"

const tabs = [
  { id: "personal", label: "Personal Info", icon: "👤" },
  { id: "employment", label: "Employment Info", icon: "💼" },
  { id: "government", label: "Government Info", icon: "📋" },
  { id: "attendance", label: "Attendance & Leave", icon: "📅" },
  { id: "compensation", label: "Compensation", icon: "💰" },
  { id: "compliance", label: "Compliance", icon: "✓" },
  { id: "exit", label: "Exit Records", icon: "🚪" },
]

export function EmployeeDetailPage({ employee, user, profile }) {
  const [activeTab, setActiveTab] = useState("personal")

  const renderTabContent = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalInfoTab employee={employee} />
      case "employment":
        return <EmploymentInfoTab employee={employee} />
      case "government":
        return <GovernmentInfoTab employee={employee} />
      case "attendance":
        return <AttendanceLeaveTab employee={employee} />
      case "compensation":
        return <CompensationTab employee={employee} />
      case "compliance":
        return <ComplianceTab employee={employee} />
      case "exit":
        return <ExitTab employee={employee} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100 p-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/hr/201-files">
              <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                <ArrowLeft size={20} />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.first_name} {employee.last_name}
              </h1>
              <p className="text-gray-600">
                {employee.position} • {employee.department}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download size={18} />
              Export PDF
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white gap-2">
              <Edit2 size={18} />
              Edit
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8"
        >
          <div className="flex overflow-x-auto border-b border-gray-200">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-4 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? "text-orange-600 border-b-2 border-orange-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="p-8"
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  )
}
