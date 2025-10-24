import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const device_id = searchParams.get("device_id")

    // Verify user is HR admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "hr_admin") {
      return NextResponse.json({ error: "Only HR admins can access this" }, { status: 403 })
    }

    // Get all employees with their enrollment status for the device
    let query = supabase
      .from("profiles")
      .select(
        `
        id,
        full_name,
        email,
        position,
        department,
        profile_photo_url,
        device_employees!left(id, enrollment_status)
      `,
      )
      .eq("role", "employee")

    if (device_id) {
      query = query.eq("device_employees.device_id", device_id)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data, { status: 200 })
  } catch (error: any) {
    console.error("[v0] Get employees error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
