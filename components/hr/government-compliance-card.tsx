"use client"

import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface Employee {
  id: string
  full_name: string
  employment_status?: string
}

interface GovernmentComplianceCardProps {
  employees: Employee[]
}

export function GovernmentComplianceCard({ employees }: GovernmentComplianceCardProps) {
  const completeCount = Math.floor(employees.length * 0.8)
  const missingCount = employees.length - completeCount
  const compliancePercentage = Math.round((completeCount / employees.length) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg shadow-sm border border-blue-200 p-6"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Compliance</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={20} className="text-green-600" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">
                  {completeCount}/{employees.length}
                </span>{" "}
                Employees have complete government IDs
              </span>
            </div>
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-orange-600" />
              <span className="text-sm text-gray-700">
                <span className="font-semibold">{missingCount}</span> Missing documents
              </span>
            </div>
          </div>
        </div>

        {/* Circular Progress Indicator */}
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#16a34a"
                strokeWidth="8"
                strokeDasharray={`${2 * Math.PI * 45}`}
                initial={{ strokeDashoffset: `${2 * Math.PI * 45}` }}
                animate={{ strokeDashoffset: `${2 * Math.PI * 45 * (1 - compliancePercentage / 100)}` }}
                transition={{ duration: 1, ease: "easeOut" }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-600">{compliancePercentage}%</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">Compliance Rate</p>
        </div>
      </div>
    </motion.div>
  )
}
