import React, {useState} from 'react';
import {Eye, EyeOff} from "lucide-react";
import { FcGoogle } from 'react-icons/fc';
import { Link } from 'react-router-dom';
import './Login_signup.css';
import App from "../../App.jsx";

function Login(){
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        rememberMe: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData(prev => ({
            ...prev, [name]: type === 'checkbox' ? checked : value}));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login submitted: ',formData);
    };

    const handleGoogleSignIn =() =>{
        console.log('Google sign in clicked');
    }
    return (
        <div className="main-container">
            <div className="form-card">
                <h1 className="title"> Login </h1>
                <h4 className="subtitle"> Hi, Welcome back! </h4>

                <div className="form-container">
                    {/*email stuff*/}
                    <div className="field-group">
                        <label className="label" htmlFor="email">
                            Email <span className="required"></span> </label>
                        <input type="email" name="email" className="input" value={formData.email} onChange={handleInputChange} required/>
                    </div>


                {/*password stuff*/}
                <div className="field-group">
                    <div className="label-row">
                    <label className="label" htmlFor="password">
                        Password <span className="required"></span> </label>
                        <a href="#" className="forgot-link"> Forgot Password? </a>
                    </div>
                    <div className="password-container">
                        <input type={showPassword ? "text" : "password"} name="password" className="password-input" value={formData.password} onChange={handleInputChange} required/>
                        <button className="eye-button" type="button" onClick={() =>setShowPassword(!showPassword)}>
                            {showPassword ? (<EyeOff className={"eye-icon"}/>)
                                : (<Eye className="eye-icon"/>)}
                        </button>
                    </div>
                </div>

                {/*Remember meeee */}
                <div className="checkbox-row">
                    <input type="checkbox" name="rememberMe" onChange={handleInputChange} checked={formData.rememberMe} className="checkbox"/>

                <label className="checkbox-label" htmlFor="rememberMe"> Remember Me</label>
                </div>

            {/*Login button here */}
            <button type="submit" className="submit-button" onClick={handleSubmit}> Log In </button>

            {/* Divide this sht */}
            <div className="divider">
                <div className="divider-line"></div>
                <span className="divider-text">Or</span>
                <div className="divider-line"></div>
            </div>

            {/* Google option for normies */}
            <button type="submit" className="google-button" onClick={handleGoogleSignIn} >
                <FcGoogle />
                Sign in with Google
            </button>

                {/* Register stufff */}
                <div className="register-row">
                    <span className="register-text">
                        Don't have an account? {' '}
                        <Link to="/signup" className="register-link"> Register</Link>
                    </span>
                </div>
                </div>
            </div>
        </div>
    )
}

export default Login;