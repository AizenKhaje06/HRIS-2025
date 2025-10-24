"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { motion } from "framer-motion"
import { Smartphone, Plus, Trash2, Activity } from "lucide-react"
import { BiometricDeviceDialog } from "./biometric-device-dialog"
import { BiometricEnrollmentDialog } from "./biometric-enrollment-dialog"
import { useToast } from "@/hooks/use-toast"

interface Device {
  id: string
  device_name: string
  device_id: string
  status: string
  last_sync: string | null
  created_at: string
}

export function HRBiometricDevices() {
  const { toast } = useToast()
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [isEnrollmentDialogOpen, setIsEnrollmentDialogOpen] = useState(false)

  useEffect(() => {
    fetchDevices()
  }, [])

  const fetchDevices = async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("attendance_devices")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setDevices(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch devices.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteDevice = async (deviceId: string) => {
    if (!confirm("Are you sure you want to delete this device?")) return

    try {
      const supabase = createClient()
      const { error } = await supabase.from("attendance_devices").delete().eq("id", deviceId)

      if (error) throw error

      setDevices(devices.filter((d) => d.id !== deviceId))
      toast({
        title: "Success",
        description: "Device deleted successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete device.",
        variant: "destructive",
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Biometric Devices</h1>
          <p className="mt-2 text-slate-600">Manage attendance tablets and biometric enrollment</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Register Device
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-slate-200" />
          ))}
        </div>
      ) : devices.length === 0 ? (
        <Card className="border-slate-200 shadow-lg">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Smartphone className="h-12 w-12 text-slate-400 mb-4" />
            <p className="text-lg font-medium text-slate-900">No devices registered</p>
            <p className="text-sm text-slate-600 mt-1">Register your first tablet to get started</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {devices.map((device, index) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="border-slate-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100">
                        <Smartphone className="h-6 w-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900">{device.device_name}</p>
                        <p className="text-sm text-slate-600">ID: {device.device_id}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Registered: {new Date(device.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <Badge className={`${getStatusColor(device.status)} mb-2`}>{device.status}</Badge>
                        {device.last_sync && (
                          <p className="text-xs text-slate-600">
                            Last sync: {new Date(device.last_sync).toLocaleTimeString()}
                          </p>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedDevice(device)
                            setIsEnrollmentDialogOpen(true)
                          }}
                          className="gap-1"
                        >
                          <Activity className="h-4 w-4" />
                          Enroll
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteDevice(device.id)}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <BiometricDeviceDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSuccess={fetchDevices} />

      {selectedDevice && (
        <BiometricEnrollmentDialog
          open={isEnrollmentDialogOpen}
          onOpenChange={setIsEnrollmentDialogOpen}
          device={selectedDevice}
          onSuccess={fetchDevices}
        />
      )}
    </div>
  )
}
