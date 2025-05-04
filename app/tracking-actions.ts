'use server'

import { createClient } from '@/utils/supabase/server'

// Track a delivery by its ID
export async function trackDeliveryById(deliveryId: string) {
  const supabase = await createClient()
  
  try {
    if (!deliveryId || deliveryId.trim() === '') {
      return { error: 'Please provide a valid delivery ID' }
    }
    
    // Fetch the delivery with the given ID
    const { data, error } = await supabase
      .from('deliveries')
      .select(`
        *,
        driver:driver_id(
          id,
          full_name
        )
      `)
      .eq('id', deliveryId)
      .single()
    
    if (error) {
      console.error('Error tracking delivery:', error.message)
      return { error: 'No delivery found with this ID' }
    }
    
    if (!data) {
      return { error: 'No delivery found with this ID' }
    }
    
    // Format the delivery data for the tracking response
    const trackingData = {
      id: data.id,
      status: data.status,
      origin: data.origin_wilaya,
      destination: data.destination_wilaya,
      packageType: data.package_type,
      serviceType: data.service_type || data.delivery_type,
      delivery_type: data.delivery_type || 'Standard',
      createdAt: data.created_at,
      updatedAt: data.updated_at,
      estimatedDelivery: data.estimated_delivery_date,
      sender_name: data.sender_name,
      sender_phone: data.sender_phone,
      receiver_name: data.recipient_name || data.receiver_name,
      receiver_phone: data.recipient_phone || data.receiver_phone,
      price: data.price,
      distance_km: data.distance_km,
      driverName: data.driver?.full_name || null,
      statusHistory: generateStatusHistory(data)
    }
    
    return { delivery: trackingData }
  } catch (error) {
    console.error('Error:', error)
    return { error: 'Failed to track delivery. Please try again.' }
  }
}

// Generate a simulated status history based on current status
function generateStatusHistory(delivery: any) {
  const history = [
    {
      status: 'Pending',
      date: new Date(delivery.created_at).toISOString(),
      description: 'Delivery created and pending driver assignment'
    }
  ]
  
  // If status is at least "In Transit", add that to history
  if (['In Transit', 'Delivered', 'Cancelled', 'Returned'].includes(delivery.status)) {
    history.push({
      status: 'In Transit',
      date: delivery.updated_at || addDays(delivery.created_at, 1),
      description: 'Picked up by driver and in transit'
    })
  }
  
  // If delivery is completed with a final status
  if (['Delivered', 'Cancelled', 'Returned'].includes(delivery.status)) {
    history.push({
      status: delivery.status,
      date: delivery.updated_at || addDays(delivery.created_at, 2),
      description: getStatusDescription(delivery.status)
    })
  }
  
  return history
}

// Helper to add days to a date string
function addDays(dateString: string, days: number) {
  const date = new Date(dateString)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

// Get description based on status
function getStatusDescription(status: string) {
  switch (status) {
    case 'Delivered':
      return 'Successfully delivered to recipient'
    case 'Cancelled':
      return 'Delivery was cancelled'
    case 'Returned':
      return 'Package returned to sender'
    default:
      return 'Status updated'
  }
}
