import { createClient } from "@/lib/supabase/server"
import { sendContractExpirationAlert } from "@/lib/email-alerts"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get employees with contracts expiring in 30 days
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)

    const { data: employees } = await supabase
      .from("employees_201")
      .select("*")
      .eq("employment_type", "Contractual")
      .eq("employment_status", "Active")
      .lte("date_hired", thirtyDaysFromNow.toISOString().split("T")[0])

    if (employees) {
      for (const employee of employees) {
        await sendContractExpirationAlert(employee)
      }
    }

    return NextResponse.json({ success: true, checked: employees?.length || 0 })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
