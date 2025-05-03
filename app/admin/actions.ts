'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

// Type for delivery data
export type DeliveryFormData = {
  sender_id: string
  sender_name: string
  sender_phone: string
  receiver_name: string
  receiver_phone: string
  origin_wilaya: string
  destination_wilaya: string
  package_type: string
  delivery_type: string
  delivery_date: string
  package_description: string
  delivery_notes: string
  price: number
  distance_km: number
  max_delivery_time: number
}

// Fetch all users for admin selection
export async function getUsers() {
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
    .select('id, full_name, phone')
  
  if (error) {
    console.error('Error fetching users:', error.message)
    return { error: error.message }
  }
  
  return { users: data }
}

// Create a new delivery
export async function createDelivery(formData: FormData) {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  // Get form data
  const sender_id = formData.get('sender_id') as string
  const sender_name = formData.get('sender_name') as string
  const sender_phone = formData.get('sender_phone') as string
  const receiver_name = formData.get('receiver_name') as string
  const receiver_phone = formData.get('receiver_phone') as string
  const origin_wilaya = formData.get('origin_wilaya') as string
  const destination_wilaya = formData.get('destination_wilaya') as string
  const package_type = formData.get('package_type') as string
  const delivery_type = formData.get('delivery_type') as string
  const delivery_date = formData.get('delivery_date') as string
  const package_description = formData.get('package_description') as string
  const delivery_notes = formData.get('delivery_notes') as string
  const price = Number(formData.get('price')) || 0
  const distance_km = Number(formData.get('distance_km')) || 0
  const max_delivery_time = Number(formData.get('max_delivery_time')) || 0
  
  // Check if user is admin or if they're creating a delivery for themselves
  if (sender_id !== user.id) {
    // Check if user is admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    if (profile?.role !== 'admin') {
      return { error: 'Not authorized to create deliveries for other users' }
    }
  }
  
  // Insert delivery into database
  const { data, error } = await supabase
    .from('deliveries')
    .insert({
      sender_id,
      sender_name,
      sender_phone,
      receiver_name,
      receiver_phone,
      origin_wilaya,
      destination_wilaya,
      package_type,
      delivery_type,
      delivery_date,
      package_description,
      delivery_notes,
      price,
      distance_km,
      max_delivery_time
    })
    .select()
  
  if (error) {
    console.error('Error creating delivery:', error.message)
    return { error: error.message }
  }
  
  revalidatePath('/admin')
  return { success: true, delivery: data[0] }
}

// Fetch all deliveries
export async function getDeliveries() {
  const supabase = await createClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'Not authenticated' }
  }
  
  // Get user profile to check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()
  
  let query = supabase.from('deliveries').select('*')
  
  // If not admin, only show user's own deliveries
  if (profile?.role !== 'admin') {
    query = query.eq('sender_id', user.id)
  }
  
  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching deliveries:', error.message)
    return { error: error.message }
  }
  
  return { deliveries: data }
}

// Get user profile by ID
export async function getUserProfile(userId: string) {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('full_name, phone')
    .eq('id', userId)
    .single()
  
  if (error) {
    console.error('Error fetching user profile:', error.message)
    return { error: error.message }
  }
  
  return { profile: data }
}

// Update delivery status
export async function updateDeliveryStatus(id: string, status: string) {
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
  
  // Update delivery status
  const { data, error } = await supabase
    .from('deliveries')
    .update({ status })
    .eq('id', id)
    .select()
  
  if (error) {
    console.error('Error updating delivery status:', error.message)
    return { error: error.message }
  }
  
  revalidatePath('/admin')
  return { success: true, delivery: data[0] }
}
