'use client'

import { useEffect, useState } from 'react'
import { Package, ArrowLeft, Clock, Download, Printer } from 'lucide-react'
import Link from 'next/link'
import { trackDeliveryById } from '@/app/tracking-actions'
import { Button } from '@/components/ui/button'
import { useParams } from 'next/navigation'

// Format date helper
function formatDate(dateString: string) {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Get color based on status
function getStatusColor(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-purple-900/50 text-purple-300 border border-purple-800';
    case 'In Transit':
      return 'bg-blue-900/50 text-blue-300 border border-blue-800';
    case 'Delivered':
      return 'bg-green-900/50 text-green-300 border border-green-800';
    case 'Cancelled':
      return 'bg-red-900/50 text-red-300 border border-red-800';
    case 'Returned':
      return 'bg-orange-900/50 text-orange-300 border border-orange-800';
    default:
      return 'bg-gray-900/50 text-gray-300 border border-gray-800';
  }
}

// Get progress percentage for the status bar
function getProgressPercentage(status: string) {
  switch (status) {
    case 'Pending':
      return '0%';
    case 'In Transit':
      return '50%';
    case 'Delivered':
      return '100%';
    case 'Cancelled':
      return '100%';
    case 'Returned':
      return '100%';
    default:
      return '0%';
  }
}

// Get status color class for the status banner
function getStatusColorClass(status: string) {
  switch (status) {
    case 'Pending':
      return 'border-purple-800 bg-purple-900/30';
    case 'In Transit':
      return 'border-blue-800 bg-blue-900/30';
    case 'Delivered':
      return 'border-green-800 bg-green-900/30';
    case 'Cancelled':
      return 'border-red-800 bg-red-900/30';
    case 'Returned':
      return 'border-orange-800 bg-orange-900/30';
    default:
      return 'border-gray-700 bg-gray-800';
  }
}

// Get status icon background color
function getStatusIconBg(status: string) {
  switch (status) {
    case 'Pending':
      return 'bg-purple-700 text-purple-100';
    case 'In Transit':
      return 'bg-blue-700 text-blue-100';
    case 'Delivered':
      return 'bg-green-700 text-green-100';
    case 'Cancelled':
      return 'bg-red-700 text-red-100';
    case 'Returned':
      return 'bg-orange-700 text-orange-100';
    default:
      return 'bg-gray-700 text-gray-100';
  }
}

// Get status icon based on status
function getStatusIcon(status: string) {
  switch (status) {
    case 'Pending':
      return <Clock className="h-6 w-6" />;
    case 'In Transit':
      return <Package className="h-6 w-6" />;
    case 'Delivered':
      return <span className="text-lg">✓</span>;
    case 'Cancelled':
      return <span className="text-lg">✕</span>;
    case 'Returned':
      return <ArrowLeft className="h-6 w-6" />;
    default:
      return <Package className="h-6 w-6" />;
  }
}

// Get status message based on status and locations
function getStatusMessage(status: string, origin: string, destination: string) {
  switch (status) {
    case 'Pending':
      return 'This delivery is available for drivers and will be picked up soon.';
    case 'In Transit':
      return `Driver has picked up the package and is en route to ${destination}.`;
    case 'Delivered':
      return `Package has been successfully delivered to ${destination}.`;
    case 'Cancelled':
      return 'This delivery was cancelled by the client.';
    case 'Returned':
      return `Package has been returned to ${origin}.`;
    default:
      return 'Tracking status updated.';
  }
}

