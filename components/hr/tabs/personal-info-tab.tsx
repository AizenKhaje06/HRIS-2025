"use client"

import { motion } from "framer-motion"

export function PersonalInfoTab({ employee }) {
  const fields = [
    { label: "Employee ID", value: employee.employee_id },
    { label: "Email", value: employee.email },
    { label: "Phone", value: employee.contact_number },
    { label: "Birth Date", value: employee.birth_date },
    { label: "Civil Status", value: employee.civil_status },
    { label: "Citizenship", value: employee.citizenship },
    { label: "Address", value: employee.address },
    { label: "Emergency Contact", value: employee.emergency_contact_name },
    { label: "Emergency Contact Number", value: employee.emergency_contact_number },
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
