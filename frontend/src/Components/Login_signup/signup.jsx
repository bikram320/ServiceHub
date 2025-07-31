import React from 'react';
import { useState } from 'react';
import { Eye, EyeOff} from 'lucide-react';
import { Link } from 'react-router-dom';
import './Login_signup.css';
import App from "../../App.jsx";

function Signup() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target; //target is a ref to <input>
        setFormData(prev => ({
            ...prev,        // stores the rest of the values as it is and only updates the needed one
            [name]: type === 'checkbox' ? checked : value, })); //using checked coz of agreeToTerms value
    };

    const handleSubmit = (e) => {
        e.preventDefault();  //prevents page from reloading and losing current state on form submit
        console.log('Form submitted: ',formData);
    };

    return (
        <div className="main-container">
            <div className="form-card">
                <h1 className="title">Get Started</h1>

                <div className="form-container">
                    {/*email stuff*/}
                    <div className="field-group">
                        <label className="label" htmlFor="email">
                            Email <span className="required"></span> </label>
                        <input type="email" name="email" className="input" value={formData.email} onChange={handleInputChange} required/>
                    </div>

                    {/*username stuff*/}
                    <div className="field-group">
                        <label className="label" htmlFor="username">
                            Username <span className="required"></span> </label>
                        <input type="text" name="username" className="input" value={formData.username} onChange={handleInputChange} required/>
                    </div>

                    {/*password stuff*/}
                    <div className="field-group">
                        <label className="label" htmlFor="password">
                            Password <span className="required"></span> </label>
                        <div className="password-container">
                            <input type={showPassword ? "text" : "password"} name="password" className="password-input" value={formData.password} onChange={handleInputChange} required/>
                            <button className="eye-button" type="button" onClick={() =>setShowPassword(!showPassword)}>
                                {showPassword ? (<EyeOff className={"eye-icon"}/>)
                                    : (<Eye className="eye-icon"/>)}
                            </button>
                        </div>
                    </div>

                    {/*Confirm password stuff*/}
                    <div className="field-group">
                        <label className="label" htmlFor="confirmPassword">
                            Re-type Password <span className="required"></span> </label>
                        <div className="password-container">
                            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" className="password-input" value={formData.confirmPassword} onChange={handleInputChange} required/>
                            <button className="eye-button" type="button" onClick={() =>setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? (<EyeOff className={"eye-icon"}/>)
                                    : (<Eye className="eye-icon"/>)}
                            </button>
                        </div>
                    </div>

                    {/*Terms stuff*/}
                    <div className="checkbox-row">
                        <input type="checkbox" name="agreeToTerms" className="checkbox" checked={formData.agreeToTerms} onChange={handleInputChange} required/>
                        <label className="checkbox-label" htmlFor="agreeToTerms">
                            I agree to all Terms, Privacy Policy and Fees.
                        </label>
                    </div>

                    {/*sign up button */}
                    <button type="submit" onClick={handleSubmit} className="submit-button" >Sign Up</button>

                    {/*Login Link */}
                    <div className="login-row">
                        <span className="login-text">
                            Already have an account?{' '}
                            <Link to="/login" className="login-link"> Login </Link>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
// const Login_signup = () => {
//     return (
//         <div className='container'>
//             <div className='header'>
//                 <div className='text'>
//                     Sign Up
//                 </div>
//                 <div className='underline'></div>
//             </div>
//             <div className='inputs'>
//                 <div className='input'>
//                     <label htmlFor='username'>Username: </label><br/>
//                     <input type= 'text' name='username' placeholder='Enter Username' />
//                 </div>
//                 <div className='input'>
//                     <label htmlFor='email'>Email: </label><br/>
//                     <input type= 'text' name='email' placeholder='Enter Email' />
//                 </div>
//                 <div className='input'>
//                     <label htmlFor='password'>Password: </label><br/>
//                     <input type= 'text' name='password' placeholder='Enter Password' />
//                 </div>
//             </div>
//             <div className='forget-password'>Forgot Password? <span>Click Here!</span></div>
//             <div className='submit-container'>
//                 <div className='submut'>Sign up</div>
//                 <div className='submut'>Login </div>
//             </div>
//         </div>
//     );
// }

export default Signup;