import React from 'react';

const muscles = [
  'chest', 'tricepts', 'shoulder', 'back', 'biceps', 'legs', 'abs', 'forearms', 'cardio', 'glutes', 'calves'
];

const Workout = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Workout</h1>
      <div className="space-y-4">
        {muscles.map((muscle, idx) => (
          <div key={idx} className="flex items-center justify-between bg-gray-800 px-6 py-4 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
            <span className="text-lg font-semibold capitalize">{muscle}</span>
            <div className="flex space-x-4">
              <button className="bg-amber-300 text-gray-900 rounded-full p-2 shadow hover:shadow-md transition-all" title="Play">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.651A1 1 0 007 8.618v6.764a1 1 0 001.234.97l6.518-1.868a1 1 0 00.748-.97V12.138a1 1 0 00-.748-.97z" />
                </svg>
              </button>
              <button className="bg-green-400 text-gray-900 rounded-full p-2 shadow hover:shadow-md transition-all" title="Add">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Workout;
