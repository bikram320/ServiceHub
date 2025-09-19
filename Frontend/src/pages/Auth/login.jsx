import { useLocation, useNavigate } from "react-router-dom";
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "../../styles/Login_signup.css"
import AuthContainer from '../../Components/layout/AuthContainer';
import FormCard from '../../Components/layout/FormCard';
import InputField from '../../Components/common/InputField';
import PasswordField from '../../Components/common/PasswordField';
import CheckboxField from '../../Components/common/CheckboxField';
import {loginUser} from "../../Components/utils/authService.jss.js";

function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });

    const navigate = useNavigate();
    const location = useLocation();
    const role = location.state?.role || "user";
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked :  value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.email || !formData.password) {
            alert("Please fill all fields");
            return;
        }

        try {
            await loginUser(formData, role);

            if (role === "user") navigate("/UserLayout");
            else if (role === "technician") navigate("/technician/profile");
            else if (role === "admin") navigate("/admin/dashboard");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <AuthContainer>
            {/*Title and subtitle content*/}
            <FormCard
                title="Welcome Back"
                subtitle="Let's get your task done smoothly today."
            >
                {/*Email stuff*/}
                <InputField
                    type="email"
                    name="email"
                    placeholder="Email/Username"
                    value={formData.email} onChange={handleInputChange} />

                {/*Forgot password option*/}
                <a href="#" className="forgot-link">
                    Forgot Password?
                </a>

                {/*Password stuff*/}
                <PasswordField
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                    show={showPassword}
                    toggleShow={() => setShowPassword(prev => !prev)} />

                {/*remember me stuff*/}
                <CheckboxField
                    name="rememberMe"
                    value={formData.rememberMe}
                    onChange={handleInputChange}
                    label="Remember Me" />

                {/*Submit button8*/}
                <button
                    type="submit"
                    className="submit-button"
                    onClick={handleSubmit}>Log In</button>

                {/*sign up option*/}
                <div className="register-row">
                    <span className="register-text">
                        Don't have an account?{" "}
                        <Link to="/signup" className="register-link">
                            Sign up
                        </Link>
                    </span>
                </div>
            </FormCard>
        </AuthContainer>
    );
}

export default Login;