import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  // If environment variables are missing, allow the request to proceed
  // This prevents middleware from blocking the app during initialization
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not configured. Skipping auth middleware.")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    })

    const {
      data: { user },
    } = await supabase.auth.getUser()

    let userRole = null
    if (user && supabaseServiceKey) {
      try {
        const supabaseAdmin = createServerClient(supabaseUrl, supabaseServiceKey, {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            },
          },
        })

        const { data: profile } = await supabaseAdmin.from("profiles").select("role").eq("id", user.id).single()

        userRole = profile?.role
      } catch (error) {
        console.warn("[v0] Failed to fetch user role:", error)
      }
    }

    // Redirect logic based on authentication and role
    const isAuthPage = request.nextUrl.pathname.startsWith("/auth")
    const isEmployeePage = request.nextUrl.pathname.startsWith("/employee")
    const isHRPage = request.nextUrl.pathname.startsWith("/hr")

    if (!user && !isAuthPage && request.nextUrl.pathname !== "/") {
      const url = request.nextUrl.clone()
      url.pathname = "/auth/login"
      return NextResponse.redirect(url)
    }

    if (user && isAuthPage && request.nextUrl.pathname !== "/auth/verify-email") {
      const url = request.nextUrl.clone()
      if (userRole === "hr_admin") {
        url.pathname = "/hr"
      } else {
        url.pathname = "/employee"
      }
      return NextResponse.redirect(url)
    }

    // Role-based access control
    if (user && isHRPage && userRole !== "hr_admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/employee"
      return NextResponse.redirect(url)
    }

    if (user && isEmployeePage && userRole === "hr_admin") {
      const url = request.nextUrl.clone()
      url.pathname = "/hr"
      return NextResponse.redirect(url)
    }

    return supabaseResponse
  } catch (error) {
    console.error("[v0] Middleware error:", error)
    return NextResponse.next({ request })
  }
}
