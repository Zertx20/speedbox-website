'use client'
import { useState } from 'react';
import { calculateDistanceBetweenWilayas } from '@/utils/calculateDistance';
import { wilayaLocations } from '@/data/wilayas';

const TestPage = () => {
  // Define state for the selected wilayas, service type and package type
  const [wilaya1, setWilaya1] = useState('Algiers');
  const [wilaya2, setWilaya2] = useState('Oran');
  const [serviceType, setServiceType] = useState('Standard');
  const [packageType, setPackageType] = useState('Small');
  
  // Price per km for different service types
  const pricePerKm = {
    Standard: 2,    // 2 DA per km for Standard service
    Express: 5,     // 5 DA per km for Express service
    VIP: 7,         // 7 DA per km for VIP service
  };
  
  // Package type multipliers
  const packageMultipliers = {
    Small: 1,        // No additional cost for small packages
    Medium: 1.5,     // 50% additional cost for medium packages
    Large: 2,        // 100% additional cost for large packages
    Oversized: 3     // 200% additional cost for oversized packages
  };
  
  // Average speeds for delivery time calculation (km/h)
  const averageSpeeds = {
    Standard: 50,     // 50 km/h for Standard service
    Express: 80,     // 80 km/h for Express service
    VIP: 120         // 120 km/h for VIP service
  };
  
  // Calculate the distance between two wilayas with road factor adjustment (1.3×)
  const straightLineDistance = calculateDistanceBetweenWilayas(wilaya1, wilaya2);
  const distance = straightLineDistance ; // Apply 1.3× multiplier to account for real road distance

  // Calculate price based on service type, distance and package size
  const basePrice = pricePerKm[serviceType as keyof typeof pricePerKm] * distance;
  const multiplier = packageMultipliers[packageType as keyof typeof packageMultipliers];
  const finalPrice = basePrice * multiplier;
  
  // Format price with thousands separator (4 000 DA)
  const formatPrice = (price: number): string => {
    return price.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' DA';
  };
  
  // Calculate estimated delivery time
  const averageSpeed = averageSpeeds[serviceType as keyof typeof averageSpeeds];
  const estimatedTimeHours = distance / averageSpeed;
  
  // Calculate maximum delivery time (worst case scenario)
  const maxDeliveryTimeHours = distance / averageSpeed;
  
  // Format delivery time (convert to hours and minutes)
  const formatDeliveryTime = (timeInHours: number) => {
    const hours = Math.floor(timeInHours);
    const minutes = Math.round((timeInHours - hours) * 60);
    
    if (hours === 0) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (minutes === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      return `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
  };

  return (
    <div className="container" style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '30px 25px',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      background: 'linear-gradient(to bottom right, #ffffff, #f5f5f5)',
      borderRadius: '14px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
    }}>
      <h1 style={{
        textAlign: 'center',
        color: '#2c3e50',
        marginBottom: '25px',
        fontSize: '28px',
        fontWeight: '600',
        letterSpacing: '0.5px',
        borderBottom: '2px solid #3498db',
        paddingBottom: '15px'
      }}>SpeedBox Delivery Calculator</h1>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '25px'
      }}>
        {/* Select Wilayas */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ color: '#3498db', marginTop: '0', fontSize: '20px' }}>From</h2>
          <label htmlFor="wilaya1" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            Select Origin Wilaya:
          </label>
          <select 
            id="wilaya1" 
            value={wilaya1} 
            onChange={(e) => setWilaya1(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              color: '#333',
              outline: 'none',
              backgroundColor: '#f9f9f9'
            }}
          >
            {Object.keys(wilayaLocations).map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ color: '#e74c3c', marginTop: '0', fontSize: '20px' }}>To</h2>
          <label htmlFor="wilaya2" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            Select Destination Wilaya:
          </label>
          <select 
            id="wilaya2" 
            value={wilaya2} 
            onChange={(e) => setWilaya2(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '6px',
              border: '1px solid #ddd',
              fontSize: '16px',
              color: '#333',
              outline: 'none',
              backgroundColor: '#f9f9f9'
            }}
          >
            {Object.keys(wilayaLocations).map((wilaya) => (
              <option key={wilaya} value={wilaya}>
                {wilaya}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Select Service Type */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 3px 10px rgba(0, 0, 0, 0.04)'
        }}>
          <h2 style={{ color: '#2ecc71', marginTop: '0', fontSize: '18px', fontWeight: '600' }}>Service Options</h2>
          <label htmlFor="serviceType" style={{ display: 'block', marginBottom: '10px', fontWeight: '500', color: '#555', fontSize: '15px' }}>
            Select Service Type:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <button 
              onClick={() => setServiceType('Standard')}
              style={{
                padding: '12px 8px',
                border: 'none',
                borderRadius: '6px',
                background: serviceType === 'Standard' ? '#3498db' : '#f5f5f5',
                color: serviceType === 'Standard' ? 'white' : '#444',
                fontWeight: serviceType === 'Standard' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: serviceType === 'Standard' ? '0 3px 6px rgba(52, 152, 219, 0.25)' : 'none',
                fontSize: '15px'
              }}
            >
              Standard
            </button>
            <button 
              onClick={() => setServiceType('Express')}
              style={{
                padding: '12px 8px',
                border: 'none',
                borderRadius: '6px',
                background: serviceType === 'Express' ? '#e67e22' : '#f5f5f5',
                color: serviceType === 'Express' ? 'white' : '#444',
                fontWeight: serviceType === 'Express' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: serviceType === 'Express' ? '0 3px 6px rgba(230, 126, 34, 0.25)' : 'none',
                fontSize: '15px'
              }}
            >
              Express
            </button>
            <button 
              onClick={() => setServiceType('VIP')}
              style={{
                padding: '12px 8px',
                border: 'none',
                borderRadius: '6px',
                background: serviceType === 'VIP' ? '#9b59b6' : '#f5f5f5',
                color: serviceType === 'VIP' ? 'white' : '#444',
                fontWeight: serviceType === 'VIP' ? '600' : '400',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: serviceType === 'VIP' ? '0 3px 6px rgba(155, 89, 182, 0.25)' : 'none',
                fontSize: '15px'
              }}
            >
              VIP
            </button>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            marginTop: '8px',
            fontSize: '13px',
            color: '#7f8c8d',
          }}>
            <span>2 DA/km</span>
            <span>5 DA/km</span>
            <span>7 DA/km</span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            marginTop: '4px',
            fontSize: '13px',
            color: '#7f8c8d',
          }}>
            <span>50 km/h</span>
            <span>80 km/h</span>
            <span>120 km/h</span>
          </div>
        </div>
        
        {/* Package Type Selection */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)'
        }}>
          <h2 style={{ color: '#9b59b6', marginTop: '0', fontSize: '20px' }}>Package Type</h2>
          <label htmlFor="packageType" style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#555' }}>
            Select Package Size:
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {['Small', 'Medium', 'Large', 'Oversized'].map(type => (
              <button 
                key={type}
                onClick={() => setPackageType(type)}
                style={{
                  padding: '12px 8px',
                  border: 'none',
                  borderRadius: '6px',
                  background: packageType === type ? '#9b59b6' : '#ecf0f1',
                  color: packageType === type ? 'white' : '#333',
                  fontWeight: packageType === type ? 'bold' : 'normal',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  boxShadow: packageType === type ? '0 4px 8px rgba(155, 89, 182, 0.3)' : 'none',
                  fontSize: '14px'
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <div style={{
            marginTop: '10px',
            fontSize: '14px',
            color: '#7f8c8d',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Small (×1)</span>
              <span>Medium (×1.5)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
              <span>Large (×2)</span>
              <span>Oversized (×3)</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Display Distance, Price and Time */}
      <div style={{
        background: 'linear-gradient(to right, #2c3e50, #34495e)',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 6px 12px rgba(44, 62, 80, 0.15)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '15px' }}>
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', opacity: 0.9, fontWeight: '400', letterSpacing: '0.5px' }}>Distance</h3>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{distance.toFixed(1)} km</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.6 }}>Road factor applied (1.3×)</p>
          </div>
          
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', left: 0, width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <div style={{ position: 'absolute', top: '10%', bottom: '10%', right: 0, width: '1px', background: 'rgba(255, 255, 255, 0.2)' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', opacity: 0.9, fontWeight: '400', letterSpacing: '0.5px' }}>Price</h3>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{formatPrice(finalPrice)}</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.6 }}>
              Base: {formatPrice(basePrice)} × {multiplier} ({packageType})
            </p>
          </div>
          
          <div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', opacity: 0.9, fontWeight: '400', letterSpacing: '0.5px' }}>Max Delivery Time</h3>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 'bold' }}>{formatDeliveryTime(maxDeliveryTimeHours)}</p>
            <p style={{ margin: '3px 0 0 0', fontSize: '12px', opacity: 0.6 }}>
              {averageSpeed} km/h · May arrive earlier
            </p>
          </div>
        </div>
        
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.08)', 
          padding: '12px', 
          borderRadius: '8px', 
          marginTop: '15px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.4' }}>
            <strong>{packageType}</strong> package | <strong>{wilaya1}</strong> → <strong>{wilaya2}</strong> | <strong>{serviceType}</strong> service
          </p>
        </div>
      </div>
      
      <footer style={{ 
        marginTop: '35px', 
        textAlign: 'center', 
        color: '#7f8c8d', 
        fontSize: '13px', 
        borderTop: '1px solid #eee',
        paddingTop: '15px'
      }}>
        <p style={{ margin: '0 0 5px 0' }}>SpeedBox Delivery Service - Price Calculator</p>
        <p style={{ margin: 0, fontSize: '12px', opacity: 0.7 }}>Prices include road factor adjustment (1.3×) for accurate estimation</p>
      </footer>
    </div>
  );
};

export default TestPage;
