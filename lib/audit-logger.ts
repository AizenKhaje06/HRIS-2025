import { createClient } from "@/lib/supabase/server"

export async function logAudit(
  userId: string,
  employeeId: string | null,
  action: string,
  tableName: string,
  recordId: string | null,
  changes?: Record<string, any>,
) {
  try {
    const supabase = await createClient()

    await supabase.from("audit_logs").insert([
      {
        user_id: userId,
        employee_id: employeeId,
        action,
        table_name: tableName,
        record_id: recordId,
        changes: changes || null,
        created_at: new Date().toISOString(),
      },
    ])
  } catch (error) {
    console.error("Audit logging error:", error)
  }
}