export default function TrackingPage() {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [error, setError] = useState<string | null | undefined>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const trackingId = params?.id as string;
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await trackDeliveryById(trackingId);
        if ('error' in result) {
          setError(result.error || 'An error occurred while tracking the delivery');
        } else if ('delivery' in result) {
          setTrackingData(result.delivery);
        }
      } catch (err) {
        setError('Failed to load tracking information');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [trackingId]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4 text-gray-300">Loading tracking information...</p>
        </div>
      </div>
    );
  }
  
  // Handle not found
  if (error || !trackingData) {
    return (
      <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-900/30">
              <Clock className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-white">Delivery Not Found</h3>
            <p className="mt-1 text-sm text-gray-300">
              {error || "We couldn't find any delivery with the provided tracking ID."}
            </p>
            <div className="mt-6">
              <Link href="/tracking" passHref>
                <Button variant="outline" className="flex items-center bg-gray-800 text-blue-400 border-blue-400 hover:bg-gray-700">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Try Another Tracking ID
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(trackingData, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `speedbox-tracking-${trackingData.id}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handlePrint = () => {
    window.print();
  };

  const delivery = trackingData;

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 print:bg-white print:min-h-0 print:p-0">
      <div className="max-w-4xl mx-auto print:max-w-none print:m-0">
        {/* Global print styles */}
        <style jsx global>{`
          @media print {
            body {
              background-color: white !important;
              margin: 0 !important;
              padding: 0 !important;
              color: black !important;
            }
            * {
              color-adjust: exact !important;
              print-color-adjust: exact !important;
              -webkit-print-color-adjust: exact !important;
              background-color: white !important;
              border-color: #ddd !important;
              color: black !important;
              box-shadow: none !important;
            }
          }
        `}</style>
        {/* Heading - hidden when printing */}
        <div className="mb-6 md:flex md:items-center md:justify-between print:hidden">
          <div className="flex-1 min-w-0">
            <Link href="/tracking" className="group inline-flex items-center text-sm text-gray-400 hover:text-blue-400 mb-2">
              <ArrowLeft className="h-4 w-4 mr-1 group-hover:-translate-x-1 transition-transform" />
              Back to Tracking
            </Link>
            <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
              Tracking Details
            </h2>
          </div>

          {/* Action buttons */}
          <div className="mt-4 flex-shrink-0 flex space-x-2 md:mt-0">
            <Button
              variant="outline"
              className="py-2 px-4 flex bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white hover:border-gray-600"
              onClick={handlePrint}
            >
              <Printer className="mr-2 h-4 w-4" />
              Print
            </Button>
            <Button
              variant="outline"
              className="py-2 px-4 flex bg-gray-800 text-blue-400 border-blue-400 hover:bg-blue-700 hover:text-white hover:border-blue-300"
              onClick={handleDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
        
        {/* Prominent Status Display (screen only) */}
        <div className={`print:hidden mb-6 p-4 rounded-lg border ${getStatusColorClass(delivery.status)}`}>
          <div className="flex items-center">
            <div className="mr-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getStatusIconBg(delivery.status)}`}>
                {getStatusIcon(delivery.status)}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">
                {delivery.status}
              </h3>
              <p className="text-sm">
                {getStatusMessage(delivery.status, delivery.origin, delivery.destination)}
              </p>
            </div>
          </div>
        </div>

        {/* Centered receipt */}
        <div className="max-w-md mx-auto print:max-w-full print:m-0 print:p-0">
          <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg print:shadow-none overflow-hidden print:border print:border-gray-300 print:rounded-none print:w-[270px] print:mx-auto print:bg-white">
            {/* Header with logo and title */}
            <div className="border-b border-gray-700 p-4 print:p-2 text-center bg-blue-900/30 print:bg-white print:border-gray-300">
              <div className="flex items-center justify-center mb-2">
                <Package className="h-6 w-6 text-blue-400 print:text-black mr-1" />
                <h1 className="font-bold text-base text-white print:text-black">SpeedBox</h1>
              </div>
              <p className="text-xs text-gray-300 print:text-black">Delivery Receipt</p>
            </div>

            {/* Tracking details */}
            <div className="p-4 print:p-2 text-sm">
              {/* Tracking ID */}
              <div className="mb-4 pb-2 border-b border-dashed border-gray-700 print:border-gray-300">
                <div className="grid grid-cols-1 gap-1 text-center">
                  <p className="text-xs font-medium text-gray-400 print:text-black">Tracking Number</p>
                  <p className="font-bold text-base break-all text-white print:text-black">{delivery.id}</p>
                </div>
              </div>

              {/* Shipment info */}
              <table className="w-full text-xs mb-4">
                <tbody>
                  <tr>
                    <td className="py-1 text-gray-400 print:text-black font-medium">Date:</td>
                    <td className="py-1 text-right text-gray-200 print:text-black">{formatDate(delivery.createdAt)}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-400 print:text-black font-medium">From:</td>
                    <td className="py-1 text-right text-gray-200 print:text-black">{delivery.origin}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-400 print:text-black font-medium">To:</td>
                    <td className="py-1 text-right text-gray-200 print:text-black">{delivery.destination}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-400 print:text-black font-medium">Package Type:</td>
                    <td className="py-1 text-right text-gray-200 print:text-black">{delivery.packageType || 'Standard'}</td>
                  </tr>
                  <tr>
                    <td className="py-1 text-gray-400 print:text-black font-medium">Service:</td>
                    <td className="py-1 text-right text-gray-200 print:text-black">{delivery.serviceType}</td>
                  </tr>
                  {delivery.distance_km && (
                    <tr>
                      <td className="py-1 text-gray-400 print:text-black font-medium">Distance:</td>
                      <td className="py-1 text-right text-gray-200 print:text-black">{delivery.distance_km} km</td>
                    </tr>
                  )}
                </tbody>
              </table>
              
              {/* Sender/Recipient */}
              <div className="mb-2 pb-2 border-b border-dashed border-gray-700 print:border-gray-300">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-400 print:text-black">Sender</p>
                    <p className="text-sm font-medium text-white print:text-black">{delivery.sender_name}</p>
                    <p className="text-xs text-gray-300 print:text-black mt-1">
                      {delivery.sender_phone || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-400 print:text-black">Recipient</p>
                    <p className="text-sm font-medium text-white print:text-black">{delivery.receiver_name}</p>
                    <p className="text-xs text-gray-300 print:text-black mt-1">
                      {delivery.receiver_phone || 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Price info if available */}
              {delivery.price && (
                <div className="text-center mb-2 mt-4 p-2 bg-blue-900/30 print:bg-white rounded-md print:border print:border-gray-300">
                  <p className="text-xs text-gray-400 print:text-black">Shipping Cost</p>
                  <p className="text-base font-bold text-blue-400 print:text-black">{delivery.price} DA</p>
                </div>
              )}
            </div>
            
            {/* Footer */}
            <div className="border-t border-dashed border-gray-700 print:border-gray-300 p-3 print:p-2 text-center bg-blue-900/30 print:bg-white">
              <p className="text-xs text-gray-300 print:text-black">www.speedbox.com</p>
              <p className="text-xs text-gray-400 print:text-black">Thank you for choosing SpeedBox</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
