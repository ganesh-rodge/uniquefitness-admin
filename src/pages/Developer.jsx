import React from 'react';

export default function Developer() {
  const details = {
    name: 'Ganesh Rodge',
    mobile: '9665552822',
    email: 'ganeshrodge25@gmail.com',
    portfolio: 'https://ganeshrodge.dev',
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-8">
      <div className="max-w-2xl mx-auto bg-gray-800 border border-gray-700 rounded-xl p-6 sm:p-8 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Developer Contact</h1>
          <svg className="w-8 h-8 text-amber-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-gray-300 mb-6">If you're interested in building high-quality websites and applications, feel free to reach out.</p>
        <div className="space-y-4">
          <div>
            <span className="block text-sm text-gray-400">Name</span>
            <span className="text-lg font-semibold">{details.name}</span>
          </div>
          {/* Tagline removed as requested */}
          <div>
            <span className="block text-sm text-gray-400">Mobile</span>
            <a href={`tel:${details.mobile}`} className="text-lg font-semibold text-amber-300 hover:underline">{details.mobile}</a>
          </div>
          <div>
            <span className="block text-sm text-gray-400">Email</span>
            <a href={`mailto:${details.email}`} className="text-lg font-semibold text-amber-300 hover:underline">{details.email}</a>
          </div>
          <div>
            <span className="block text-sm text-gray-400">Portfolio</span>
            <a href={details.portfolio} target="_blank" rel="noreferrer" className="text-lg font-semibold text-amber-300 hover:underline">{details.portfolio}</a>
          </div>
        </div>
        <div className="mt-8">
          <a href={details.portfolio} target="_blank" rel="noreferrer" className="inline-flex items-center px-5 py-3 bg-amber-300 text-gray-900 font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Visit Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
