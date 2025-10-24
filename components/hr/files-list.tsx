"use client"

import { motion } from "framer-motion"
import { FileText, Eye, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function FilesList({ employees }) {
  if (employees.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center"
      >
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">No employees found</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
    >
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Employee</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">ID</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Department</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Position</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">File Status</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {employees.map((emp, idx) => (
              <motion.tr
                key={emp.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {emp.profile_photo_url ? (
                      <img
                        src={emp.profile_photo_url || "/placeholder.svg"}
                        alt={emp.first_name}
                        className="w-10 h-10 rounded-full"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">
                          {emp.first_name[0]}
                          {emp.last_name[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">
                        {emp.first_name} {emp.last_name}
                      </p>
                      <p className="text-sm text-gray-500">{emp.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.employee_id}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{emp.position}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      emp.employment_status === "Active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {emp.employment_status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      emp.government_info && emp.employment_records
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {emp.government_info && emp.employment_records ? "Complete" : "Incomplete"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <Link href={`/hr/201-files/${emp.id}`}>
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700">
                        <Eye size={18} />
                      </Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-700">
                      <Edit2 size={18} />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
