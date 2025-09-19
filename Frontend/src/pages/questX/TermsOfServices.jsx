import React from 'react';
import '../../styles/TermsOfServices.css';
import Header from "../../Components/layout/Header.jsx";

const TermsOfServices = () => {
    return (
        <div>
            <Header />
        <div className="container">

            <h1>Terms of Service</h1>

            <div className="highlight-box">
                <strong>Important:</strong> Please read these Terms of Service carefully before using QuestX. By accessing or using our platform, you agree to be bound by these terms.
            </div>

            <h2><span className="section-number">1.</span> Definitions</h2>
            <div className="definition">
                <p><strong>"Platform"</strong> refers to the QuestX web application, mobile applications, and all related services.</p>
                <p><strong>"Users"</strong> refers to individuals who book technician services through our platform.</p>
                <p><strong>"Technicians"</strong> refers to verified service providers who offer their services through our platform.</p>
                <p><strong>"Admin"</strong> refers to QuestX administrative staff responsible for platform management and verification processes.</p>
            </div>

            <h2><span className="section-number">2.</span> Platform Overview</h2>
            <p>QuestX is a digital marketplace that connects users with verified technicians for various services. Our platform allows users to search, filter, and book technicians based on pricing, reviews, location, and service categories. All technicians undergo a verification process managed by our administrative team.</p>

            <h2><span className="section-number">3.</span> User Account Registration and Responsibilities</h2>
            <h3>3.1 Account Creation</h3>
            <ul>
                <li>Users must provide accurate, complete, and current information during registration</li>
                <li>Users are responsible for maintaining the confidentiality of their account credentials</li>
                <li>Users must be at least 18 years old to create an account</li>
                <li>One person may maintain only one active account</li>
            </ul>

            <h3>3.2 User Obligations</h3>
            <ul>
                <li>Provide truthful information when booking services</li>
                <li>Treat technicians with respect and professionalism</li>
                <li>Pay for services as agreed upon through the platform</li>
                <li>Submit honest reviews and ratings</li>
                <li>Comply with all applicable laws and regulations</li>
            </ul>

            <h2><span className="section-number">4.</span> Technician Registration and Verification</h2>
            <h3>4.1 Registration Requirements</h3>
            <p>To register as a technician on QuestX, applicants must:</p>
            <ul>
                <li>Provide complete personal and professional information</li>
                <li>Submit valid working licenses or professional certifications</li>
                <li>Provide proof of insurance (where applicable)</li>
                <li>Pass background verification checks</li>
                <li>Agree to platform service standards and policies</li>
            </ul>

            <h3>4.2 Verification Process</h3>
            <ul>
                <li>All technician applications are reviewed by QuestX administrative staff</li>
                <li>Verification typically takes 3-7 business days</li>
                <li>QuestX reserves the right to reject applications that don't meet our standards</li>
                <li>Technicians must maintain current licenses and certifications</li>
                <li>Periodic re-verification may be required</li>
            </ul>

            <h3>4.3 Technician Obligations</h3>
            <ul>
                <li>Provide services professionally and competently</li>
                <li>Maintain valid licenses and certifications</li>
                <li>Honor scheduled appointments or provide adequate notice of cancellation</li>
                <li>Follow safety protocols and industry standards</li>
                <li>Respond to customer inquiries in a timely manner</li>
                <li>Update profile information and availability regularly</li>
            </ul>

            <h2><span className="section-number">5.</span> Service Booking and Payment</h2>
            <h3>5.1 Booking Process</h3>
            <ul>
                <li>Users can search and filter technicians by various criteria</li>
                <li>Booking confirmations are subject to technician availability</li>
                <li>Users will receive booking confirmations via email and platform notifications</li>
            </ul>

            <h3>5.2 Pricing and Payment</h3>
            <ul>
                <li>Technicians set their own service rates</li>
                <li>All payments are processed through the platform</li>
                <li>QuestX charges a service fee on each completed transaction</li>
                <li>Payment is typically processed upon service completion</li>
                <li>Refund policies apply as outlined in Section 8</li>
            </ul>

            <h2><span className="section-number">6.</span> Reviews and Rating System</h2>
            <ul>
                <li>Users can rate and review technicians after service completion</li>
                <li>Reviews must be honest, relevant, and based on actual service experience</li>
                <li>QuestX reserves the right to remove inappropriate or fraudulent reviews</li>
                <li>Technicians may respond to reviews publicly</li>
                <li>Review manipulation or fake reviews are strictly prohibited</li>
            </ul>

            <h2><span className="section-number">7.</span> Platform Administration</h2>
            <h3>7.1 Administrative Rights</h3>
            <p>QuestX administrators have the right to:</p>
            <ul>
                <li>Verify and approve technician applications</li>
                <li>Monitor platform activity for compliance</li>
                <li>Investigate disputes between users and technicians</li>
                <li>Suspend or terminate accounts for policy violations</li>
                <li>Modify platform features and policies</li>
            </ul>

            <h3>7.2 Quality Control</h3>
            <ul>
                <li>Regular monitoring of service quality and user satisfaction</li>
                <li>Implementation of safety and quality standards</li>
                <li>Handling of complaints and dispute resolution</li>
            </ul>

            <h2><span className="section-number">8.</span> Cancellations and Refunds</h2>
            <h3>8.1 User Cancellations</h3>
            <ul>
                <li>Users may cancel bookings up to 24 hours before scheduled service</li>
                <li>Cancellations within 24 hours may incur fees</li>
                <li>Emergency cancellations will be reviewed case-by-case</li>
            </ul>

            <h3>8.2 Technician Cancellations</h3>
            <ul>
                <li>Technicians must provide at least 4 hours notice for cancellations</li>
                <li>Repeated cancellations may result in account penalties</li>
                <li>Users will receive full refunds for technician-initiated cancellations</li>
            </ul>

            <h3>8.3 Refund Policy</h3>
            <ul>
                <li>Refunds are processed within 5-10 business days</li>
                <li>Partial refunds may apply for incomplete services</li>
                <li>Disputed charges will be investigated and resolved fairly</li>
            </ul>

            <h2><span className="section-number">9.</span> Prohibited Activities</h2>
            <div className="warning-box">
                <p><strong>The following activities are strictly prohibited on QuestX:</strong></p>
            </div>
            <ul>
                <li>Circumventing the platform for direct payment arrangements</li>
                <li>Creating fake accounts or profiles</li>
                <li>Submitting false reviews or ratings</li>
                <li>Harassment or discriminatory behavior</li>
                <li>Unauthorized use of platform data or content</li>
                <li>Violation of local, state, or federal laws</li>
                <li>Spam or unauthorized promotional activities</li>
            </ul>

            <h2><span className="section-number">10.</span> Liability and Disclaimers</h2>
            <h3>10.1 Platform Liability</h3>
            <ul>
                <li>QuestX acts as an intermediary platform and is not directly responsible for service quality</li>
                <li>We verify technician credentials but do not guarantee service outcomes</li>
                <li>Users and technicians are responsible for their interactions and agreements</li>
            </ul>

            <h3>10.2 Insurance and Damages</h3>
            <ul>
                <li>Technicians are encouraged to maintain appropriate insurance coverage</li>
                <li>Users should verify insurance coverage before high-value services</li>
                <li>QuestX's liability is limited to the service fee charged for the transaction</li>
            </ul>

            <h2><span className="section-number">11.</span> Privacy and Data Protection</h2>
            <ul>
                <li>User data is collected and used according to our Privacy Policy</li>
                <li>Personal information is shared with technicians only as necessary for service delivery</li>
                <li>We implement security measures to protect user data</li>
                <li>Users may request data deletion in accordance with applicable laws</li>
            </ul>

            <h2><span className="section-number">12.</span> Account Termination</h2>
            <h3>12.1 Voluntary Termination</h3>
            <ul>
                <li>Users and technicians may close their accounts at any time</li>
                <li>Outstanding transactions must be completed or resolved before closure</li>
            </ul>

            <h3>12.2 Involuntary Termination</h3>
            <p>QuestX may terminate accounts for:</p>
            <ul>
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent activity or false information</li>
                <li>Repeated policy violations</li>
                <li>Abuse of platform or other users</li>
            </ul>

            <h2><span className="section-number">13.</span> Dispute Resolution</h2>
            <ul>
                <li>Platform-mediated resolution for service disputes</li>
                <li>Evidence-based investigation process</li>
                <li>Binding arbitration for unresolved disputes</li>
                <li>Local jurisdiction applies for legal matters</li>
            </ul>

            <h2><span className="section-number">14.</span> Changes to Terms</h2>
            <p>QuestX reserves the right to modify these Terms of Service at any time. Users will be notified of significant changes via email and platform notifications. Continued use of the platform after changes constitutes acceptance of the updated terms.</p>

            <h2><span className="section-number">15.</span> Contact Information</h2>
            <div className="contact-info">
                <h3>Questions or Concerns?</h3>
                <p><strong>Email:</strong> support@questx.com</p>
                <p><strong>Phone:</strong> 98355555512</p>
                <p><strong>Address:</strong> QuestX Legal Department<br />
                    Gaidakot, Nawalpur<br />
                    </p>
                <p><strong>Business Hours:</strong> Monday - Friday, 9 AM - 6 PM </p>
            </div>

            <h2><span className="section-number">16.</span> Governing Law</h2>
            <p>These Terms of Service are governed by the laws of Labour Courts without regard to conflict of law principles. Any legal action or proceeding arising under these terms will be brought exclusively in the courts of [Your Jurisdiction].</p>

            <div className="highlight-box">
                <p><strong>Agreement:</strong> By using QuestX, you acknowledge that you have read, understood and agree to be bound by these Terms of Service.</p>
            </div>

            <div className="last-updated">
                <p>Last Updated: Sep 18, 2025<br />
                    Version 1.0</p>
            </div>
        </div>
        </div>
    );
};

export default TermsOfServices;