// Clerk Appearance Configuration
// Import this in components that use Clerk UI components

export const clerkAppearance = {
    baseTheme: undefined,
    variables: {
        colorPrimary: '#800020', // Burgundy/Maroon
        colorText: '#2c2c2c',
        colorTextSecondary: '#666',
        colorBackground: '#FFFFFF',
        colorInputBackground: '#FFFFFF',
        colorInputText: '#2c2c2c',
        colorDanger: '#e74c3c',
        colorSuccess: '#2ecc71',
        colorWarning: '#f39c12',
        fontFamily: '"Cormorant Garamond", serif',
        fontFamilyButtons: '"Cormorant Garamond", serif',
        fontSize: '1rem',
        borderRadius: '12px',
        spacingUnit: '1rem',
    },
    elements: {
        // Main Container
        rootBox: {
            width: '100%',
        },
        card: {
            background: '#FFFFFF',
            boxShadow: '0 0 20px rgba(128, 0, 32, 0.1)',
            border: '1px solid rgba(128, 0, 32, 0.1)',
            backdropFilter: 'blur(10px)',
        },

        // Headers
        headerTitle: {
            color: '#800020',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '2rem',
            fontWeight: '700',
            letterSpacing: '1px',
        },
        headerSubtitle: {
            color: '#666',
            fontFamily: '"Cormorant Garamond", serif',
        },

        // Forms
        formFieldInput: {
            background: '#FFFFFF',
            border: '1px solid rgba(128, 0, 32, 0.2)',
            borderRadius: '8px',
            padding: '12px 16px',
            fontSize: '1rem',
            fontFamily: '"Cormorant Garamond", serif',
            color: '#2c2c2c',
            transition: 'all 0.3s ease',
            '&:focus': {
                borderColor: '#800020',
                boxShadow: '0 0 0 3px rgba(128, 0, 32, 0.1)',
                outline: 'none',
            },
        },
        formFieldLabel: {
            color: '#800020',
            fontWeight: '600',
            fontSize: '0.95rem',
            marginBottom: '8px',
            fontFamily: '"Cormorant Garamond", serif',
            textTransform: 'uppercase',
            letterSpacing: '1px',
        },

        // Buttons
        formButtonPrimary: {
            background: '#800020',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: '#660019',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(128, 0, 32, 0.3)',
            },
            '&:active': {
                transform: 'translateY(0)',
            },
        },
        formButtonReset: {
            background: 'transparent',
            color: '#800020',
            border: '1px solid #800020',
            borderRadius: '8px',
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: '600',
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'rgba(128, 0, 32, 0.1)',
                borderColor: '#660019',
            },
        },

        // Avatar
        avatarBox: {
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '3px solid #800020',
            boxShadow: '0 4px 12px rgba(128, 0, 32, 0.2)',
        },
        avatarImage: {
            borderRadius: '50%',
        },

        // Profile Section
        profileSectionTitle: {
            color: '#800020',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1.5rem',
            fontWeight: '700',
            letterSpacing: '1px',
            marginBottom: '12px',
            borderBottom: '2px solid rgba(128, 0, 32, 0.2)',
            paddingBottom: '8px',
        },
        profileSectionContent: {
            padding: '20px',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
        },

        // Badge
        badge: {
            background: '#800020',
            color: '#FFFFFF',
            borderRadius: '12px',
            padding: '4px 12px',
            fontSize: '0.85rem',
            fontWeight: '600',
            fontFamily: '"Cormorant Garamond", serif',
            letterSpacing: '1px',
        },

        // Divider
        dividerLine: {
            background: 'rgba(128, 0, 32, 0.2)',
            height: '1px',
        },
        dividerText: {
            color: '#800020',
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: '600',
        },

        // Social Buttons
        socialButtonsBlockButton: {
            border: '1px solid rgba(128, 0, 32, 0.2)',
            borderRadius: '8px',
            padding: '12px',
            transition: 'all 0.3s ease',
            '&:hover': {
                borderColor: '#800020',
                boxShadow: '0 2px 8px rgba(128, 0, 32, 0.1)',
            },
        },

        // Alerts
        alert: {
            borderRadius: '8px',
            padding: '12px 16px',
            fontFamily: '"Cormorant Garamond", serif',
        },
        alertSuccess: {
            background: 'rgba(46, 204, 113, 0.1)',
            border: '1px solid #2ecc71',
            color: '#27ae60',
        },
        alertError: {
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid #e74c3c',
            color: '#c0392b',
        },
        alertWarning: {
            background: 'rgba(243, 156, 18, 0.1)',
            border: '1px solid #f39c12',
            color: '#e67e22',
        },

        // Modal
        modalBackdrop: {
            backdropFilter: 'blur(8px)',
            background: 'rgba(44, 44, 44, 0.5)',
        },
        modalContent: {
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(128, 0, 32, 0.3)',
        },

        // Tabs
        navbar: {
            borderBottom: '2px solid rgba(128, 0, 32, 0.1)',
        },
        navbarButton: {
            color: '#666',
            fontFamily: '"Cormorant Garamond", serif',
            fontSize: '1rem',
            fontWeight: '600',
            padding: '12px 20px',
            transition: 'all 0.3s ease',
            '&:hover': {
                color: '#800020',
            },
        },
        navbarButtonActive: {
            color: '#800020',
            borderBottom: '3px solid #800020',
        },

        // User Preview (dropdown header)
        userPreviewMainIdentifier: {
            fontFamily: '"Cormorant Garamond", serif',
            color: '#800020',
            fontSize: '1.1rem',
            fontWeight: '700',
        },
        userPreviewSecondaryIdentifier: {
            fontFamily: '"Cormorant Garamond", serif',
            color: '#666',
            fontSize: '0.9rem',
        },

        // Dropdown menu items
        userButtonPopoverCard: {
            background: '#FFFFFF',
            border: '1px solid rgba(128, 0, 32, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(128, 0, 32, 0.15)',
        },
        userButtonPopoverActionButton: {
            fontFamily: '"Cormorant Garamond", serif',
            color: '#2c2c2c',
            fontSize: '1rem',
            padding: '12px 16px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            '&:hover': {
                background: 'rgba(128, 0, 32, 0.1)',
                color: '#800020',
            },
        },
        userButtonPopoverActionButtonIcon: {
            color: '#800020',
        },
        userButtonPopoverActionButtonText: {
            fontFamily: '"Cormorant Garamond", serif',
            fontWeight: '500',
        },

        // Footer
        footer: {
            background: 'transparent',
            padding: '16px 0',
        },
        footerAction: {
            fontFamily: '"Cormorant Garamond", serif',
        },
        footerActionLink: {
            color: '#800020',
            fontWeight: '600',
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            '&:hover': {
                color: '#660019',
                textDecoration: 'underline',
            },
        },
    },
};
