import React from 'react';
import '../../styles/PrivacyPolicy.css';
import Header from "../../Components/layout/Header.jsx";

const PrivacyPolicy = () => {
    return (
        <div>
            <Header />
        <div className="container">

            <h1>Privacy Policy</h1>

            <div className="highlight-box">
                <strong>Your Privacy Matters:</strong> This Privacy Policy explains how QuestX collects, uses, and protects your personal information when you use our platform.
            </div>

            <div className="last-updated-top">
                <p><strong>Effective Date:</strong> [Insert Date] | <strong>Last Updated:</strong> [Insert Date]</p>
            </div>

            <h2><span className="section-number">1.</span> Information We Collect</h2>

            <h3>1.1 Personal Information You Provide</h3>
            <div className="info-category">
                <h4>For All Users:</h4>
                <ul>
                    <li>Name, email address, and phone number</li>
                    <li>Profile picture (optional)</li>
                    <li>Account credentials and security information</li>
                    <li>Payment information and billing address</li>
                    <li>Communication preferences</li>
                </ul>
            </div>

            <div className="info-category">
                <h4>For Service Users:</h4>
                <ul>
                    <li>Service location addresses</li>
                    <li>Service history and preferences</li>
                    <li>Reviews and ratings submitted</li>
                    <li>Support tickets and communications</li>
                </ul>
            </div>

            <div className="info-category">
                <h4>For Technicians:</h4>
                <ul>
                    <li>Professional licenses and certifications</li>
                    <li>Business information and tax details</li>
                    <li>Insurance documentation</li>
                    <li>Background check information</li>
                    <li>Service areas and availability</li>
                    <li>Banking information for payments</li>
                    <li>Work history and references</li>
                </ul>
            </div>

            <h3>1.2 Information We Collect Automatically</h3>
            <ul>
                <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform, search queries</li>
                <li><strong>Location Data:</strong> Approximate location based on IP address, precise location when permitted</li>
                <li><strong>Cookies and Tracking:</strong> Session data, preferences, analytics information</li>
            </ul>

            <h3>1.3 Information from Third Parties</h3>
            <ul>
                <li>Background check results from authorized providers</li>
                <li>License verification from regulatory bodies</li>
                <li>Payment processing information</li>
                <li>Social media profile information (when you connect accounts)</li>
                <li>Marketing and analytics data from partners</li>
            </ul>

            <h2><span className="section-number">2.</span> How We Use Your Information</h2>

            <h3>2.1 Platform Services</h3>
            <ul>
                <li>Create and manage user accounts</li>
                <li>Facilitate service bookings and communications</li>
                <li>Process payments and maintain transaction records</li>
                <li>Verify technician credentials and maintain safety standards</li>
                <li>Enable search, filtering, and matching functionality</li>
                <li>Display reviews, ratings, and service history</li>
            </ul>

            <h3>2.2 Safety and Security</h3>
            <ul>
                <li>Conduct background checks and identity verification</li>
                <li>Monitor platform activity for fraud and abuse</li>
                <li>Investigate disputes and safety concerns</li>
                <li>Maintain platform security and prevent unauthorized access</li>
                <li>Comply with legal and regulatory requirements</li>
            </ul>

            <h3>2.3 Communication and Support</h3>
            <ul>
                <li>Send booking confirmations and service updates</li>
                <li>Provide customer support and resolve issues</li>
                <li>Send administrative notices and policy updates</li>
                <li>Enable messaging between users and technicians</li>
                <li>Deliver marketing communications (with consent)</li>
            </ul>

            <h3>2.4 Platform Improvement</h3>
            <ul>
                <li>Analyze usage patterns and platform performance</li>
                <li>Develop new features and services</li>
                <li>Conduct research and analytics</li>
                <li>Personalize user experience and recommendations</li>
            </ul>

            <h2><span className="section-number">3.</span> Information Sharing and Disclosure</h2>

            <div className="warning-box">
                <p><strong>We do not sell your personal information to third parties.</strong></p>
            </div>

            <h3>3.1 With Other Users</h3>
            <ul>
                <li><strong>Technician Profiles:</strong> Name, photo, ratings, reviews, service areas, certifications</li>
                <li><strong>User Reviews:</strong> Name, rating, review content (as submitted by users)</li>
                <li><strong>Booking Information:</strong> Contact details shared for scheduled services</li>
            </ul>

            <h3>3.2 With Service Providers</h3>
            <ul>
                <li><strong>Payment Processors:</strong> Transaction data for payment processing</li>
                <li><strong>Background Check Companies:</strong> Information necessary for verification</li>
                <li><strong>Communication Services:</strong> Data for sending notifications and messages</li>
                <li><strong>Analytics Providers:</strong> Aggregated usage data for platform improvement</li>
                <li><strong>Cloud Storage:</strong> Data hosting and backup services</li>
            </ul>

            <h3>3.3 Legal and Safety Requirements</h3>
            <ul>
                <li>Compliance with legal obligations and court orders</li>
                <li>Protection of rights, property, and safety</li>
                <li>Investigation of fraud or security incidents</li>
                <li>Cooperation with law enforcement agencies</li>
                <li>Defense of legal claims</li>
            </ul>

            <h3>3.4 Business Transfers</h3>
            <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the business transaction. You will be notified of any such change in ownership.</p>

            <h2><span className="section-number">4.</span> Data Security</h2>

            <h3>4.1 Security Measures</h3>
            <ul>
                <li><strong>Encryption:</strong> Data encrypted in transit and at rest using industry-standard protocols</li>
                <li><strong>Access Controls:</strong> Role-based access with multi-factor authentication</li>
                <li><strong>Regular Audits:</strong> Security assessments and vulnerability testing</li>
                <li><strong>Employee Training:</strong> Privacy and security awareness programs</li>
                <li><strong>Incident Response:</strong> Procedures for handling security breaches</li>
            </ul>

            <h3>4.2 Data Retention</h3>
            <ul>
                <li><strong>Active Accounts:</strong> Data retained while account is active</li>
                <li><strong>Inactive Accounts:</strong> Data retained for 3 years after last activity</li>
                <li><strong>Transaction Records:</strong> Financial data retained for 7 years for compliance</li>
                <li><strong>Safety Records:</strong> Background checks and safety-related data retained indefinitely</li>
                <li><strong>Marketing Data:</strong> Removed immediately upon unsubscribe request</li>
            </ul>

            <h2><span className="section-number">5.</span> Your Privacy Rights</h2>

            <h3>5.1 Access and Portability</h3>
            <ul>
                <li>Request access to your personal information</li>
                <li>Download a copy of your data in portable format</li>
                <li>View your account information and settings</li>
            </ul>

            <h3>5.2 Correction and Updates</h3>
            <ul>
                <li>Update your profile and account information</li>
                <li>Correct inaccurate or incomplete data</li>
                <li>Modify communication preferences</li>
            </ul>

            <h3>5.3 Deletion and Restriction</h3>
            <ul>
                <li>Delete your account and associated data</li>
                <li>Request removal of specific information</li>
                <li>Restrict processing of your data</li>
                <li>Opt-out of marketing communications</li>
            </ul>

            <div className="important-note">
                <h4>Important Limitations:</h4>
                <p>Some data cannot be deleted if required for:</p>
                <ul>
                    <li>Legal compliance and regulatory requirements</li>
                    <li>Safety and security of the platform</li>
                    <li>Fraud prevention and dispute resolution</li>
                    <li>Completed financial transactions</li>
                </ul>
            </div>

            <h2><span className="section-number">6.</span> Cookies and Tracking Technologies</h2>

            <h3>6.1 Types of Cookies We Use</h3>
            <div className="cookie-category">
                <h4>Essential Cookies:</h4>
                <p>Required for platform functionality, account authentication, and security.</p>
            </div>

            <div className="cookie-category">
                <h4>Performance Cookies:</h4>
                <p>Collect anonymous usage data to improve platform performance and user experience.</p>
            </div>

            <div className="cookie-category">
                <h4>Functional Cookies:</h4>
                <p>Remember your preferences and settings for personalized experience.</p>
            </div>

            <div className="cookie-category">
                <h4>Marketing Cookies:</h4>
                <p>Track user behavior for targeted advertising and marketing campaigns (with consent).</p>
            </div>

            <h3>6.2 Managing Cookies</h3>
            <ul>
                <li>Browser settings to control cookie preferences</li>
                <li>Platform cookie management tools</li>
                <li>Third-party opt-out mechanisms</li>
                <li>Do Not Track signal recognition</li>
            </ul>

            <h2><span className="section-number">7.</span> Location Information</h2>

            <h3>7.1 How We Use Location Data</h3>
            <ul>
                <li>Match users with nearby technicians</li>
                <li>Calculate service areas and travel distances</li>
                <li>Provide location-based search and filtering</li>
                <li>Improve service recommendations</li>
                <li>Prevent fraud and ensure service authenticity</li>
            </ul>

            <h3>7.2 Location Data Controls</h3>
            <ul>
                <li>Precise location requires explicit consent</li>
                <li>Can be disabled in device or browser settings</li>
                <li>Approximate location may still be used for basic functionality</li>
                <li>Location history can be deleted from your account</li>
            </ul>

            <h2><span className="section-number">8.</span> International Data Transfers</h2>
            <p>Your information may be processed and stored in countries other than your residence. We ensure adequate protection through:</p>
            <ul>
                <li>Standard Contractual Clauses with international partners</li>
                <li>Adequacy decisions by regulatory authorities</li>
                <li>Binding Corporate Rules for internal transfers</li>
                <li>User consent for specific transfer purposes</li>
            </ul>

            <h2><span className="section-number">9.</span> Children's Privacy</h2>
            <div className="warning-box">
                <p><strong>Age Restriction:</strong> QuestX is not intended for users under 18 years of age. We do not knowingly collect personal information from minors.</p>
            </div>
            <p>If we discover that we have collected information from a minor, we will delete it immediately. Parents or guardians who believe their child has provided information should contact us at privacy@questx.com.</p>

            <h2><span className="section-number">10.</span> State-Specific Privacy Rights</h2>

            <h3>10.1 California Residents (CCPA/CPRA)</h3>
            <ul>
                <li>Right to know what personal information is collected</li>
                <li>Right to delete personal information</li>
                <li>Right to opt-out of sale of personal information</li>
                <li>Right to non-discrimination for exercising privacy rights</li>
                <li>Right to correct inaccurate personal information</li>
                <li>Right to limit use of sensitive personal information</li>
            </ul>

            <h3>10.2 European Residents (GDPR)</h3>
            <ul>
                <li>Lawful basis for processing personal data</li>
                <li>Right to access, rectify, and erase data</li>
                <li>Right to data portability and restriction of processing</li>
                <li>Right to object to processing</li>
                <li>Right to withdraw consent</li>
                <li>Right to lodge complaints with supervisory authorities</li>
            </ul>

            <h2><span className="section-number">11.</span> Marketing Communications</h2>

            <h3>11.1 Types of Communications</h3>
            <ul>
                <li>Service updates and platform news</li>
                <li>Promotional offers and special discounts</li>
                <li>New feature announcements</li>
                <li>Industry insights and tips</li>
                <li>Customer satisfaction surveys</li>
            </ul>

            <h3>11.2 Opt-Out Options</h3>
            <ul>
                <li>Unsubscribe links in all marketing emails</li>
                <li>Account settings for communication preferences</li>
                <li>Direct contact with customer support</li>
                <li>Granular controls for different types of messages</li>
            </ul>

            <h2><span className="section-number">12.</span> Third-Party Links and Services</h2>
            <p>Our platform may contain links to third-party websites and services. This Privacy Policy does not apply to:</p>
            <ul>
                <li>External websites linked from our platform</li>
                <li>Third-party payment processors</li>
                <li>Social media platforms</li>
                <li>Partner services and integrations</li>
            </ul>
            <p>We encourage you to review the privacy policies of any third-party services you use.</p>

            <h2><span className="section-number">13.</span> Data Breach Notification</h2>
            <p>In the event of a data breach that may compromise your personal information:</p>
            <ul>
                <li>We will investigate and contain the breach immediately</li>
                <li>Affected users will be notified within 72 hours when feasible</li>
                <li>Regulatory authorities will be notified as required by law</li>
                <li>We will provide guidance on protective measures you can take</li>
                <li>Regular updates will be provided until the issue is resolved</li>
            </ul>

            <h2><span className="section-number">14.</span> Changes to This Privacy Policy</h2>
            <p>We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. When we make changes:</p>
            <ul>
                <li>Updated policy will be posted on our platform</li>
                <li>Users will be notified via email for material changes</li>
                <li>Effective date will be clearly indicated</li>
                <li>Continued use constitutes acceptance of changes</li>
                <li>Previous versions will be archived for reference</li>
            </ul>

            <h2><span className="section-number">15.</span> How to Exercise Your Rights</h2>
            <div className="contact-methods">
                <h3>Submit Privacy Requests:</h3>
                <div className="contact-option">
                    <h4>Email:</h4>
                    <p>privacy@questx.com</p>
                </div>
                <div className="contact-option">
                    <h4>Online Form:</h4>
                    <p>Available in your account settings under "Privacy Controls"</p>
                </div>
                <div className="contact-option">
                    <h4>Phone:</h4>
                    <p>98355555512</p>
                </div>
                <div className="contact-option">
                    <h4>Mail:</h4>
                    <p>QuestX Privacy Officer<br />
                        Gaidakot, Nawalpur<br />
                        </p>
                </div>
            </div>

            <div className="verification-note">
                <h4>Identity Verification:</h4>
                <p>To protect your privacy, we may require verification of your identity before processing requests. This may include providing account information or government-issued identification.</p>
            </div>

            <h2><span className="section-number">16.</span> Contact Information</h2>
            <div className="contact-info">
                <h3>Privacy Questions or Concerns?</h3>
                <p><strong>Data Protection Officer:</strong> privacy@questx.com</p>
                <p><strong>General Support:</strong> support@questx.com</p>
                <p><strong>Phone:</strong> 98355555512</p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM </p>

                <div className="response-time">
                    <p><strong>Response Time:</strong> We aim to respond to all privacy inquiries within 30 days, or sooner as required by applicable law.</p>
                </div>
            </div>

            <div className="highlight-box">
                <p><strong>Commitment:</strong> QuestX is committed to protecting your privacy and ensuring transparent data practices. This policy reflects our dedication to earning and maintaining your trust.</p>
            </div>

            <div className="last-updated">
                <p>Last Updated: Sep 18, 2025<br />
                    Version 1.0</p>
            </div>
        </div>
        </div>
    );
};

export default PrivacyPolicy;