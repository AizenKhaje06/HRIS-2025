"use client"

import { motion } from "framer-motion"

export function EmploymentInfoTab({ employee }) {
  const fields = [
    { label: "Position", value: employee.position },
    { label: "Department", value: employee.department },
    { label: "Employment Type", value: employee.employment_type },
    { label: "Employment Status", value: employee.employment_status },
    { label: "Date Hired", value: employee.date_hired },
    { label: "Supervisor", value: employee.supervisor },
    { label: "Work Location", value: employee.work_location },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {fields.map((field, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="border-b border-gray-200 pb-4"
          >
            <p className="text-sm font-medium text-gray-600">{field.label}</p>
            <p className="text-lg text-gray-900 mt-1">{field.value || "—"}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
