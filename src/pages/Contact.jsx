import React from 'react';
import './Contact.css';

const Contact = () => {
    return (
        <div className="contact-page container">
            <h1 className="page-title glow-text">Contact Us</h1>
            <div className="contact-content">
                <div className="contact-info glow-box">
                    <h2>Get in Touch</h2>
                    <p>Have questions? We'd love to hear from you.</p>
                    <div className="info-item">
                        <span>Email:</span>
                        <p>support@luminouslux.com</p>
                    </div>
                    <div className="info-item">
                        <span>Phone:</span>
                        <p>+1 (555) 123-4567</p>
                    </div>
                    <div className="info-item">
                        <span>Address:</span>
                        <p>123 Fashion St, New York, NY</p>
                    </div>
                </div>
                <form className="contact-form glow-box">
                    <h2>Send a Message</h2>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" placeholder="Your Name" />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Your Email" />
                    </div>
                    <div className="form-group">
                        <label>Message</label>
                        <textarea placeholder="Your Message" rows="5"></textarea>
                    </div>
                    <button type="submit" className="btn">Send Message</button>
                </form>
            </div>
        </div>
    );
};

export default Contact;
