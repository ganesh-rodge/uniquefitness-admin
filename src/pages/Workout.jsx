import React, { useState } from 'react';

const muscles = [
  'chest', 'tricepts', 'shoulder', 'back', 'biceps', 'legs', 'abs', 'forearms', 'cardio', 'glutes', 'calves'
];

const Workout = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [muscleLinks, setMuscleLinks] = useState({}); // { muscle: [link1, link2, ...] }
  const [inputLink, setInputLink] = useState('');
  const [showVideo, setShowVideo] = useState({});

  // Extract YouTube video ID from URL
  const getYoutubeId = (url) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[1].length === 11) ? match[1] : null;
  };

  const handleAddClick = (muscle) => {
    setSelectedMuscle(muscle);
    setInputLink('');
    setShowModal(true);
  };

  const handleSaveLink = () => {
    if (!inputLink) return;
    setMuscleLinks(prev => {
      const prevLinks = prev[selectedMuscle] || [];
      return { ...prev, [selectedMuscle]: [...prevLinks, inputLink] };
    });
    setInputLink('');
  };

  const handleRemoveLink = (muscle, idx) => {
    setMuscleLinks(prev => {
      const links = prev[muscle] ? [...prev[muscle]] : [];
      links.splice(idx, 1);
      return { ...prev, [muscle]: links };
    });
  };

  const handlePlayClick = (muscle) => {
    setShowVideo((prev) => ({ ...prev, [muscle]: !prev[muscle] }));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Workout</h1>
      <div className="space-y-4">
        {muscles.map((muscle, idx) => (
          <div key={idx} className="flex flex-col bg-gray-800 px-6 py-4 rounded-lg shadow hover:bg-gray-700 transition-all duration-200">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold capitalize">{muscle}</span>
              <div className="flex space-x-4">
                <button
                  className="bg-amber-300 text-gray-900 rounded-full p-2 shadow hover:shadow-md transition-all"
                  title="Play"
                  onClick={() => handlePlayClick(muscle)}
                  disabled={!muscleLinks[muscle] || muscleLinks[muscle].length === 0}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-6.518-3.651A1 1 0 007 8.618v6.764a1 1 0 001.234.97l6.518-1.868a1 1 0 00.748-.97V12.138a1 1 0 00-.748-.97z" />
                  </svg>
                </button>
                <button
                  className="bg-green-400 text-gray-900 rounded-full p-2 shadow hover:shadow-md transition-all"
                  title="Add"
                  onClick={() => handleAddClick(muscle)}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
            </div>
            {/* Embedded videos */}
            {showVideo[muscle] && muscleLinks[muscle] && muscleLinks[muscle].length > 0 && (
              <div className="mt-4 grid gap-4">
                {muscleLinks[muscle].map((link, i) => {
                  const vid = getYoutubeId(link);
                  return vid ? (
                    <iframe
                      key={i}
                      width="100%"
                      height="315"
                      src={`https://www.youtube.com/embed/${vid}`}
                      title={`YouTube video ${i+1}`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="rounded-lg"
                    ></iframe>
                  ) : null;
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for adding link */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="bg-gray-800 rounded-lg p-8 shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add YouTube Links for {selectedMuscle}</h2>
            <input
              type="text"
              className="w-full p-2 rounded bg-gray-700 text-white mb-4 border border-gray-600"
              placeholder="Paste YouTube link here..."
              value={inputLink}
              onChange={e => setInputLink(e.target.value)}
            />
            <div className="flex justify-end space-x-2 mb-4">
              <button
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                onClick={handleSaveLink}
                disabled={!inputLink}
              >Add</button>
              <button
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                onClick={() => setShowModal(false)}
              >Close</button>
            </div>
            {/* Show existing links */}
            {muscleLinks[selectedMuscle] && muscleLinks[selectedMuscle].length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Current Links:</h3>
                <ul className="space-y-2">
                  {muscleLinks[selectedMuscle].map((link, idx) => (
                    <li key={idx} className="flex items-center justify-between bg-gray-700 rounded px-2 py-1">
                      <span className="truncate w-4/5" title={link}>{link}</span>
                      <button
                        className="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                        onClick={() => handleRemoveLink(selectedMuscle, idx)}
                      >Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Workout;
