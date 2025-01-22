import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Button from './Button';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    navigate(`/search?query=${query}`);
  };

  return (
    <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-50px] w-full max-w-3xl bg-gray-50 rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">What do you want to learn?</h2>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        {/* Search Input */}
        <input
          type="text"
          placeholder="Find courses, skills, software, etc"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 py-3 px-4 rounded-lg shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* Search Button */}
        <Button text="Search" onClick={handleSearch} />
      </div>
    </div>
  );
};

export default SearchBar;
