import React from 'react';
import { CheckCircle, ArrowLeft, Calendar, Shield } from 'lucide-react';
import styles from '../../styles/Payment.module.css';

const PaymentSuccess = ({ sidebarCollapsed = false }) => {
    const handleViewBookings = () => {
        window.location.href = '/UserLayout';
    };

    const handleBackToHome = () => {
        window.location.href = '/UserLayout';
    };

    return (
        <div className={`${styles.paymentWrapper} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
            <div className={styles.pageContainer}>
                <div className={styles.container}>
                    <div className={styles.paymentContainer}>
                        <div className={styles.successMessage}>
                            <CheckCircle className={styles.successIcon} size={80} />
                            <h1 className={styles.successTitle}>Payment Successful!</h1>
                            <p className={styles.successDescription}>
                                Your payment has been processed successfully. Your service booking is confirmed.
                            </p>

                            <div className={styles.nextStepsCard}>
                                <div className={styles.nextStepsHeader}>
                                    <Shield size={18} />
                                    <h3 className={styles.nextStepsTitle}>What's Next?</h3>
                                </div>
                                <div className={styles.nextStepsList}>
                                    <div className={styles.nextStepItem}>
                                        <span>You'll receive a confirmation email shortly</span>
                                    </div>
                                    <div className={styles.nextStepItem}>
                                        <span>The technician will contact you before the appointment</span>
                                    </div>
                                    <div className={styles.nextStepItem}>
                                        <span>You can view your booking details in your dashboard</span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.successActions}>
                                <button
                                    onClick={handleViewBookings}
                                    className={styles.btnPrimary}
                                >
                                    <Calendar size={20} />
                                    View My Bookings
                                </button>

                                <button
                                    onClick={handleBackToHome}
                                    className={styles.btnSecondary}
                                >
                                    <ArrowLeft size={20} />
                                    Back to Home
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;