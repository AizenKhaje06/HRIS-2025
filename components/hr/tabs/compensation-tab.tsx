"use client"

import { motion } from "framer-motion"

export function CompensationTab({ employee }) {
  const compensation = employee.compensation?.[0]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 rounded-lg p-6 border border-green-200"
        >
          <p className="text-sm font-medium text-green-600">Basic Salary</p>
          <p className="text-3xl font-bold text-green-900 mt-2">
            ₱{compensation?.basic_salary?.toLocaleString() || "0"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-50 rounded-lg p-6 border border-blue-200"
        >
          <p className="text-sm font-medium text-blue-600">13th Month Pay</p>
          <p className="text-3xl font-bold text-blue-900 mt-2">
            ₱{compensation?.thirteenth_month?.toLocaleString() || "0"}
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-orange-50 rounded-lg p-6 border border-orange-200"
        >
          <p className="text-sm font-medium text-orange-600">Payroll Account</p>
          <p className="text-lg font-bold text-orange-900 mt-2">{compensation?.payroll_account || "—"}</p>
        </motion.div>
      </div>

      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Salary History</h3>
        {compensation?.salary_history && compensation.salary_history.length > 0 ? (
          <div className="space-y-3">
            {compensation.salary_history.map((record, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <p className="font-medium text-gray-900">₱{record.amount?.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{record.date}</p>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No salary history</p>
        )}
      </div>
    </motion.div>
  )
}
