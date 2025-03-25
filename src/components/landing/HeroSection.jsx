import React, { useState, useEffect } from 'react';

const HeroSection = () => {
  const [showDetails, setShowDetails] = useState(false);
  const [headingLoaded, setHeadingLoaded] = useState(false);

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setShowDetails(true);
    } else {
      setShowDetails(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    setHeadingLoaded(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section 
    style={{
        backgroundImage: "url('/images/doodad.png')",
        backgroundSize: "500px",
        backgroundPosition: "left",
        height: "100%",
        width: "100%",
      }}
    className="h-screen flex flex-col justify-center items-center text-white pb-10">
      {/* Main Branding */}
      <h1 className="text-[20vw] text-center mt-10 md:mt-18  w-full from-purple-600 via-purple-700 to-purple-800 bg-gradient-to-r bg-clip-text  text-transparent font-extrabold transition duration-[4000ms] md:-translate-y-2 translate-y-5">
        EventEase
      </h1>      

      {/* Two-Column Section Below Heading */}
      <div className="mt-12 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Description and Button */}
        <div className="text-left flex flex-col gap-y-1">
          <h2 className="text-4xl font-bold mb-4 text-blue-900">Plan Your Events Seamlessly</h2>
          <p className="text-xl text-black font-semibold mb-6">
            Your all-in-one platform for discovering, scheduling, and managing college events effortlessly. Stay updated with the latest happenings, connect with like-minded students, and make your campus life more vibrant and exciting!
          </p>
          <a
            href="#services"
            className="w-32 bg-purple-600 hover:bg-purple-500 text-white font-extrabold py-3 px-6 rounded-lg"
          >
            Get Started
          </a>
        </div>

        {/* Right Column: Image */}
        <div className="flex justify-center">
          <img
            src="/images/calendar.png"
            alt="Event Planning Illustration"
            className="w-full max-w-md"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;





// import React from 'react'

// const HeroSection = () => {
//   return (
//     <div className=''>
        
//     </div>
//   )
// }

// export default HeroSection
