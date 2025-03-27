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
    <div className="min-h-screen flex flex-col bg-[#E6D1FA]">
      <div className="flex-grow flex flex-col items-center justify-center py-12">
        <h1 className="text-3xl font-bold text-center mb-8 text-[#381A57]">
          Developed by EventEase Team
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-6">
          {teamMembers.slice(0, 3).map((member, index) => (
            <div
              key={index}
              className="bg-[#1E1E2E] shadow-md rounded-lg p-6 text-center text-white transition-transform duration-300 hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-[#D8B4FE]">{member.name}</h2>
              <p className="text-sm text-gray-400">{member.role}</p>
              <p className="mt-2 text-sm">{member.description}</p>
              <div className="mt-3 space-x-3">
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  LinkedIn
                </a>
                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  GitHub
                </a>
                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  Twitter
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-6">
          {teamMembers.slice(3, 5).map((member, index) => (
            <div
              key={index}
              className="bg-[#1E1E2E] shadow-md rounded-lg p-6 text-center text-white w-[320px] transition-transform duration-300 hover:scale-105"
            >
              <h2 className="text-xl font-semibold text-[#D8B4FE]">{member.name}</h2>
              <p className="text-sm text-gray-400">{member.role}</p>
              <p className="mt-2 text-sm">{member.description}</p>
              <div className="mt-3 space-x-3">
                <a href={member.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  LinkedIn
                </a>
                <a href={member.socials.github} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  GitHub
                </a>
                <a href={member.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-[#A56EF5] hover:underline">
                  Twitter
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevelopedByTeam;
