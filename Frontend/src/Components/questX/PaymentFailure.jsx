import React from 'react';
import { XCircle, ArrowLeft, RefreshCw, Phone } from 'lucide-react';
import styles from '../../styles/Payment.module.css';

const PaymentFailure = ({ sidebarCollapsed = false }) => {
    const handleTryAgain = () => {
        window.history.back();
    };

    const handleBackToHome = () => {
        window.location.href = '/UserLayout';
    };

    const handleContact = () => {
        window.location.href = '/contact';
    };

    return (
        <div className={`${styles.paymentWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <div className={styles.paymentContainer}>
                        <div className={styles.successMessage}>
                            <XCircle className={styles.successIcon} size={80} style={{ color: '#dc2626' }} />
                            <h1 className={styles.successTitle} style={{ color: '#dc2626' }}>Payment Failed</h1>
                            <p className={styles.successDescription}>
                                We couldn't process your payment. Your booking has not been confirmed.
                            </p>

                            <div className={styles.nextStepsCard} style={{
                                background: '#fef2f2',
                                border: '2px solid #fecaca'
                            }}>
                                <div className={styles.nextStepsHeader}>
                                    <h3 className={styles.nextStepsTitle} style={{ color: '#991b1b' }}>
                                        Common Issues:
                                    </h3>
                                </div>
                                <div className={styles.nextStepsList}>
                                    <div className={styles.nextStepItem} style={{ color: '#b91c1c' }}>
                                        <span>Insufficient balance in your eSewa account</span>
                                    </div>
                                    <div className={styles.nextStepItem} style={{ color: '#b91c1c' }}>
                                        <span>Network connection issues during payment</span>
                                    </div>
                                    <div className={styles.nextStepItem} style={{ color: '#b91c1c' }}>
                                        <span>Payment was cancelled or timed out</span>
                                    </div>
                                    <div className={styles.nextStepItem} style={{ color: '#b91c1c' }}>
                                        <span>Technical issues with the payment gateway</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.successActions}>
                                <button
                                    onClick={handleTryAgain}
                                    className={styles.btnPrimary}
                                    style={{
                                        background: '#76af8c',
                                        boxShadow: '0 8px 20px rgba(37, 99, 235, 0.3)'
                                    }}
                                >
                                    <RefreshCw size={20} />
                                    Try Payment Again
                                </button>

                                <button
                                    onClick={handleContact}
                                    className={styles.btnSecondary}
                                    style={{
                                        background: '#c2410c',
                                        color: 'white',
                                        borderColor: '#c2410c'
                                    }}
                                >
                                    <Phone size={20} />
                                    Contact Support
                                </button>

                                <button
                                    onClick={handleBackToHome}
                                    className={styles.btnSecondary}
                                >
                                    <ArrowLeft size={20} />
                                    Back to Home
                                </button>
                            </div>

                            <div className={styles.successGuarantee} style={{
                                color: '#6b7280',
                                borderTop: '1px solid #e5e7eb',
                                paddingTop: '1rem',
                                marginTop: '1.5rem'
                            }}>
                                <p style={{ fontSize: '0.75rem' }}>
                                    No amount has been charged from your account. You can safely retry the payment.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;