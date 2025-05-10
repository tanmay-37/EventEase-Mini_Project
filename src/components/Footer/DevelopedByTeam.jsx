import React from "react";

const teamMembers = [
  {
    name: "Sanchit Pahurkar",
    role: "Frontend Developer",
    description: "Passionate about building interactive UIs and user experiences.",
    socials: { linkedin: "https://www.linkedin.com/in/sanchit-pahurkar/", github: "#", twitter: "#" },
  },
  {
    name: "Tanmay Talekar",
    role: "Backend Developer",
    description: "Specialist in server-side logic and database management.",
    socials: { linkedin: "https://www.linkedin.com/in/talekar-tanmay/", github: "#", twitter: "#" },
  },
  {
    name: "Rajdeep Chakraborty",
    role: "UI/UX Designer",
    description: "Creating visually appealing and user-friendly designs.",
    socials: { linkedin: "https://www.linkedin.com/in/rajdeep-chakraborty-93021424a/", github: "#", twitter: "#" },
  },
  {
    name: "Rohit Garg",
    role: "Full-Stack Developer",
    description: "Bridging the gap between frontend and backend technologies.",
    socials: { linkedin: "https://www.linkedin.com/in/rohit-garg-377b97244/", github: "https://github.com/rohitgargRG", twitter: "#" },
  },
  {
    name: "Saurabh Joshi",
    role: "Project Manager",
    description: "Ensuring smooth project execution and team collaboration.",
    socials: { linkedin: "https://www.linkedin.com/in/saurabhjoshi15/", github: "https://github.com/saurabhjoshi21", twitter: "#" },
  },
];

const DevelopedByTeam = () => {
  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-12 relative overflow-hidden">
      {/* Background Gradient Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#38BDF8] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#F59E0B] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#EF4444] rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-[#F1F5F9] relative">
          Developed by EventEase Team
          <span className="block w-24 h-1 bg-gradient-to-r from-[#38BDF8] to-[#F59E0B] mx-auto mt-4"></span>
        </h1>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {teamMembers.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="bg-[#1E293B]/80 backdrop-blur-md shadow-lg rounded-xl p-8 text-center 
                transform transition-all duration-300 hover:scale-105 
                border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
                hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#38BDF8] to-[#F59E0B] 
                rounded-full flex items-center justify-center text-2xl font-bold text-[#0F172A]">
                {member.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-semibold text-[#F1F5F9] mb-2">{member.name}</h2>
              <p className="text-sm font-medium text-[#38BDF8] mb-3">{member.role}</p>
              <p className="text-sm text-[#F1F5F9]/70 mb-6 leading-relaxed">{member.description}</p>
              <div className="flex justify-center space-x-4">
                <SocialLink href={member.socials.linkedin} label="LinkedIn" />
                <SocialLink href={member.socials.github} label="GitHub" />
                <SocialLink href={member.socials.twitter} label="Twitter" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {teamMembers.slice(3, 5).map((member, index) => (
            <div
              key={index}
              className="bg-[#1E293B]/80 backdrop-blur-md shadow-lg rounded-xl p-8 text-center 
                transform transition-all duration-300 hover:scale-105 
                border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
                hover:shadow-[0_0_20px_rgba(56,189,248,0.2)]"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#38BDF8] to-[#F59E0B] 
                rounded-full flex items-center justify-center text-2xl font-bold text-[#0F172A]">
                {member.name.charAt(0)}
              </div>
              <h2 className="text-2xl font-semibold text-[#F1F5F9] mb-2">{member.name}</h2>
              <p className="text-sm font-medium text-[#38BDF8] mb-3">{member.role}</p>
              <p className="text-sm text-[#F1F5F9]/70 mb-6 leading-relaxed">{member.description}</p>
              <div className="flex justify-center space-x-4">
                <SocialLink href={member.socials.linkedin} label="LinkedIn" />
                <SocialLink href={member.socials.github} label="GitHub" />
                <SocialLink href={member.socials.twitter} label="Twitter" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const SocialLink = ({ href, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium 
      text-[#F1F5F9] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 
      border border-[#38BDF8]/20 hover:border-[#38BDF8]/40
      rounded-lg transition-all duration-200"
  >
    {label}
  </a>
);

export default DevelopedByTeam;