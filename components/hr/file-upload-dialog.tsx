"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Upload, File } from "lucide-react"
import { Button } from "@/components/ui/button"

export function FileUploadDialog({ open, onOpenChange, employeeId, fileType, onUploadSuccess }) {
  const [loading, setLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      setFile(droppedFile)
      createPreview(droppedFile)
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      createPreview(selectedFile)
    }
  }

  const createPreview = (file: File) => {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setLoading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      formData.append("employeeId", employeeId)
      formData.append("fileType", fileType)

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) throw new Error("Upload failed")

      const data = await response.json()
      onUploadSuccess(data.url)
      setFile(null)
      setPreview(null)
      onOpenChange(false)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Upload Document</h2>
          <button onClick={() => onOpenChange(false)} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Drag and Drop Area */}
          <motion.div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-orange-500 bg-orange-50" : "border-gray-300 bg-gray-50"
            }`}
          >
            {preview ? (
              <div className="space-y-4">
                {file?.type.startsWith("image/") && (
                  <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-40 mx-auto rounded" />
                )}
                <p className="text-sm font-medium text-gray-900">{file?.name}</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload size={32} className="mx-auto text-gray-400" />
                <p className="text-sm font-medium text-gray-900">Drag and drop your file here</p>
                <p className="text-xs text-gray-500">or click to browse</p>
              </div>
            )}
            <input
              type="file"
              onChange={handleChange}
              className="hidden"
              id="file-input"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
          </motion.div>

          <label htmlFor="file-input" className="block">
            <Button type="button" variant="outline" className="w-full cursor-pointer bg-transparent">
              <File size={18} className="mr-2" />
              Choose File
            </Button>
          </label>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!file || loading}
              onClick={handleUpload}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
            >
              {loading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
