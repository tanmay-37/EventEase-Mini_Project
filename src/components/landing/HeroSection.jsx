import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion'; // Add framer-motion for animations

const HeroSection = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [headingLoaded, setHeadingLoaded] = useState(false);
  const navigate = useNavigate();
  const { user, userType } = UserAuth();

  useEffect(() => {
    const handleScroll = () => setShowDetails(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    setHeadingLoaded(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate(userType === 'host' ? '/host-dashboard' : '/user-dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <section className="relative min-h-screen bg-[#0F172A] overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl animate-blob opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000 opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#EF4444] rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000 opacity-20"></div>
      </div>

      <div className="container mx-auto px-4 py-16 lg:py-24 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 space-y-10"
          >
            {/* Brand Name */}
            <div className="relative">
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black relative z-10">
                <span className="relative inline-block">
                  <span className="bg-gradient-to-br from-[#38BDF8] via-[#F1F5F9]/70 to-[#38BDF8] bg-clip-text text-transparent drop-shadow-md animate-shimmer-slow">
                    Event
                  </span>
                  <span className="bg-gradient-to-br from-[#F59E0B] via-[#F1F5F9]/70 to-[#EF4444] bg-clip-text text-transparent drop-shadow-md animate-shimmer-slow">
                    Ease
                  </span>
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#38BDF8]/10 via-[#F59E0B]/10 to-[#EF4444]/10 blur-lg rounded-lg"></div>
                </span>
              </h1>
              <div className="absolute -top-8 -left-8 w-32 h-32 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full opacity-10 blur-2xl animate-pulse-slow"></div>
            </div>

            {/* Tagline */}
            <h2 className="text-4xl md:text-5xl font-bold text-[#F1F5F9] relative">
              Transform Your Events Into
              <span className="block mt-2">Unforgettable Experiences</span>
              <div className="absolute -bottom-4 left-0 h-2 w-32 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-full"></div>
            </h2>

            {/* Description */}
            <div className="relative">
              <p className="text-xl md:text-2xl text-[#F1F5F9]/90 max-w-2xl leading-relaxed backdrop-blur-sm bg-[#0F172A]/50 p-6 rounded-lg border border-[#38BDF8]/20">
                Your all-in-one platform for discovering, scheduling, and managing college events effortlessly. 
                Connect with like-minded students and make your campus life more vibrant!
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-6 pt-6">
            <motion.button
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 0 20px rgba(245, 158, 11, 0.2)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetStarted}
              className="px-10 py-5 bg-[#F59E0B] hover:bg-[#F59E0B]/90
                text-[#000000] text-lg font-bold rounded-full 
                shadow-lg transition-all duration-300 backdrop-blur-sm
                border border-[#F59E0B]/20"
            >
              Get Started
            </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(56, 189, 248, 0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-transparent border-2 border-[#38BDF8] text-[#38BDF8] hover:bg-[#38BDF8]/10 text-lg font-bold rounded-full transition-all duration-300"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex-1 relative"
          >
            <div className="relative z-10 transform hover:scale-105 transition-transform duration-500">
              <div className="absolute inset-0 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] rounded-3xl blur-2xl opacity-20"></div>
              <img
                src="/images/calendar.png"
                alt="Event Planning Illustration"
                className="w-full h-auto max-w-2xl mx-auto drop-shadow-2xl rounded-2xl"
              />
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24"
        >
          {[
            { title: "Easy Planning", icon: "📅", description: "Streamline your event planning process with intuitive tools." },
            { title: "Real-time Updates", icon: "🔔", description: "Stay informed with instant notifications and live updates." },
            { title: "Community Driven", icon: "👥", description: "Connect with peers and build lasting relationships." }
          ].map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, boxShadow: "0 10px 30px rgba(56, 189, 248, 0.1)" }}
              className="p-8 bg-[#0F172A]/60 border border-[#38BDF8]/10 backdrop-blur-sm rounded-3xl shadow-lg hover:border-[#38BDF8]/30 transition-all duration-300"
            >
              <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-[#F1F5F9] mb-4">{feature.title}</h3>
              <p className="text-[#F1F5F9]/80 text-lg">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;