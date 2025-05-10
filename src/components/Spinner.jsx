import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-2">
      <div className="relative w-full group">
        {/* Search Icon */}
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 
            text-[#38BDF8] opacity-70 transition-opacity duration-200 
            group-hover:opacity-100 z-10"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search through Events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-12 pr-4 text-[#F1F5F9] 
            bg-[#1E293B]/80 rounded-xl border border-[#38BDF8]/20 
            placeholder-[#F1F5F9]/50
            focus:border-[#38BDF8]/40 focus:bg-[#1E293B] 
            focus:outline-none focus:ring-2 focus:ring-[#38BDF8]/20 
            transition-all duration-300
            backdrop-blur-sm
            shadow-[0_0_20px_rgba(56,189,248,0.1)]
            focus:shadow-[0_0_25px_rgba(56,189,248,0.2)]"
        />

        {/* Background Gradient Effect */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#38BDF8]/20 to-[#F59E0B]/20 
          rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-300 -z-10">
        </div>
      </div>
    </div>
  );
};

export default Search;