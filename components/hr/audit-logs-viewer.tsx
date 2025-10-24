"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { createClient } from "@/lib/supabase/client"
import { format } from "date-fns"

export function AuditLogsViewer({ employeeId }) {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLogs = async () => {
      const supabase = createClient()

      const { data } = await supabase
        .from("audit_logs")
        .select("*")
        .eq("employee_id", employeeId)
        .order("created_at", { ascending: false })
        .limit(50)

      setLogs(data || [])
      setLoading(false)
    }

    fetchLogs()
  }, [employeeId])

  if (loading) {
    return <div className="text-center py-8 text-gray-500">Loading audit logs...</div>
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>

      {logs.length === 0 ? (
        <p className="text-gray-500">No activity recorded</p>
      ) : (
        <div className="space-y-3">
          {logs.map((log, idx) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{log.action}</p>
                  <p className="text-sm text-gray-600">
                    {log.table_name} • {log.user_id}
                  </p>
                </div>
                <span className="text-xs text-gray-500">{format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}</span>
              </div>
              {log.changes && (
                <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded">
                  <pre>{JSON.stringify(log.changes, null, 2)}</pre>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
