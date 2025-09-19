import React from 'react';
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../../styles/Footer.css";

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="footer">
            {/* Main Footer Content */}
            <div className="footer-main">
                <div className="footer-container">

                    {/* Company Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Company</h3>
                        <ul className="footer-nav">
                            <li>
                                <button
                                    onClick={() => navigate("/about-us")}
                                    className="footer-link"
                                >
                                    About Us
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/help-support")}
                                    className="footer-link"
                                >
                                    Help & Support
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="footer-section">
                        <h3 className="footer-title">Legal</h3>
                        <ul className="footer-nav">
                            <li>
                                <button
                                    onClick={() => navigate("/privacy-policy")}
                                    className="footer-link"
                                >
                                    Privacy Policy
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => navigate("/terms-of-service")}
                                    className="footer-link"
                                >
                                    Terms of Service
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div className="footer-section">
                        <h3 className="footer-title">Follow Us</h3>
                        <div className="social-links">
                            <a
                                href="https://facebook.com"
                                className="social-link"
                                aria-label="Facebook"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Facebook size={20} />
                            </a>
                            <a
                                href="https://instagram.com"
                                className="social-link"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Instagram size={20} />
                            </a>
                            <a
                                href="https://twitter.com"
                                className="social-link"
                                aria-label="Twitter"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-content">
                    <div className="footer-brand">
                        <div className="logo">
                            <span className="logo-icon">Q</span>
                        </div>
                        <span className="brand-text">QuestX</span>
                    </div>
                    <div className="copyright">
                        © 2025 QuestX. All Rights Reserved.
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;