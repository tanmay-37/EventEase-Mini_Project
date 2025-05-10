import React, { useState } from "react";
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Link } from 'react-router-dom';
import logo from "../../assets/logo.png";

const Footer = () => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const validateEmail = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setError("Enter a valid email");
        } else {
            setError("");
            alert("Subscribed successfully!");
            setEmail("");
        }
    };

    return (
        <footer className="bg-[#0F172A] border-t border-[#38BDF8]/20">
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Background Gradient Effects */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-[#38BDF8]/5 blur-3xl rounded-full"></div>
                    <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-[#F59E0B]/5 blur-3xl rounded-full"></div>
                </div>

                <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center space-x-2">
                            <img src={logo} alt="EventEase" className="h-8 w-auto" />
                            <span className="text-[#F1F5F9] font-semibold text-xl">EventEase</span>
                        </div>
                        <p className="text-[#F1F5F9]/80 text-sm leading-relaxed max-w-xs">
                            Your all-in-one platform for discovering, scheduling, and managing college events effortlessly.
                        </p>
                        {/* Newsletter Subscription */}
                        <div className="space-y-3">
                            <h4 className="text-[#F1F5F9] font-medium">Subscribe to our newsletter</h4>
                            <div className="flex flex-col space-y-2">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="bg-[#1E293B] text-[#F1F5F9] px-4 py-2 rounded-lg 
                                        border border-[#38BDF8]/20 focus:border-[#38BDF8] 
                                        focus:ring-1 focus:ring-[#38BDF8] outline-none"
                                />
                                {error && <p className="text-[#EF4444] text-sm">{error}</p>}
                                <button
                                    onClick={validateEmail}
                                    className="bg-[#38BDF8] text-[#0F172A] px-4 py-2 rounded-lg 
                                        font-medium hover:bg-[#38BDF8]/90 transition-colors"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                        {/* Social Links */}
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    className="text-[#F1F5F9]/60 hover:text-[#38BDF8] 
                                        transition-colors duration-300"
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-[#F1F5F9] font-semibold mb-6">Quick Links</h3>
                        <ul className="space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link
                                        to={link.href}
                                        className="text-[#F1F5F9]/60 hover:text-[#38BDF8] 
                                            transition-colors duration-300"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Team Section */}
                    <div>
                        <h3 className="text-[#F1F5F9] font-semibold mb-6">Meet Our Team</h3>
                        <div className="space-y-4">
                            <p className="text-[#F1F5F9]/80 text-sm leading-relaxed">
                                Get to know the passionate team behind EventEase
                            </p>
                            <Link 
                                to="/developed-by-team" 
                                className="inline-flex items-center space-x-2 px-4 py-2 
                                    bg-[#1E293B] text-[#F1F5F9] hover:text-[#38BDF8] 
                                    rounded-lg border border-[#38BDF8]/20 
                                    hover:border-[#38BDF8]/40 transition-all 
                                    duration-300 group"
                            >
                                <span>View Team</span>
                                <span className="transform translate-x-0 group-hover:translate-x-1 
                                    transition-transform duration-300">
                                    →
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-[#38BDF8]/20">
                    <div className="flex flex-col md:flex-row justify-between items-center 
                        space-y-4 md:space-y-0">
                        <p className="text-[#F1F5F9]/60 text-sm">
                            © {new Date().getFullYear()} EventEase. All rights reserved.
                        </p>
                        <div className="flex space-x-6">
                            {legalLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className="text-[#F1F5F9]/60 hover:text-[#38BDF8] text-sm 
                                        transition-colors duration-300"
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

// Constants for links and contact info
const socialLinks = [
    { name: 'Twitter', icon: <FaTwitter size={20} />, href: '#' },
    { name: 'Facebook', icon: <FaFacebook size={20} />, href: '#' },
    { name: 'Instagram', icon: <FaInstagram size={20} />, href: '#' },
    { name: 'LinkedIn', icon: <FaLinkedin size={20} />, href: '#' }
];

const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'About Us', href: '/about' },
    { name: 'View Events', href: '/discover' },
    { name: 'Contact', href: '/contact' }
];

const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Cookie Policy', href: '/cookies' }
];

export default Footer;