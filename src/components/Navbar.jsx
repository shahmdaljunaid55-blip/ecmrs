import React, { useState, useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaHeart, FaUser, FaBell } from 'react-icons/fa';
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import { ShopContext } from '../context/ShopContext';
import SearchBar from './SearchBar';
import './Navbar.css';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const { getTotalCartItems, setSearchQuery, unreadCount } = useContext(ShopContext);
    const cartItemCount = getTotalCartItems();
    const location = useLocation();

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            if (location.pathname !== '/') return;

            const sections = ['home', 'rings', 'jewelry', 'pendants', 'bracelets'];

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top >= -100 && rect.top < 300) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [location.pathname]);

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to="/" className="logo glow-text">
                    Nafis | Mashnuba
                </Link>

                <div className="menu-icon" onClick={toggleMenu}>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                    <div className={isOpen ? 'bar open' : 'bar'}></div>
                </div>

                <div className={`nav-menu ${isOpen ? 'active' : ''}`}>
                    <ul className="nav-links">
                        <li><a href="/#home" className={activeSection === 'home' ? 'active' : ''} onClick={toggleMenu}>Home</a></li>
                        <li><a href="/#rings" className={activeSection === 'rings' ? 'active' : ''} onClick={toggleMenu}>Rings</a></li>
                        <li><a href="/#jewelry" className={activeSection === 'jewelry' ? 'active' : ''} onClick={toggleMenu}>Jewelry</a></li>
                        <li><a href="/#pendants" className={activeSection === 'pendants' ? 'active' : ''} onClick={toggleMenu}>Pendants</a></li>
                        <li><a href="/#bracelets" className={activeSection === 'bracelets' ? 'active' : ''} onClick={toggleMenu}>Bracelets</a></li>
                    </ul>

                    <div className="nav-actions">
                        <SearchBar onSearch={setSearchQuery} />
                        <Link to="/wishlist" className="action-icon"><FaHeart /></Link>
                        <Link to="/notifications" className="action-icon notification-icon">
                            <FaBell />
                            {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
                        </Link>
                        <Link to="/cart" className="action-icon cart-icon">
                            <FaShoppingCart />
                            {cartItemCount > 0 && <span className="cart-count">{cartItemCount}</span>}
                        </Link>

                        <SignedOut>
                            <SignInButton mode="modal" appearance={clerkAppearance}>
                                <button className="btn login-btn">Sign In</button>
                            </SignInButton>
                        </SignedOut>
                        <SignedIn>
                            <Link to="/profile" className="action-icon"><FaUser /></Link>
                            <UserButton
                                appearance={clerkAppearance}
                                afterSignOutUrl="/"
                            />
                        </SignedIn>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
