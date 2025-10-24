import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { EmployeeDetailPage } from "@/components/hr/employee-detail-page"

export default async function EmployeeDetail({ params }) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || profile.role !== "hr_admin") {
    redirect("/employee")
  }

  // Get employee with all related data
  const { data: employee } = await supabase
    .from("employees_201")
    .select(
      `
      *,
      government_info(*),
      employment_records(*),
      attendance_leave(*),
      compensation(*),
      compliance_legal(*),
      exit_records(*)
    `,
    )
    .eq("id", params.id)
    .single()

  if (!employee) {
    redirect("/hr/201-files")
  }

  return (
    <Suspense fallback={<LoadingScreen />}>
      <EmployeeDetailPage employee={employee} user={data.user} profile={profile} />
    </Suspense>
  )
}
