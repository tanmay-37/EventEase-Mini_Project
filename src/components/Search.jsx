import React from 'react';

const Search = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="w-full max-w-[600px] mx-auto px-4 py-2">
      <div className="relative w-full">
        <svg
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#4A3F74] opacity-80 transition-opacity duration-200 hover:opacity-100"
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

        <input
          type="text"
          placeholder="Search through Events"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full py-3 pl-12 pr-4 text-[#4A3F74] bg-[#E9DAFF] rounded-full border-2 border-[#D1C2FF] focus:border-[#A084E8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#D1C2FF] transition-all duration-300 shadow-sm"
        />
      </div>
    </div>
  );
};

export default Search;