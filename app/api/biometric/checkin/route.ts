import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { device_id, employee_id, record_type, confidence_score } = await request.json()

    // Verify device is active
    const { data: device } = await supabase
      .from("attendance_devices")
      .select("id")
      .eq("id", device_id)
      .eq("status", "active")
      .single()

    if (!device) {
      return NextResponse.json({ error: "Device not found or inactive" }, { status: 404 })
    }

    // Verify employee is enrolled on this device
    const { data: enrollment } = await supabase
      .from("device_employees")
      .select("id")
      .eq("device_id", device_id)
      .eq("employee_id", employee_id)
      .eq("enrollment_status", "enrolled")
      .single()

    if (!enrollment) {
      return NextResponse.json({ error: "Employee not enrolled on this device" }, { status: 403 })
    }

    const now = new Date()
    const today = now.toISOString().split("T")[0]

    // Get or create attendance record for today
    let { data: attendance } = await supabase
      .from("attendance")
      .select("id")
      .eq("employee_id", employee_id)
      .eq("date", today)
      .single()

    if (!attendance) {
      const { data: newAttendance } = await supabase
        .from("attendance")
        .insert({
          employee_id,
          date: today,
          source: "biometric",
          status: "present",
        })
        .select()
        .single()
      attendance = newAttendance
    }

    // Record biometric attendance
    const { data: bioRecord, error } = await supabase
      .from("biometric_attendance")
      .insert({
        device_id,
        employee_id,
        attendance_id: attendance?.id,
        record_type,
        recorded_at: now.toISOString(),
        confidence_score,
      })
      .select()
      .single()

    if (error) throw error

    // Update attendance record based on record_type
    const updateData: any = {}
    if (record_type === "time_in") updateData.time_in = now.toISOString()
    if (record_type === "lunch_out") updateData.lunch_out = now.toISOString()
    if (record_type === "lunch_in") updateData.lunch_in = now.toISOString()
    if (record_type === "time_out") updateData.time_out = now.toISOString()

    if (Object.keys(updateData).length > 0) {
      await supabase.from("attendance").update(updateData).eq("id", attendance?.id)
    }

    return NextResponse.json(bioRecord, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Check-in error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
