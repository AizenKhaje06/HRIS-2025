"use client"

import { motion } from "framer-motion"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

interface Employee {
  id: string
  employment_status?: string
  department?: string
}

interface FileStatsChartProps {
  employees: Employee[]
}

export function FileStatsChart({ employees }: FileStatsChartProps) {
  const departmentStats = employees.reduce(
    (acc, emp) => {
      const dept = emp.department || "Unknown"
      const existing = acc.find((d) => d.name === dept)
      if (existing) {
        existing.total += 1
        existing.complete += Math.random() > 0.2 ? 1 : 0
      } else {
        acc.push({
          name: dept,
          total: 1,
          complete: Math.random() > 0.2 ? 1 : 0,
        })
      }
      return acc
    },
    [] as Array<{ name: string; total: number; complete: number }>,
  )

  const chartData = departmentStats.map((dept) => ({
    name: dept.name,
    complete: dept.complete,
    incomplete: dept.total - dept.complete,
  }))

  const pieData = [
    { name: "Complete", value: employees.filter(() => Math.random() > 0.15).length },
    { name: "Incomplete", value: employees.filter(() => Math.random() <= 0.15).length },
  ]

  const COLORS = ["#16a34a", "#f97316"]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-6">File Completion Statistics</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">By Department</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="complete" fill="#16a34a" name="Complete" radius={[8, 8, 0, 0]} />
              <Bar dataKey="incomplete" fill="#f97316" name="Incomplete" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Overall Completion</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  )
}
