import React, { useState } from "react";

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
        <footer className="bg-gray-800 text-white py-6">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-center md:items-start">

                    {/* Links Section */}
                    <div className="mb-4 md:mb-0 w-full md:w-1/3 text-center md:text-left">
                        <nav className="flex flex-col md:flex-row justify-center md:justify-start space-y-2 md:space-y-0 md:space-x-4">
                            <a href="#" className="text-gray-300 hover:text-purple-400">Home</a>
                            <a href="#" className="text-gray-300 hover:text-purple-400">About</a>
                            <a href="#" className="text-gray-300 hover:text-purple-400">Contact</a>
                            <a href="#" className="text-gray-300 hover:text-purple-400">FAQs</a>
                        </nav>
                    </div>

                    {/* Newsletter Section */}
                    <div className="mb-4 md:mb-0 w-full md:w-1/3 text-center">
                        <p className="text-gray-300">Subscribe to our Newsletter</p>
                        <div className="flex justify-center mt-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="px-3 py-2 bg-gray-900 text-gray-200 border border-gray-600 rounded-l-md focus:outline-none focus:border-purple-400"
                            />
                            <button 
                                onClick={validateEmail} 
                                className="bg-purple-500 hover:bg-purple-600 px-4 py-2 rounded-r-md text-white"
                            >
                                Subscribe
                            </button>
                        </div>
                        {error && <p className="text-red-500 mt-1">{error}</p>}
                    </div>

                    {/* Developer Info */}
                    <div className="w-full md:w-1/3 text-center md:text-right">
                        <p>
                            <a href="/developed-by-team" className="text-gray-300 hover:text-purple-400">
                                Developed by EventEase Team
                            </a>
                        </p>
                        <a href="#" className="text-gray-300 hover:text-purple-400">Privacy Policy</a>
                        <span className="text-gray-300 mx-2">|</span>
                        <a href="#" className="text-gray-300 hover:text-purple-400">Terms of Service</a>
                    </div>
                </div>
            </div>

            {/* Copyright Section */}
            <div className="text-center mt-6 text-sm text-gray-400">
                &copy; 2025 EventEase. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
