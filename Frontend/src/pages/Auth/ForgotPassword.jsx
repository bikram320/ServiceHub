import React, { useState } from 'react';
import { ArrowLeft, CheckCircle, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import OTPVerificationModal from '../../Components/layout/OTPVerificationModal';
import styles from '../../styles/ForgotPassword.module.css';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState('identify'); // 'identify', 'reset', 'success'
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
    const [otpToken, setOtpToken] = useState(''); // Store token from OTP verification

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    // Step 1: Identify User and Send OTP
    const handleIdentifyUser = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (!formData.email) throw new Error('Email address is required');
            if (!validateEmail(formData.email)) throw new Error('Please enter a valid email address');

            const response = await fetch('http://localhost:8080/auth/login/user/forget-password', {
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

            const data = await response.json();
            setOtpToken(data.resetToken || 'verified'); // Store reset token
            setShowOTPModal(false);
            setStep('reset'); // Move to reset password step
        } catch (err) {
            throw new Error(err.message); // Re-throw to let modal handle the error
        }
    };

    const handleResendOTP = async () => {
        try {
            const response = await fetch('http://localhost:5000/auth/login/user/forget-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.ok) {
                throw new Error('Failed to resend OTP');
            }
        } catch (err) {
            throw new Error(err.message);
        }
    };

    // Step 3: Reset Password
    const handleResetPassword = async (e) => {
        e.preventDefault();
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

            const response = await fetch('http://localhost:5000/auth/login/user/forget-password/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    resetToken: otpToken,
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

    const handleBackToLogin = () => {
        navigate('/login');
    };

    const handleBackToIdentify = () => {
        setStep('identify');
        setError('');
        setFormData({
            email: formData.email, // Keep email
            newPassword: '',
            confirmPassword: ''
        });
    };

    // Render step-specific UI
    const renderIdentifyStep = () => (
        <div className={styles["forgot-password-content"]}>
            <div className={styles["header-section"]}>
                <div className={styles["icon-container"]}>
                    <Mail size={32} />
                </div>
                <h1 className={styles["form-title"]}>Reset Your Password</h1>
                <p className={styles["form-subtitle"]}>
                    Enter your email address and we'll send you a verification code
                </p>
            </div>

            <form onSubmit={handleIdentifyUser} className={styles["forgot-form"]}>
                <div className={styles["input-group"]}>
                    <Mail className={styles["input-icon"]} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email address"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className={styles["forgot-input"]}
                        disabled={isLoading}
                        required
                    />
                </div>

                {error && (
                    <div className={styles["error-message"]}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles["forgot-submit-btn"]}
                    disabled={isLoading}
                >
                    {isLoading ? 'Sending...' : 'Send Verification Code'}
                </button>
            </form>

            <button
                className={styles["back-link"]}
                onClick={() => navigate("/LoginSignup")}
            >
                <ArrowLeft size={16} />
                Back to Login
            </button>
        </div>
    );

    const renderResetStep = () => (
        <div className={styles["forgot-password-content"]}>
            <div className={styles["header-section"]}>
                <div className={styles["icon-container"]}>
                    <Lock size={32} />
                </div>
                <h1 className={styles["form-title"]}>Create New Password</h1>
                <p className={styles["form-subtitle"]}>
                    Your identity has been verified. Please create a new password
                </p>
            </div>

            <form onSubmit={handleResetPassword} className={styles["forgot-form"]}>
                <div className={styles["input-group"]}>
                    <Lock className={styles["input-icon"]} />
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="newPassword"
                        placeholder="New Password"
                        value={formData.newPassword}
                        onChange={(e) => handleInputChange('newPassword', e.target.value)}
                        className={`${styles["forgot-input"]} ${styles["password-input"]}`}
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className={styles["password-toggle"]}
                    >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className={styles["input-group"]}>
                    <Lock className={styles["input-icon"]} />
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        placeholder="Confirm New Password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        className={`${styles["forgot-input"]} ${styles["password-input"]}`}
                        disabled={isLoading}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className={styles["password-toggle"]}
                    >
                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>

                <div className={styles["password-requirements"]}>
                    <p>Password must contain:</p>
                    <ul>
                        <li>At least 8 characters</li>
                        <li>Uppercase and lowercase letters</li>
                        <li>At least one number</li>
                        <li>At least one special character</li>
                    </ul>
                </div>

                {error && (
                    <div className={styles["error-message"]}>
                        <AlertCircle size={16} />
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles["forgot-submit-btn"]}
                    disabled={isLoading}
                >
                    {isLoading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>

            <button
                className={styles["back-link"]}
                onClick={handleBackToIdentify}
            >
                <ArrowLeft size={16} />
                Back
            </button>
        </div>
    );

    const renderSuccessStep = () => (
        <div className={styles["forgot-password-content"]}>
            <div className={styles["success-section"]}>
                <div className={styles["success-icon"]}>
                    <CheckCircle size={64} />
                </div>
                <h1 className={styles["success-title"]}>Password Reset Successful!</h1>
                <p className={styles["success-subtitle"]}>
                    Your password has been successfully reset. You can now log in with your new password.
                </p>

                <button
                    className={styles["forgot-submit-btn"]}
                    onClick={() => navigate("/LoginSignup")}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles["forgot-password-container"]}>
            <div className={styles["forgot-password-card"]}>
                {step === 'identify' && renderIdentifyStep()}
                {step === 'reset' && renderResetStep()}
                {step === 'success' && renderSuccessStep()}
            </div>

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