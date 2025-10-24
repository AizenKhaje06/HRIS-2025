import { createClient } from "@/lib/supabase/server"
import { sendIncompleteFileAlert } from "@/lib/email-alerts"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Verify the request is from Vercel Cron
  if (request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const supabase = await createClient()

    // Get employees with incomplete 201 files
    const { data: employees } = await supabase
      .from("employees_201")
      .select(
        `
        *,
        government_info(id),
        employment_records(id),
        compensation(id)
      `,
      )
      .eq("employment_status", "Active")

    const incompleteEmployees = employees?.filter(
      (emp) => !emp.government_info?.[0] || !emp.employment_records?.[0] || !emp.compensation?.[0],
    )

    if (incompleteEmployees) {
      for (const employee of incompleteEmployees) {
        await sendIncompleteFileAlert(employee)
      }
    }

    return NextResponse.json({ success: true, checked: incompleteEmployees?.length || 0 })
  } catch (error) {
    console.error("Cron job error:", error)
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 })
  }
}
