// AdminLogin.jsx
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Shield, AlertCircle } from 'lucide-react';
import styles from '../../styles/AdminLogin.module.css';
import {useNavigate} from "react-router-dom";

const AdminLogin = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate()

    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginData.email || !loginData.password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            // Spring Boot API endpoint for admin login
            const response =await fetch(`api/auth/login/admin`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include', // Include cookies for JWT token
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Admin login successful:', data);

                // Store JWT token if it's returned in response body
                if (data.token) {
                    localStorage.setItem('adminToken', data.token);
                    localStorage.setItem('userRole', 'admin');
                    localStorage.setItem('userEmail', loginData.email);
                }

                // Navigate to admin dashboard
                navigate('/AdminLayout');
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Invalid credentials. Access denied.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Network error occurred. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.background}></div>

            <div className={styles.card}>
                {/* Header Section */}
                <div className={styles.header}>
                    <div className={styles.headerBg}></div>
                    <div className={styles.headerLine}></div>

                    <div className={styles.headerContent}>
                        <div className={styles.icon}>
                            <Shield size={28} />
                        </div>
                        <h1 className={styles.title}>Admin Login</h1>
                        <p className={styles.subtitle}>Restricted access for administrators only</p>
                    </div>
                </div>

                {/* Form Section */}
                <div className={styles.formSection}>
                    {error && (
                        <div className={styles.errorAlert}>
                            <AlertCircle size={20} className={styles.errorIcon} />
                            <span className={styles.errorText}>{error}</span>
                        </div>
                    )}

                    <div className={styles.formContainer}>
                        {/* Email Input */}
                        <div className={styles.inputGroup}>

                            <div className={styles.inputWrapper}>
                                <Mail className={styles.inputIcon} size={20} />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={loginData.email}
                                    onChange={handleChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    className={styles.input}
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className={styles.inputGroup}>

                            <div className={styles.inputWrapper}>
                                <Lock className={styles.inputIcon} size={20} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={loginData.password}
                                    onChange={handleChange}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                                    className={`${styles.input} ${styles.passwordInput}`}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className={styles.passwordToggle}
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>


                        {/* Submit Button */}
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading}
                            className={styles.submitBtn}
                        >
                            {isLoading ? (
                                <div className={styles.loadingContent}>
                                    <div className={styles.spinner}></div>
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                'LOG IN'
                            )}
                        </button>
                    </div>


                </div>
            </div>

        </div>
    );
};

export default AdminLogin;