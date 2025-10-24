import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { device_id, employee_id, biometric_template, pin } = await request.json()

    // Verify user is HR admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "hr_admin") {
      return NextResponse.json({ error: "Only HR admins can enroll employees" }, { status: 403 })
    }

    // Verify device exists
    const { data: device } = await supabase.from("attendance_devices").select("id").eq("id", device_id).single()

    if (!device) {
      return NextResponse.json({ error: "Device not found" }, { status: 404 })
    }

    // Enroll employee
    const { data, error } = await supabase
      .from("device_employees")
      .upsert({
        device_id,
        employee_id,
        biometric_template,
        enrollment_status: "enrolled",
        enrolled_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Enrollment error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
