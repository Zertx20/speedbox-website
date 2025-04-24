// src/actions/dashprodActions.ts
import { createClient } from "@/utils/supabase/server"; // Import Supabase client for server-side

// Fetch user profile (id_confirmed) status
export async function fetchUserProfile(userId: string) {
  const supabase = await createClient();

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("is_confirmed") // Fetch only the id_confirmed status
      .eq("user_id", userId)  // Filter by the user ID
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError.message);
      return { error: profileError.message };
    }

    return profile; // Return the profile data (id_confirmed)
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error fetching user profile:", error.message);
      return { error: error.message };
    } else {
      console.error("Error fetching user profile:", error);
      return { error: String(error) };
    }
  }
}
