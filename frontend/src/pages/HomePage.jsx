import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="flex min-h-[calc(100vh-6rem)] items-center justify-center bg-gray-100 p-4">
      <div className="text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 md:text-5xl">
          Find Your Perfect Match
        </h1>
        <p className="mt-4 text-lg text-gray-600 md:text-xl">
          Discover products that are visually similar to your favorite items.
        </p>
        <Link
          to="/auth"
          className="mt-8 inline-block rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white transition hover:bg-indigo-700"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
