'use client'
import { useState } from 'react';
import { calculateDistanceBetweenWilayas } from '@/utils/calculateDistance'; // Import the function to calculate the distance
import { wilayaLocations } from '@/data/wilayas'; // Import the wilayas and locations

const TestPage = () => {
  // Define state for the selected wilayas and service type
  const [wilaya1, setWilaya1] = useState('Algiers');
  const [wilaya2, setWilaya2] = useState('Oran');
  const [serviceType, setServiceType] = useState('Standard');
  
  // Price per km for different service types (example values)
  const pricePerKm = {
    Standard: 100,    // 100 DA per km for Standard service
    Express: 150,     // 150 DA per km for Express service
  };
  
  // Calculate the distance between two wilayas
  const distance = calculateDistanceBetweenWilayas(wilaya1, wilaya2);

  // Calculate price based on service type and distance
  const price = pricePerKm[serviceType as keyof typeof pricePerKm] * distance;

  return (
    <div>
      <h1>Test Distance and Price Calculation</h1>

      {/* Select Wilayas */}
      <div>
        <label htmlFor="wilaya1">Select First Wilaya: </label>
        <select id="wilaya1" value={wilaya1} onChange={(e) => setWilaya1(e.target.value)}>
          {Object.keys(wilayaLocations).map((wilaya) => (
            <option key={wilaya} value={wilaya}>
              {wilaya}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="wilaya2">Select Second Wilaya: </label>
        <select id="wilaya2" value={wilaya2} onChange={(e) => setWilaya2(e.target.value)}>
          {Object.keys(wilayaLocations).map((wilaya) => (
            <option key={wilaya} value={wilaya}>
              {wilaya}
            </option>
          ))}
        </select>
      </div>

      {/* Select Service Type */}
      <div>
        <label htmlFor="serviceType">Select Service Type: </label>
        <select id="serviceType" value={serviceType} onChange={(e) => setServiceType(e.target.value)}>
          <option value="Standard">Standard</option>
          <option value="Express">Express</option>
        </select>
      </div>

      {/* Display Distance and Price */}
      <div>
        <p>Distance between {wilaya1} and {wilaya2}: {distance.toFixed(2)} km</p>
        <p>Price for {serviceType} service: {price.toFixed(2)} DA</p>
      </div>
    </div>
  );
};

export default TestPage;
