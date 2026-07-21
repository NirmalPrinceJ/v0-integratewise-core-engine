import { auth } from "@clerk/nextjs/server"
import { createClient } from "@/lib/supabase/client"

/**
 * Get authenticated Supabase client with Clerk user ID
 */
export async function getAuthenticatedSupabaseClient() {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error("User not authenticated")
  }

  const supabase = createClient()
  
  // Add user ID to request headers for RLS policies
  const authenticatedClient = supabase.auth.setSession({
    access_token: userId,
    refresh_token: "",
  } as any)

  return { supabase, userId }
}

/**
 * Get user profile from Supabase
 */
export async function getUserProfile() {
  const { supabase, userId } = await getAuthenticatedSupabaseClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("clerk_id", userId)
    .single()

  if (error) {
    console.error("[v0] Failed to fetch user profile:", error)
    return null
  }

  return data
}

/**
 * Create user profile in Supabase on Clerk signup
 */
export async function createUserProfile(clerkId: string, email: string, name: string) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .insert([
      {
        clerk_id: clerkId,
        email,
        name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to create user profile:", error)
    throw error
  }

  return data
}

/**
 * Update user profile in Supabase
 */
export async function updateUserProfile(clerkId: string, updates: Record<string, unknown>) {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("user_profiles")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("clerk_id", clerkId)
    .select()
    .single()

  if (error) {
    console.error("[v0] Failed to update user profile:", error)
    throw error
  }

  return data
}
