"use client"

import { motion } from "framer-motion"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

export function GovernmentInfoTab({ employee }) {
  const govInfo = employee.government_info?.[0]

  const fields = [
    { label: "SSS Number", value: govInfo?.sss_number },
    { label: "Pag-IBIG Number", value: govInfo?.pagibig_number },
    { label: "PhilHealth Number", value: govInfo?.philhealth_number },
    { label: "TIN Number", value: govInfo?.tin_number },
    { label: "Contribution Status", value: govInfo?.contribution_status },
    { label: "Last Contribution Update", value: govInfo?.last_contribution_update },
  ]

  const documents = [
    { label: "SSS Form", url: govInfo?.sss_form_url },
    { label: "Pag-IBIG Form", url: govInfo?.pagibig_form_url },
    { label: "PhilHealth MDR", url: govInfo?.philhealth_mdr_url },
    { label: "BIR 2316", url: govInfo?.bir_2316_url },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Information</h3>
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
      </div>

      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>
    </motion.div>
  )
}
