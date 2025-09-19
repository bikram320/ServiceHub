import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import OTPVerificationModal from '../../Components/layout/OTPVerificationModal';
import styles from '../../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('identify'); // 'identify', 'verify', 'reset', 'success'
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showOTPModal, setShowOTPModal] = useState(false);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Step 1: Identify User and Send OTP
    const handleIdentifyUser = async () => {
        setIsLoading(true);
        setError('');

        try {
            if (!formData.email) throw new Error('Email address is required');
            if (!validateEmail(formData.email)) throw new Error('Please enter a valid email address');

            const response = await fetch('http://localhost:5000/auth/login/user/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to send OTP');
            }

            setShowOTPModal(true); // Show OTP modal
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Step 2: Verify OTP from Modal
    const handleOTPVerify = async (otpCode) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/auth/login/user/forget-password/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email, otp: otpCode })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Invalid OTP code');
            }

            setShowOTPModal(false);
            setStep('reset'); // Move to reset password step
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        try {
            await fetch('http://localhost:5000/auth/login/user/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });
            alert('OTP resent successfully');
        } catch (err) {
            alert('Failed to resend OTP');
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async () => {
        setIsLoading(true);
        setError('');

        try {
            const { newPassword, confirmPassword, email } = formData;

            if (!newPassword) throw new Error('New password is required');
            if (newPassword.length < 8) throw new Error('Password must be at least 8 characters long');
            if (!confirmPassword) throw new Error('Please confirm your password');
            if (newPassword !== confirmPassword) throw new Error('Passwords do not match');

            const hasUpperCase = /[A-Z]/.test(newPassword);
            const hasLowerCase = /[a-z]/.test(newPassword);
            const hasNumbers = /\d/.test(newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                throw new Error('Password must contain uppercase, lowercase, number, and special character');
            }

            // Call backend reset password API
            const response = await fetch('http://localhost:5000/auth/login/user/forget-password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    resetToken: 'token-from-otp-step', // ideally should be returned from verify OTP API
                    password: newPassword
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to reset password');
            }

            setStep('success'); // Password reset successful
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Render step-specific UI
    const renderIdentifyStep = () => (
        <div className={styles["forgot-password-form"]}>
            <h2>Reset Your Password</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                disabled={isLoading}
            />
            {error && <div className={styles["error-message"]}>{error}</div>}
            <button onClick={handleIdentifyUser} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
        </div>
    );

    const renderResetStep = () => (
        <div className={styles["forgot-password-form"]}>
            <h2>Create New Password</h2>
            <div className={styles["password-input-wrapper"]}>
                <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="New Password"
                    value={formData.newPassword}
                    onChange={e => handleInputChange('newPassword', e.target.value)}
                    disabled={isLoading}
                />
                <button onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            <div className={styles["password-input-wrapper"]}>
                <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={e => handleInputChange('confirmPassword', e.target.value)}
                    disabled={isLoading}
                />
                <button onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>

            {error && <div className={styles["error-message"]}>{error}</div>}

            <button onClick={handleResetPassword} disabled={isLoading}>
                {isLoading ? 'Resetting...' : 'Reset Password'}
            </button>
        </div>
    );

    const renderSuccessStep = () => (
        <div className={styles["forgot-password-form"]}>
            <CheckCircle size={64} />
            <h2>Password Reset Successful!</h2>
            <p>You can now log in with your new password.</p>
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );

    return (
        <div className={styles["forgot-password-container"]}>
            {step === 'identify' && renderIdentifyStep()}
            {step === 'reset' && renderResetStep()}
            {step === 'success' && renderSuccessStep()}

            {/* OTP Verification Modal */}
            <OTPVerificationModal
                isOpen={showOTPModal}
                onClose={() => setShowOTPModal(false)}
                onVerify={handleOTPVerify}
                onResendOTP={handleResendOTP}
                email={formData.email}
                isLoading={isLoading}
                resendCooldown={30}
            />
        </div>
    );
};

export default ForgotPassword;
