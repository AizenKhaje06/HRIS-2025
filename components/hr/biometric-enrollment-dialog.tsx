"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Loader2, CheckCircle, Clock } from "lucide-react"

interface Device {
  id: string
  device_name: string
}

interface Employee {
  id: string
  full_name: string
  position: string
  email: string
  device_employees?: Array<{ enrollment_status: string }>
}

interface BiometricEnrollmentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device: Device
  onSuccess: () => void
}

export function BiometricEnrollmentDialog({ open, onOpenChange, device, onSuccess }: BiometricEnrollmentDialogProps) {
  const { toast } = useToast()
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      fetchEmployees()
    }
  }, [open])

  const fetchEmployees = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/biometric/employees?device_id=${device.id}`)
      if (!response.ok) throw new Error("Failed to fetch employees")

      const data = await response.json()
      setEmployees(data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEnroll = async (employeeId: string) => {
    setEnrolling(employeeId)
    try {
      const response = await fetch("/api/biometric/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          device_id: device.id,
          employee_id: employeeId,
          biometric_template: "mock_template", // In real app, this would be actual biometric data
        }),
      })

      if (!response.ok) throw new Error("Failed to enroll employee")

      toast({
        title: "Success",
        description: "Employee enrolled successfully.",
      })

      fetchEmployees()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setEnrolling(null)
    }
  }

  const getEnrollmentStatus = (employee: Employee) => {
    const enrollment = employee.device_employees?.[0]
    if (!enrollment) return "not_enrolled"
    return enrollment.enrollment_status
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Enroll Employees - {device.device_name}</DialogTitle>
          <DialogDescription>Select employees to enroll for biometric attendance</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-lg bg-slate-200" />
            ))}
          </div>
        ) : employees.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="text-slate-600">No employees found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {employees.map((employee) => {
              const status = getEnrollmentStatus(employee)
              return (
                <Card key={employee.id} className="border-slate-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-900">{employee.full_name}</p>
                        <p className="text-sm text-slate-600">{employee.position}</p>
                      </div>

                      <div className="flex items-center gap-3">
                        {status === "enrolled" ? (
                          <Badge className="bg-green-100 text-green-800 gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Enrolled
                          </Badge>
                        ) : status === "pending" ? (
                          <Badge className="bg-yellow-100 text-yellow-800 gap-1">
                            <Clock className="h-3 w-3" />
                            Pending
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleEnroll(employee.id)}
                            disabled={enrolling === employee.id}
                            className="gap-2"
                          >
                            {enrolling === employee.id && <Loader2 className="h-4 w-4 animate-spin" />}
                            Enroll
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
