'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError) {
    console.error('Login error:', authError.message)
    return { error: authError.message }
  }

  const userId = authData.user.id

  // Try to fetch role from profiles
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()

  const role = profile?.role || 'user' // fallback to 'user' if no profile found

  revalidatePath('/', 'layout')

  return { success: true, role }
}
