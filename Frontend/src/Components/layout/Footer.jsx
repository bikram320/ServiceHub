import React from 'react';
import {Facebook, Instagram, Twitter} from "lucide-react";
import "../../styles/Footer.css";
import {useNavigate} from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate();
    return (
        <footer className="footer">
            {/*Main content*/}
            <div className="footer-content">
                <div className="footer-container">

                    {/*Company section*/}
                    <div className="footer-section">
                        <h3 className="footer-heading">
                            Company
                        </h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link" onClick={() => navigate("/AboutUs")}>About Us</a></li>
                            <li><a href="#" className="footer-link" onClick={() => navigate("/HelpSupport")}>Help & Support</a></li>
                            <li><a href="#" className="footer-link">Careers</a></li>
                            <li><a href="#" className="footer-link" onClick={() => navigate("/TermsOfServices")}>Terms of Services</a></li>
                            <li><a href="#" className="footer-link" onClick={() => navigate("/PrivacyPolicy")}>Privacy Policy</a></li>
                            <li><a href="#" className="footer-link">Partnerships</a></li>
                        </ul>
                    </div>


                    {/*Solutions Section */}
                    <div className="footer-section">
                        <h3 className="footer-heading">Solutions</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">serviceHub Pro</a></li>
                            <li><a href="#" className="footer-link">Contact Sales</a></li>
                        </ul>
                    </div>

                    {/* For Seller Section */}
                    <div className="footer-section">
                        <h3 className="footer-heading">For seller</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">Become a provider</a></li>
                            <li><a href="#" className="footer-link">Become an Agency</a></li>
                            <li><a href="#" className="footer-link">Community Hub</a></li>
                        </ul>
                    </div>

                    {/* Header Name Section */}
                    <div className="footer-section">
                        <h3 className="footer-heading-large">Header Name</h3>
                        <ul className="footer-links">
                            <li><a href="#" className="footer-link">link 1</a></li>
                            <li><a href="#" className="footer-link">link 2</a></li>
                            <li><a href="#" className="footer-link">link 3</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    {/* Logo and Copyright */}
                    <div className="footer-brand">
                        <div className="footer-logo">
                            <div className="logo-icon">
                                <span className="logo-text2">Q</span>
                            </div>
                            <span className="brand-name">QuestX</span>
                            <span className="copyright">2025 | All Rights Reserved.</span>
                        </div>
                    </div>

                    {/* Social Media */}
                    <div className="footer-social">
                        <span className="follow-text">Follow Us:</span>
                        <div className="social-links">
                            <a href="#" className="social-link" aria-label="Facebook">
                                <Facebook size={24} />
                            </a>
                            <a href="#" className="social-link" aria-label="Instagram">
                                <Instagram size={24} />
                            </a>
                            <a href="#" className="social-link" aria-label="Twitter">
                                <Twitter size={24} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer;