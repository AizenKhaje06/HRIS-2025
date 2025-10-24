import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const employeeId = formData.get("employeeId") as string
    const fileType = formData.get("fileType") as string

    if (!file || !employeeId || !fileType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const fileName = `${employeeId}/${fileType}/${Date.now()}-${file.name}`

    const { data: uploadData, error: uploadError } = await supabase.storage.from("201-files").upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    })

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 400 })
    }

    const { data: publicUrl } = supabase.storage.from("201-files").getPublicUrl(uploadData.path)

    return NextResponse.json({ url: publicUrl.publicUrl, path: uploadData.path })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
