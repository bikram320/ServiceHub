import React, { useState } from 'react';
import {
    Mail,
    Phone,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff,
    Shield
} from 'lucide-react';
import "../../styles/ForgotPassword.css";

const ForgotPassword = ({ onBackToLogin, onPasswordReset }) => {
    const [step, setStep] = useState('identify'); // 'identify', 'verify', 'reset', 'success'
    const [method, setMethod] = useState('email'); // 'email' or 'phone'
    const [formData, setFormData] = useState({
        email: '',
        phone: '',
        verificationCode: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError('');
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\+?977[0-9]{10}$|^[0-9]{10}$/;
        return phoneRegex.test(phone);
    };

    const handleIdentifyUser = async () => {
        setIsLoading(true);
        setError('');

        try {
            // Validate input
            if (method === 'email') {
                if (!formData.email) {
                    throw new Error('Email address is required');
                }
                if (!validateEmail(formData.email)) {
                    throw new Error('Please enter a valid email address');
                }
            } else {
                if (!formData.phone) {
                    throw new Error('Phone number is required');
                }
                if (!validatePhone(formData.phone)) {
                    throw new Error('Please enter a valid phone number');
                }
            }

            // Simulate API call to send verification code
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, we'll assume the user exists
            // In real implementation, you'd call your API here
            console.log('Sending verification code to:', method === 'email' ? formData.email : formData.phone);

            setStep('verify');
            startResendTimer();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyCode = async () => {
        setIsLoading(true);
        setError('');

        try {
            if (!formData.verificationCode) {
                throw new Error('Verification code is required');
            }
            if (formData.verificationCode.length !== 6) {
                throw new Error('Verification code must be 6 digits');
            }

            // use API call to verify code
            await new Promise(resolve => setTimeout(resolve, 1500));

            // for now accepts any 6-digit code except 000000
            if (formData.verificationCode === '000000') {
                throw new Error('Invalid verification code. Please try again.');
            }

            setStep('reset');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async () => {
        setIsLoading(true);
        setError('');

        try {
            if (!formData.newPassword) {
                throw new Error('New password is required');
            }
            if (formData.newPassword.length < 8) {
                throw new Error('Password must be at least 8 characters long');
            }
            if (!formData.confirmPassword) {
                throw new Error('Please confirm your password');
            }
            if (formData.newPassword !== formData.confirmPassword) {
                throw new Error('Passwords do not match');
            }

            // Validate password strength
            const hasUpperCase = /[A-Z]/.test(formData.newPassword);
            const hasLowerCase = /[a-z]/.test(formData.newPassword);
            const hasNumbers = /\d/.test(formData.newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                throw new Error('Password must contain at least one uppercase letter, lowercase letter, number, and special character');
            }

            // Simulate API call to reset password
            await new Promise(resolve => setTimeout(resolve, 2000));

            setStep('success');

            // Call the parent callback if provided
            if (onPasswordReset) {
                onPasswordReset({
                    method,
                    identifier: method === 'email' ? formData.email : formData.phone
                });
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        if (resendTimer > 0) return;

        setIsLoading(true);
        setError('');

        try {
            // Simulate API call to resend code
            await new Promise(resolve => setTimeout(resolve, 1000));

            console.log('Resending verification code to:', method === 'email' ? formData.email : formData.phone);
            startResendTimer();
        } catch (err) {
            setError('Failed to resend code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const startResendTimer = () => {
        setResendTimer(60);
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    };

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter' && !isLoading) {
            action();
        }
    };

    const renderIdentifyStep = () => (
        <div className="forgot-password-form">
            <div className="form-header">
                <h2 className="form-title">Reset Your Password</h2>
                <p className="form-subtitle">
                    Enter your email address or phone number and we'll send you a verification code.
                </p>
            </div>

            <div className="method-selector">
                <div className="method-options">
                    <button
                        type="button"
                        className={`method-btn ${method === 'email' ? 'active' : ''}`}
                        onClick={() => setMethod('email')}
                    >
                        <Mail size={20} />
                        Email
                    </button>
                    <button
                        type="button"
                        className={`method-btn ${method === 'phone' ? 'active' : ''}`}
                        onClick={() => setMethod('phone')}
                    >
                        <Phone size={20} />
                        Phone
                    </button>
                </div>
            </div>

            <div className="reset-form">
                {method === 'email' ? (
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleIdentifyUser)}
                            placeholder="Enter your email address"
                            disabled={isLoading}
                        />
                    </div>
                ) : (
                    <div className="form-group">
                        <label htmlFor="phone" className="form-label">Phone Number</label>
                        <input
                            type="tel"
                            id="phone"
                            className="form-input"
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleIdentifyUser)}
                            placeholder="Enter your phone number"
                            disabled={isLoading}
                        />
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="button"
                    className="submit-btn"
                    onClick={handleIdentifyUser}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="spinning" />
                            Sending...
                        </>
                    ) : (
                        'Send Verification Code'
                    )}
                </button>
            </div>
        </div>
    );

    const renderVerifyStep = () => (
        <div className="forgot-password-form">
            <div className="form-header">
                <h2 className="form-title">Verify Your Identity</h2>
                <p className="form-subtitle">
                    We've sent a 6-digit verification code to{' '}
                    <strong>{method === 'email' ? formData.email : formData.phone}</strong>
                </p>
            </div>

            <div className="reset-form">
                <div className="form-group">
                    <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                    <input
                        type="text"
                        id="verificationCode"
                        className="form-input verification-input"
                        value={formData.verificationCode}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                            handleInputChange('verificationCode', value);
                        }}
                        onKeyPress={(e) => handleKeyPress(e, handleVerifyCode)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <div className="resend-section">
                    <p className="resend-text">
                        Didn't receive the code?{' '}
                        {resendTimer > 0 ? (
                            <span className="resend-timer">Resend in {resendTimer}s</span>
                        ) : (
                            <button
                                type="button"
                                className="resend-btn"
                                onClick={handleResendCode}
                                disabled={isLoading}
                            >
                                Resend Code
                            </button>
                        )}
                    </p>
                </div>

                <button
                    type="button"
                    className="submit-btn"
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="spinning" />
                            Verifying...
                        </>
                    ) : (
                        'Verify Code'
                    )}
                </button>
            </div>
        </div>
    );

    const renderResetStep = () => (
        <div className="forgot-password-form">
            <div className="form-header">
                <h2 className="form-title">Create New Password</h2>
                <p className="form-subtitle">
                    Please create a strong password for your account.
                </p>
            </div>

            <div className="reset-form">
                <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            className="form-input"
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                            placeholder="Enter new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="password-input-wrapper">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className="form-input"
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className="password-requirements">
                    <p className="requirements-title">Password must contain:</p>
                    <ul className="requirements-list">
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                    </ul>
                </div>

                {error && (
                    <div className="error-message">
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="button"
                    className="submit-btn"
                    onClick={handleResetPassword}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className="spinning" />
                            Resetting...
                        </>
                    ) : (
                        'Reset Password'
                    )}
                </button>
            </div>
        </div>
    );

    const renderSuccessStep = () => (
        <div className="forgot-password-form">
            <div className="success-content">
                <div className="success-icon">
                    <CheckCircle size={64} />
                </div>
                <h2 className="success-title">Password Reset Successful!</h2>
                <p className="success-message">
                    Your password has been successfully updated. You can now log in with your new password.
                </p>
                <button
                    type="button"
                    className="submit-btn"
                    onClick={onBackToLogin}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '2rem',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <div style={{
                background: 'white',
                borderRadius: '16px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                width: '100%',
                maxWidth: '480px',
                padding: '2rem',
                position: 'relative'
            }}>
                {step !== 'success' && (
                    <button
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            left: '1rem',
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            fontSize: '0.875rem',
                            padding: '0.5rem',
                            borderRadius: '8px',
                            transition: 'all 0.2s'
                        }}
                        onClick={step === 'identify' ? onBackToLogin : () => setStep(step === 'verify' ? 'identify' : 'verify')}
                        disabled={isLoading}
                        onMouseOver={(e) => {
                            e.target.style.background = '#f1f5f9';
                            e.target.style.color = '#1e293b';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = 'none';
                            e.target.style.color = '#64748b';
                        }}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                )}

                <div style={{ margin: '2rem 0' }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        gap: '2rem',
                        marginBottom: '2rem'
                    }}>
                        {[
                            { step: 'identify', label: 'Identify', num: 1 },
                            { step: 'verify', label: 'Verify', num: 2 },
                            { step: 'reset', label: 'Reset', num: 3 }
                        ].map((stepItem) => {
                            const isActive = step === stepItem.step;
                            const isCompleted = (step === 'verify' && stepItem.step === 'identify') ||
                                (step === 'reset' && (stepItem.step === 'identify' || stepItem.step === 'verify')) ||
                                (step === 'success' && stepItem.step !== 'success');

                            return (
                                <div key={stepItem.step} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    color: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#94a3b8'
                                }}>
                                    <div style={{
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        background: isActive ? '#3b82f6' : isCompleted ? '#10b981' : '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: '600',
                                        fontSize: '0.875rem',
                                        color: isActive || isCompleted ? 'white' : '#64748b',
                                        transition: 'all 0.3s'
                                    }}>
                                        {stepItem.num}
                                    </div>
                                    <span style={{ fontSize: '0.875rem' }}>{stepItem.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div style={{ maxWidth: '400px', margin: '0 auto' }}>
                    {step === 'identify' && renderIdentifyStep()}
                    {step === 'verify' && renderVerifyStep()}
                    {step === 'reset' && renderResetStep()}
                    {step === 'success' && renderSuccessStep()}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;