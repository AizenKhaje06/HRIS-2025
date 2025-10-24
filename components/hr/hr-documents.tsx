"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Trash2, Plus, Search } from "lucide-react"
import { DocumentUploadDialog } from "./document-upload-dialog"
import { motion } from "framer-motion"

interface Document {
  id: string
  title: string
  description: string
  category: string
  file_name: string
  file_size: number
  file_url: string
  created_at: string
}

export function HRDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [uploadOpen, setUploadOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    const filtered = documents.filter(
      (doc) =>
        doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.category.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredDocuments(filtered)
  }, [searchTerm, documents])

  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from("documents").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setDocuments(data || [])
    } catch (error) {
      console.error("Error fetching documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase.from("documents").delete().eq("id", id)
      if (error) throw error
      setDocuments(documents.filter((doc) => doc.id !== id))
    } catch (error) {
      console.error("Error deleting document:", error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "HR Forms": "bg-blue-100 text-blue-700",
      Policies: "bg-purple-100 text-purple-700",
      Templates: "bg-green-100 text-green-700",
      Guidelines: "bg-orange-100 text-orange-700",
      Other: "bg-gray-100 text-gray-700",
    }
    return colors[category] || colors.Other
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Document Center</h1>
          <p className="mt-2 text-slate-600">Manage HR documents and forms</p>
        </div>
        <Button
          onClick={() => setUploadOpen(true)}
          className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
        >
          <Plus className="h-4 w-4" />
          Upload Document
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search documents..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-slate-200"
        />
      </div>

      {loading ? (
        <Card className="border-slate-200">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-600">Loading documents...</p>
            </div>
          </CardContent>
        </Card>
      ) : filteredDocuments.length === 0 ? (
        <Card className="border-slate-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-900">No documents found</p>
            <p className="text-sm text-slate-600 mt-1">Upload your first document to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <FileText className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{doc.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{doc.description}</p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge className={getCategoryColor(doc.category)}>{doc.category}</Badge>
                          <span className="text-xs text-slate-500">{formatFileSize(doc.file_size)}</span>
                          <span className="text-xs text-slate-500">
                            {new Date(doc.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(doc.file_url, "_blank")}
                        className="text-orange-600 hover:bg-orange-50"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <DocumentUploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={fetchDocuments} />
    </div>
  )
}
