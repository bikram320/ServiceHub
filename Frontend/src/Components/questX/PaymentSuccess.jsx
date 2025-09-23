import React from 'react';
import { CheckCircle, ArrowLeft, Calendar } from 'lucide-react';

const PaymentSuccess = () => {
    const handleViewBookings = () => {
        window.location.href = '/UserLayout';
    };

    const handleBackToHome = () => {
        window.location.href = '/UserLayout';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Payment Successful!
                    </h1>
                    <p className="text-gray-600">
                        Your payment has been processed successfully. Your service booking is confirmed.
                    </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-green-800 mb-2">What's Next?</h3>
                    <ul className="text-sm text-green-700 space-y-1">
                        <li>• You'll receive a confirmation email shortly</li>
                        <li>• The technician will contact you before the appointment</li>
                        <li>• You can view your booking details in your dashboard</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleViewBookings}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <Calendar className="w-4 h-4 inline mr-2" />
                        View My Bookings
                    </button>

                    <button
                        onClick={handleBackToHome}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 inline mr-2" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;