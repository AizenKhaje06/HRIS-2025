"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, CheckCircle, Plus } from "lucide-react"
import { CompliancePolicyDialog } from "./compliance-policy-dialog"
import { ComplianceAuditDialog } from "./compliance-audit-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface CompliancePolicy {
  id: string
  title: string
  category: string
  version: string
  effective_date: string
}

interface ComplianceAudit {
  id: string
  audit_name: string
  audit_type: string
  status: string
  start_date: string
  end_date: string
}

export function HRCompliance() {
  const [policies, setPolicies] = useState<CompliancePolicy[]>([])
  const [audits, setAudits] = useState<ComplianceAudit[]>([])
  const [policyOpen, setPolicyOpen] = useState(false)
  const [auditOpen, setAuditOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [policyData, auditData] = await Promise.all([
        supabase.from("compliance_policies").select("*").order("effective_date", { ascending: false }),
        supabase.from("compliance_audits").select("*").order("start_date", { ascending: false }),
      ])

      setPolicies(policyData.data || [])
      setAudits(auditData.data || [])
    } catch (error) {
      console.error("Error fetching compliance data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      scheduled: "bg-blue-100 text-blue-700",
      "in-progress": "bg-yellow-100 text-yellow-700",
      completed: "bg-green-100 text-green-700",
      active: "bg-green-100 text-green-700",
      inactive: "bg-gray-100 text-gray-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Compliance Management</h1>
        <p className="mt-2 text-slate-600">Manage policies, audits, and compliance requirements</p>
      </div>

      <Tabs defaultValue="policies" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="policies" className="data-[state=active]:bg-white">
            <Shield className="h-4 w-4 mr-2" />
            Policies
          </TabsTrigger>
          <TabsTrigger value="audits" className="data-[state=active]:bg-white">
            <CheckCircle className="h-4 w-4 mr-2" />
            Audits
          </TabsTrigger>
        </TabsList>

        <TabsContent value="policies" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setPolicyOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Policy
            </Button>
          </div>

          {loading ? (
            <Card className="border-slate-200">
              <CardContent className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              </CardContent>
            </Card>
          ) : policies.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Shield className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600">No policies yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {policies.map((policy, index) => (
                <motion.div
                  key={policy.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{policy.title}</h3>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className="bg-orange-100 text-orange-700">{policy.category}</Badge>
                            <Badge variant="secondary">v{policy.version}</Badge>
                            <span className="text-xs text-slate-500">
                              Effective {new Date(policy.effective_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="audits" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setAuditOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Schedule Audit
            </Button>
          </div>

          {audits.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600">No audits scheduled</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {audits.map((audit, index) => (
                <motion.div
                  key={audit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{audit.audit_name}</h3>
                          <p className="text-sm text-slate-600 mt-1">Type: {audit.audit_type}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getStatusColor(audit.status)}>{audit.status}</Badge>
                            <span className="text-xs text-slate-500">
                              {new Date(audit.start_date).toLocaleDateString()} -{" "}
                              {new Date(audit.end_date).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CompliancePolicyDialog open={policyOpen} onOpenChange={setPolicyOpen} onSuccess={fetchData} />
      <ComplianceAuditDialog open={auditOpen} onOpenChange={setAuditOpen} onSuccess={fetchData} />
    </div>
  )
}
