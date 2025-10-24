import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Suspense } from "react"
import { LoadingScreen } from "@/components/loading-screen"
import { FilesDashboard } from "@/components/hr/files-dashboard"

export default async function FilesPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", data.user.id).single()

  if (!profile || profile.role !== "hr_admin") {
    redirect("/employee")
  }

  // Get all employees with their 201 file status
  const { data: employees } = await supabase
    .from("employees_201")
    .select(
      `
      *,
      government_info(id),
      employment_records(id),
      compensation(id),
      compliance_legal(id),
      exit_records(id)
    `,
    )
    .order("created_at", { ascending: false })

  return (
    <Suspense fallback={<LoadingScreen />}>
      <FilesDashboard user={data.user} profile={profile} employees={employees || []} />
    </Suspense>
  )
}
