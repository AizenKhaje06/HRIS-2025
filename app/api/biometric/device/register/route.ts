import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { device_name, device_id } = await request.json()

    // Verify user is HR admin
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

    if (profile?.role !== "hr_admin") {
      return NextResponse.json({ error: "Only HR admins can register devices" }, { status: 403 })
    }

    // Register device
    const { data, error } = await supabase
      .from("attendance_devices")
      .insert({
        device_name,
        device_id,
        registered_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    console.error("[v0] Device registration error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
