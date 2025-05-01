'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('fullName') as string
  const phone = formData.get('phone') as string
  const role = formData.get('role') as string

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        phone: phone,
        role: role,
        email: email,
      },
    },
  })

  if (error) {
    console.error('Signup error:', error.message)
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
return { success: true }
}
