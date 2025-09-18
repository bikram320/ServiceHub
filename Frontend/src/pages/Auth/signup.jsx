
import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import "../../styles/Login_signup.css";
import AuthContainer from "../../Components/layout/AuthContainer.jsx";
import FormCard from "../../Components/layout/FormCard.jsx";
import InputField from "../../Components/common/InputField.jsx";
import PasswordField from "../../Components/common/PasswordField.jsx";
import CheckboxField from "../../Components/common/CheckboxField.jsx";

function Signup() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
        agreeToTerms: false,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        const {name, value, type, checked} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Form submitted: ",formData);
    }

    return (
        <AuthContainer>
            <FormCard
            title="Get Started"
            subtitle="Create your account and book your trusted services in seconds."
            >
                {/* First Name */}
                <InputField
                    name="firstName"
                    value={formData.firstName}
                    placeholder="First Name"
                    onChange={handleInputChange}
                    />

                {/*Last Name*/}
                <InputField
                    name="lastName"
                    value={formData.lastName}
                    placeholder="Last Name"
                    onChange={handleInputChange}
                />

                {/*Email*/}
                <InputField
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Email"
                    onChange={handleInputChange}
                />

                {/*Password*/}
                <PasswordField
                    name="password"
                    value={formData.password}
                    placeholder="Password"
                    onChange={handleInputChange}
                    show = {showPassword}
                    toggleShow={() => setShowPassword((prev) => !prev)}
                />

                {/*Confirm Password*/}
                <PasswordField
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    placeholder="Re-Type Password"
                    onChange={handleInputChange}
                    show = {showConfirmPassword}
                    toggleShow={() => setShowConfirmPassword((prev) => !prev)}
                />
                {/*Terms and conditions Checkbox*/}
                <CheckboxField
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleInputChange}
                    label="I agree to all Terms, Privacy Policy and Fees."
                />

                {/*Submit Button */}
                <button type="submit" onClick={handleSubmit} className="submit-button">
                    Sign Up
                </button>

                {/*Login Link */}
                <div className="login-row">
                    <span className="login-text">
                        Already have an account?{" "}
                        <Link to ="/login" className="login-link">
                            Log In
                        </Link>
                    </span>
                </div>
            </FormCard>
        </AuthContainer>
    );
}

export default Signup;