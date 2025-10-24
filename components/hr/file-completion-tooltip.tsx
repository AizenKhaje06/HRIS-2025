"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle2, AlertCircle } from "lucide-react"

interface FileCompletionTooltipProps {
  employeeId: string
}

export function FileCompletionTooltip({ employeeId }: FileCompletionTooltipProps) {
  const [showTooltip, setShowTooltip] = useState(false)

  const fileStatus = {
    complete: ["SSS E1", "PhilHealth MDR", "BIR 2316"],
    missing: ["Pag-IBIG MDF"],
  }

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors cursor-help"
      >
        <CheckCircle2 size={14} className="mr-1" />
        Complete
      </button>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-gray-900 text-white text-xs rounded-lg p-3 whitespace-nowrap z-50 shadow-lg"
          >
            <div className="space-y-2">
              {fileStatus.missing.length > 0 && (
                <div>
                  <p className="font-semibold text-red-300 flex items-center gap-1">
                    <AlertCircle size={12} /> Missing:
                  </p>
                  {fileStatus.missing.map((doc) => (
                    <p key={doc} className="text-red-200 ml-4">
                      ❌ {doc}
                    </p>
                  ))}
                </div>
              )}
              {fileStatus.complete.length > 0 && (
                <div>
                  <p className="font-semibold text-green-300 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Has:
                  </p>
                  {fileStatus.complete.map((doc) => (
                    <p key={doc} className="text-green-200 ml-4">
                      ✅ {doc}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
