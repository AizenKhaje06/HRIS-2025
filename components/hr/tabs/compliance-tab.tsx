"use client"

import { motion } from "framer-motion"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ComplianceTab({ employee }) {
  const compliance = employee.compliance_legal?.[0]

  const documents = [
    { label: "NDA", url: compliance?.nda_file_url },
    { label: "Company Policy Acknowledgment", url: compliance?.company_policy_ack_url },
    { label: "Clearance Certificate", url: compliance?.clearance_cert_url },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid grid-cols-1 gap-4">
        {documents.map((doc, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="border border-gray-200 rounded-lg p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <FileText size={24} className="text-orange-600" />
              <span className="font-medium text-gray-900">{doc.label}</span>
            </div>
            {doc.url ? (
              <Button variant="ghost" size="sm" className="text-blue-600">
                <Download size={18} />
              </Button>
            ) : (
              <span className="text-gray-400 text-sm">Not uploaded</span>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
