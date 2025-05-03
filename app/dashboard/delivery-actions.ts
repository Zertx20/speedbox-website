'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';

// Type for delivery data
export type DeliveryFormData = {
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

// Fetch active deliveries for the current user
export async function getActiveDeliveries() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  try {
    // Get deliveries that are not Delivered or Cancelled
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('sender_id', user.id)
      .not('status', 'eq', 'Delivered')
      .not('status', 'eq', 'Cancelled')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active deliveries:', error.message);
      return { error: error.message };
    }
    
    return { deliveries: data };
  } catch (error) {
    console.error('Error fetching active deliveries:', error);
    return { error: String(error) };
  }
}

// Fetch delivery history (delivered or cancelled) for the current user
export async function getDeliveryHistory() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  try {
    // Get deliveries that are Delivered or Cancelled
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('sender_id', user.id)
      .or('status.eq.Delivered,status.eq.Cancelled')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching delivery history:', error.message);
      return { error: error.message };
    }
    
    return { deliveries: data };
  } catch (error) {
    console.error('Error fetching delivery history:', error);
    return { error: String(error) };
  }
}

// Fetch upcoming deliveries (scheduled for the next 7 days)
export async function getUpcomingDeliveries() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  try {
    // Get today's date
    const today = new Date();
    
    // Get date 7 days from now
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    // Format dates for Supabase query
    const todayStr = today.toISOString().split('T')[0];
    const nextWeekStr = nextWeek.toISOString().split('T')[0];
    
    // Get deliveries scheduled for the next 7 days
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('sender_id', user.id)
      .gte('delivery_date', todayStr)
      .lte('delivery_date', nextWeekStr)
      .not('status', 'eq', 'Delivered')
      .not('status', 'eq', 'Cancelled')
      .order('delivery_date', { ascending: true });
    
    if (error) {
      console.error('Error fetching upcoming deliveries:', error.message);
      return { error: error.message };
    }
    
    return { deliveries: data };
  } catch (error) {
    console.error('Error fetching upcoming deliveries:', error);
    return { error: String(error) };
  }
}

// Create a new delivery for the current user
export async function createDelivery(formData: FormData) {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  // Get form data
  const sender_name = formData.get('sender_name') as string;
  const sender_phone = formData.get('sender_phone') as string;
  const receiver_name = formData.get('receiver_name') as string;
  const receiver_phone = formData.get('receiver_phone') as string;
  const origin_wilaya = formData.get('origin_wilaya') as string;
  const destination_wilaya = formData.get('destination_wilaya') as string;
  const package_type = formData.get('package_type') as string;
  const delivery_type = formData.get('delivery_type') as string;
  const delivery_date = formData.get('delivery_date') as string;
  const package_description = formData.get('package_description') as string;
  const delivery_notes = formData.get('delivery_notes') as string;
  
  // Get calculated delivery details
  const price = parseInt(formData.get('price') as string) || 0;
  const distance_km = parseFloat(formData.get('distance_km') as string) || 0;
  const max_delivery_time = parseFloat(formData.get('max_delivery_time') as string) || 0;
  
  // Insert delivery into database
  const { data, error } = await supabase
    .from('deliveries')
    .insert({
      sender_id: user.id, // Automatically use current user's ID
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
    .select();
  
  if (error) {
    console.error('Error creating delivery:', error.message);
    return { error: error.message };
  }
  
  revalidatePath('/dashboard');
  return { success: true, delivery: data[0] };
}

// Get user profile data
export async function getUserProfile() {
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    return { error: 'Not authenticated' };
  }
  
  try {
    // Get user profile
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error.message);
      return { error: error.message };
    }
    
    return { profile: data };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return { error: String(error) };
  }
}
