import React from 'react';
import { UserProfile } from '@clerk/clerk-react';
import { clerkAppearance } from '../config/clerkTheme';
import './ClerkProfileSection.css';

const ClerkProfileSection = () => {
    return (
        <div className="clerk-profile-section">
            <div className="clerk-profile-header">
                <h2 className="section-title">Account Settings</h2>
                <p className="section-subtitle">Manage your account details, security, and preferences</p>
            </div>
            <div className="clerk-profile-container">
                <UserProfile
                    appearance={clerkAppearance}
                    routing="path"
                    path="/profile/account"
                />
            </div>
        </div>
    );
};

export default ClerkProfileSection;
