"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, Plus } from "lucide-react"
import { JobPostingDialog } from "./job-posting-dialog"
import { CandidateDialog } from "./candidate-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"

interface JobPosting {
  id: string
  title: string
  department: string
  description: string
  status: string
  posted_date: string
}

interface Candidate {
  id: string
  full_name: string
  email: string
  position_applied: string
  status: string
  applied_date: string
}

export function HRRecruitment() {
  const [jobPostings, setJobPostings] = useState<JobPosting[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [jobOpen, setJobOpen] = useState(false)
  const [candidateOpen, setCandidateOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [jobData, candData] = await Promise.all([
        supabase.from("job_postings").select("*").order("posted_date", { ascending: false }),
        supabase.from("candidates").select("*").order("applied_date", { ascending: false }),
      ])

      setJobPostings(jobData.data || [])
      setCandidates(candData.data || [])
    } catch (error) {
      console.error("Error fetching recruitment data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: "bg-green-100 text-green-700",
      closed: "bg-red-100 text-red-700",
      applied: "bg-blue-100 text-blue-700",
      interviewed: "bg-purple-100 text-purple-700",
      hired: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    }
    return colors[status] || "bg-gray-100 text-gray-700"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Recruitment & Onboarding</h1>
        <p className="mt-2 text-slate-600">Manage job postings, candidates, and onboarding</p>
      </div>

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="bg-slate-100">
          <TabsTrigger value="jobs" className="data-[state=active]:bg-white">
            <Briefcase className="h-4 w-4 mr-2" />
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="candidates" className="data-[state=active]:bg-white">
            <Users className="h-4 w-4 mr-2" />
            Candidates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="jobs" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setJobOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Post Job
            </Button>
          </div>

          {loading ? (
            <Card className="border-slate-200">
              <CardContent className="flex items-center justify-center py-12">
                <div className="h-8 w-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              </CardContent>
            </Card>
          ) : jobPostings.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600">No job postings yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {jobPostings.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{job.title}</h3>
                          <p className="text-sm text-slate-600 mt-1">{job.department}</p>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{job.description}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                            <span className="text-xs text-slate-500">
                              Posted {new Date(job.posted_date).toLocaleDateString()}
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

        <TabsContent value="candidates" className="space-y-4">
          <div className="flex justify-end">
            <Button
              onClick={() => setCandidateOpen(true)}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Candidate
            </Button>
          </div>

          {candidates.length === 0 ? (
            <Card className="border-slate-200">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Users className="h-12 w-12 text-slate-400 mb-4" />
                <p className="text-slate-600">No candidates yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {candidates.map((candidate, index) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="border-slate-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900">{candidate.full_name}</h3>
                          <p className="text-sm text-slate-600 mt-1">{candidate.email}</p>
                          <p className="text-sm text-slate-600">Position: {candidate.position_applied}</p>
                          <div className="flex items-center gap-2 mt-3">
                            <Badge className={getStatusColor(candidate.status)}>{candidate.status}</Badge>
                            <span className="text-xs text-slate-500">
                              Applied {new Date(candidate.applied_date).toLocaleDateString()}
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

      <JobPostingDialog open={jobOpen} onOpenChange={setJobOpen} onSuccess={fetchData} />
      <CandidateDialog open={candidateOpen} onOpenChange={setCandidateOpen} onSuccess={fetchData} />
    </div>
  )
}
