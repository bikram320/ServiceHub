import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, Phone } from 'lucide-react';

const PaymentFailure = () => {
    const handleTryAgain = () => {
        window.history.back();
    };

    const handleBackToHome = () => {
        window.location.href = '/';
    };

    const handleContact = () => {
        window.location.href = '/contact';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                <div className="mb-6">
                    <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                        Payment Failed
                    </h1>
                    <p className="text-gray-600">
                        We couldn't process your payment. Your booking has not been confirmed.
                    </p>
                </div>

                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-red-800 mb-2">Common Issues:</h3>
                    <ul className="text-sm text-red-700 space-y-1 text-left">
                        <li>• Insufficient balance in your eSewa account</li>
                        <li>• Network connection issues during payment</li>
                        <li>• Payment was cancelled or timed out</li>
                        <li>• Technical issues with the payment gateway</li>
                    </ul>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={handleTryAgain}
                        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <RefreshCw className="w-4 h-4 inline mr-2" />
                        Try Payment Again
                    </button>

                    <button
                        onClick={handleContact}
                        className="w-full bg-orange-100 text-orange-700 py-3 px-4 rounded-lg hover:bg-orange-200 transition-colors font-medium"
                    >
                        <Phone className="w-4 h-4 inline mr-2" />
                        Contact Support
                    </button>

                    <button
                        onClick={handleBackToHome}
                        className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 inline mr-2" />
                        Back to Home
                    </button>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                        No amount has been charged from your account. You can safely retry the payment.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;