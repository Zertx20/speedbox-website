'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

// Fetch all users for user management
export async function getAllUsers() {
  const supabase = await createClient()
  
  // Get current user to verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }
  
  // Fetch all users with their profiles
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, email, phone, is_confirmed')
  
  if (error) {
    console.error('Error fetching users:', error.message)
    return { error: error.message }
  }
  
  return { users: data }
}

// Toggle user verification status
export async function toggleUserStatus(userId: string, isConfirmed: boolean) {
  const supabase = await createClient()
  
  // Get current user to verify admin status
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  if (profile?.role !== 'admin') {
    return { error: 'Not authorized' }
  }
  
  // Update user status
  const { data, error } = await supabase
    .from('profiles')
    .update({ is_confirmed: isConfirmed })
    .eq('id', userId)
    .select()
  
  if (error) {
    console.error('Error updating user status:', error.message)
    return { error: error.message }
  }
  
  revalidatePath('/admin')
  return { success: true, profile: data[0] }
}
