import React, { useState } from 'react';
import {
    Mail,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    Loader2,
    Eye,
    EyeOff
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import styles from '../../styles/ForgotPassword.module.css';

const ForgotPassword = ({ onBackToLogin, onPasswordReset }) => {
    const navigate = useNavigate();
    const [step, setStep] = useState('identify'); // 'identify', 'verify', 'reset', 'success'
    const [method, setMethod] = useState('email'); // 'email'
    const [formData, setFormData] = useState({
        email: '',
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

    const handleIdentifyUser = async () => {
        setIsLoading(true);
        setError('');

        try {
            if (method === 'email') {
                if (!formData.email) {
                    throw new Error('Email address is required');
                }
                if (!validateEmail(formData.email)) {
                    throw new Error('Please enter a valid email address');
                }
            }

            await new Promise(resolve => setTimeout(resolve, 2000));
            console.log('Sending verification code to:', formData.email);

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

            await new Promise(resolve => setTimeout(resolve, 1500));

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

            const hasUpperCase = /[A-Z]/.test(formData.newPassword);
            const hasLowerCase = /[a-z]/.test(formData.newPassword);
            const hasNumbers = /\d/.test(formData.newPassword);
            const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword);

            if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
                throw new Error('Password must contain at least one uppercase letter, lowercase letter, number, and special character');
            }

            await new Promise(resolve => setTimeout(resolve, 2000));

            setStep('success');

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
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Resending verification code to:', formData.email);
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
        <div className={styles["forgot-password-form"]}>
            <div className={styles["form-header"]}>
                <h2 className={styles["form-title"]}>Reset Your Password</h2>
                <p className={styles["form-subtitle"]}>
                    Enter your email address and we'll send you a verification code.
                </p>
            </div>

            <div className={styles["method-selector"]}>
                <div className={styles["method-options"]}>
                    <button type="button" className={styles["method-btn"]}>
                        <Mail size={20} />
                        Email
                    </button>
                </div>
            </div>

            <div className={styles["reset-form"]}>
                <div className={styles["form-group"]}>
                    <label htmlFor="email" className={styles["form-label"]}>Email Address</label>
                    <input
                        type="email"
                        id="email"
                        className={styles["form-input"]}
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        onKeyPress={(e) => handleKeyPress(e, handleIdentifyUser)}
                        placeholder="Enter your email address"
                        disabled={isLoading}
                    />
                </div>

                {error && (
                    <div className={styles["error-message"]}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="button"
                    className={styles["submit-btn"]}
                    onClick={handleIdentifyUser}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className={styles["spinning"]} />
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
        <div className={styles["forgot-password-form"]}>
            <div className={styles["form-header"]}>
                <h2 className={styles["form-title"]}>Verify Your Identity</h2>
                <p className={styles["form-subtitle"]}>
                    We've sent a 6-digit verification code to <strong>{formData.email}</strong>
                </p>
            </div>

            <div className={styles["reset-form"]}>
                <div className={styles["form-group"]}>
                    <label htmlFor="verificationCode" className={styles["form-label"]}>Verification Code</label>
                    <input
                        type="text"
                        id="verificationCode"
                        className={`${styles["form-input"]} ${styles["verification-input"]}`}
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
                    <div className={styles["error-message"]}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <div className={styles["resend-section"]}>
                    <p className={styles["resend-text"]}>
                        Didn't receive the code?{' '}
                        {resendTimer > 0 ? (
                            <span className={styles["resend-timer"]}>Resend in {resendTimer}s</span>
                        ) : (
                            <button
                                type="button"
                                className={styles["resend-btn"]}
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
                    className={styles["submit-btn"]}
                    onClick={handleVerifyCode}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className={styles["spinning"]} />
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
        <div className={styles["forgot-password-form"]}>
            <div className={styles["form-header"]}>
                <h2 className={styles["form-title"]}>Create New Password</h2>
                <p className={styles["form-subtitle"]}>Please create a strong password for your account.</p>
            </div>

            <div className={styles["reset-form"]}>
                <div className={styles["form-group"]}>
                    <label htmlFor="newPassword" className={styles["form-label"]}>New Password</label>
                    <div className={styles["password-input-wrapper"]}>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="newPassword"
                            className={styles["form-input"]}
                            value={formData.newPassword}
                            onChange={(e) => handleInputChange('newPassword', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                            placeholder="Enter new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles["password-toggle"]}
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className={styles["form-group"]}>
                    <label htmlFor="confirmPassword" className={styles["form-label"]}>Confirm Password</label>
                    <div className={styles["password-input-wrapper"]}>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            id="confirmPassword"
                            className={styles["form-input"]}
                            value={formData.confirmPassword}
                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                            onKeyPress={(e) => handleKeyPress(e, handleResetPassword)}
                            placeholder="Confirm new password"
                            disabled={isLoading}
                        />
                        <button
                            type="button"
                            className={styles["password-toggle"]}
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                <div className={styles["password-requirements"]}>
                    <p className={styles["requirements-title"]}>Password must contain:</p>
                    <ul className={styles["requirements-list"]}>
                        <li>At least 8 characters</li>
                        <li>One uppercase letter</li>
                        <li>One lowercase letter</li>
                        <li>One number</li>
                        <li>One special character</li>
                    </ul>
                </div>

                {error && (
                    <div className={styles["error-message"]}>
                        <AlertCircle size={16} />
                        <span>{error}</span>
                    </div>
                )}

                <button
                    type="button"
                    className={styles["submit-btn"]}
                    onClick={handleResetPassword}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 size={16} className={styles["spinning"]} />
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
        <div className={styles["forgot-password-form"]}>
            <div className={styles["success-content"]}>
                <div className={styles["success-icon"]}>
                    <CheckCircle size={64} />
                </div>
                <h2 className={styles["success-title"]}>Password Reset Successful!</h2>
                <p className={styles["success-message"]}>
                    Your password has been successfully updated. You can now log in with your new password.
                </p>
                <button
                    type="button"
                    className={styles["submit-btn"]}
                    onClick={onBackToLogin}
                >
                    Back to Login
                </button>
            </div>
        </div>
    );

    return (
        <div className={styles["forgot-password-container"]}>
            <div className={styles["forgot-password-card"]}>
                {step !== 'success' && (
                    <button
                        className={styles["back-btn"]}
                        onClick={step === 'identify' ? onBackToLogin : () => setStep(step === 'verify' ? 'identify' : 'verify')}
                        disabled={isLoading}
                    >
                        <ArrowLeft size={16} />
                        Back
                    </button>
                )}

                <div className={styles["step-indicator"]}>
                    <div className={styles["steps"]}>
                        <div className={`${styles["step"]} ${step === 'identify' ? styles["active"] : step !== 'identify' ? styles["completed"] : ''}`}>
                            <div className={styles["step-circle"]}>1</div>
                            <span>Identify</span>
                        </div>
                        <div className={`${styles["step"]} ${step === 'verify' ? styles["active"] : step === 'reset' || step === 'success' ? styles["completed"] : ''}`}>
                            <div className={styles["step-circle"]}>2</div>
                            <span>Verify</span>
                        </div>
                        <div className={`${styles["step"]} ${step === 'reset' ? styles["active"] : step === 'success' ? styles["completed"] : ''}`}>
                            <div className={styles["step-circle"]}>3</div>
                            <span>Reset</span>
                        </div>
                    </div>
                </div>

                <div className={styles["form-container"]}>
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
