'use server';

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from 'next/cache';

// Fetch pending deliveries (available for drivers to accept)
export async function getPendingDeliveries() {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }
    
    // Get deliveries with status 'Pending' or 'Returned' and no driver assigned
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .or('status.eq.Pending,status.eq.Returned')
      .is('driver_id', null)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching pending deliveries:', error.message);
      return { error: error.message };
    }
    
    // Add driver earnings (70% of price) with null check
    const deliveriesWithEarnings = data.map(delivery => ({
      ...delivery,
      driver_earnings: delivery.price ? Math.round(delivery.price * 0.7) : 0
    }));
    
    return { deliveries: deliveriesWithEarnings };
  } catch (error) {
    console.error('Error:', error);
    return { error: String(error) };
  }
}

// Fetch active deliveries for the current driver
export async function getActiveDeliveries() {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }
    
    // Get deliveries assigned to this driver that are "In Transit"
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('driver_id', user.id)
      .eq('status', 'In Transit')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching active deliveries:', error.message);
      return { error: error.message };
    }
    
    // Add driver earnings (70% of price) with null check
    const deliveriesWithEarnings = data.map(delivery => ({
      ...delivery,
      driver_earnings: delivery.price ? Math.round(delivery.price * 0.7) : 0
    }));
    
    return { deliveries: deliveriesWithEarnings };
  } catch (error) {
    console.error('Error:', error);
    return { error: String(error) };
  }
}

// Fetch delivery history for the driver
export async function getDeliveryHistory() {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }
    
    // Get deliveries that are Delivered, Cancelled or Returned by this driver
    const { data, error } = await supabase
      .from('deliveries')
      .select('*')
      .eq('driver_id', user.id)
      .or('status.eq.Delivered,status.eq.Cancelled,status.eq.Returned')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching delivery history:', error.message);
      return { error: error.message };
    }
    
    // Add driver earnings (70% of price) with null check
    const deliveriesWithEarnings = data.map(delivery => ({
      ...delivery,
      driver_earnings: delivery.price ? Math.round(delivery.price * 0.7) : 0
    }));
    
    return { deliveries: deliveriesWithEarnings };
  } catch (error) {
    console.error('Error:', error);
    return { error: String(error) };
  }
}

// Accept a delivery (assign driver to delivery and update status)
export async function acceptDelivery(deliveryId: string) {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }

    console.log('Accepting delivery:', deliveryId, 'for driver:', user.id);
    
    // First, check if the driver already has an active delivery
    const { data: activeDeliveries, error: activeError } = await supabase
      .from('deliveries')
      .select('id')
      .eq('driver_id', user.id)
      .eq('status', 'In Transit');
    
    if (activeError) {
      console.error('Error checking active deliveries:', activeError.message);
      return { error: 'Could not verify active deliveries: ' + activeError.message };
    }
    
    if (activeDeliveries && activeDeliveries.length > 0) {
      console.error('Driver already has an active delivery');
      return { error: 'You already have an active delivery. Complete it before accepting a new one.' };
    }
    
    // Check if the delivery exists and is available
    const { data: checkData, error: checkError } = await supabase
      .from('deliveries')
      .select('id, status')
      .eq('id', deliveryId)
      .or('status.eq.Pending,status.eq.Returned')
      .is('driver_id', null)
      .single();
    
    if (checkError) {
      console.error('Error checking delivery:', checkError.message);
      return { error: 'Could not verify delivery availability: ' + checkError.message };
    }
    
    if (!checkData) {
      console.error('Delivery not available for acceptance');
      return { error: 'This delivery is not available for acceptance' };
    }
    
    console.log('Delivery available, proceeding with update:', checkData);
    
    // Update delivery to assign this driver and change status to "In Transit"
    const { data, error } = await supabase
      .from('deliveries')
      .update({
        driver_id: user.id,
        status: 'In Transit',
        updated_at: new Date().toISOString()
      })
      .eq('id', deliveryId)
      .select();
    
    if (error) {
      console.error('Error accepting delivery:', error.message);
      return { error: error.message };
    }
    
    console.log('Delivery accepted successfully:', data);
    
    revalidatePath('/driver');
    return { success: true, delivery: data[0] };
  } catch (error) {
    console.error('Error:', error);
    return { error: String(error) };
  }
}

// Update delivery status
export async function updateDeliveryStatus(id: string, status: string) {
  const supabase = await createClient();
  
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { error: 'Not authenticated' };
    }
    
    // Validate status
    const validStatuses = ['In Transit', 'Delivered', 'Returned', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return { error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` };
    }
    
    // For "Returned" status, we remove driver id to make it available again
    if (status === 'Returned') {
      const { data, error } = await supabase
        .from('deliveries')
        .update({ 
          status,
          driver_id: null, // Remove driver ID
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('driver_id', user.id) // Make sure this driver owns the delivery
        .eq('status', 'In Transit') // Can only return from In Transit state
        .select();
      
      if (error) {
        console.error('Error returning delivery:', error.message);
        return { error: error.message };
      }
      
      revalidatePath('/driver');
      return { success: true, delivery: data[0] };
    }
    
    // For other status updates (keep driver ID)
    const { data, error } = await supabase
      .from('deliveries')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .eq('driver_id', user.id) // Make sure this driver owns the delivery
      .select();
    
    if (error) {
      console.error('Error updating delivery status:', error.message);
      return { error: error.message };
    }
    
    revalidatePath('/driver');
    return { success: true, delivery: data[0] };
  } catch (error) {
    console.error('Error:', error);
    return { error: String(error) };
  }
}