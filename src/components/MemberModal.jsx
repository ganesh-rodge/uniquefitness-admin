import { useState } from 'react';

const MemberModal = ({ member, isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('personal');

  if (!isOpen || !member) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'green';
      case 'expired': return 'red';
      case 'expiring': return 'yellow';
      default: return 'gray';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return 'Active';
      case 'expired': return 'Expired';
      case 'expiring': return 'Expiring Soon';
      default: return 'Unknown';
    }
  };

  const getStatusBadgeClasses = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'expired': return 'bg-red-100 text-red-800 border-red-200';
      case 'expiring': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const WeightChart = ({ weightHistory }) => {
    if (!weightHistory || weightHistory.length === 0) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-400">No weight data available</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {weightHistory.map((entry, index) => (
            <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p className="text-sm text-gray-400">{formatDate(entry.date)}</p>
              <p className="text-2xl font-bold text-white">{entry.weight} kg</p>
              {index > 0 && (
                <p className={`text-sm ${
                  entry.weight < weightHistory[index - 1].weight 
                    ? 'text-green-400' 
                    : entry.weight > weightHistory[index - 1].weight 
                      ? 'text-red-400' 
                      : 'text-gray-400'
                }`}>
                  {entry.weight < weightHistory[index - 1].weight && '↓ '}
                  {entry.weight > weightHistory[index - 1].weight && '↑ '}
                  {Math.abs(entry.weight - weightHistory[index - 1].weight)} kg
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full border border-gray-700">
          {/* Header */}
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img
                  className="h-16 w-16 rounded-full object-cover border-2 border-gray-700"
                  src={member.livePhotoUrl}
                  alt={member.fullName}
                />
                <div>
                  <h3 className="text-2xl font-bold text-white">{member.fullName}</h3>
                  <div className="flex items-center mt-1">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      ${member.membershipStatus === 'active' ? 'bg-green-900 text-green-300' : ''}
                      ${member.membershipStatus === 'expired' ? 'bg-red-900 text-red-300' : ''}
                      ${member.membershipStatus === 'expiring' ? 'bg-yellow-900 text-yellow-300' : ''}
                    `}>
                      <div className={`
                        w-2 h-2 rounded-full mr-2
                        ${member.membershipStatus === 'active' ? 'bg-green-400' : ''}
                        ${member.membershipStatus === 'expired' ? 'bg-red-400' : ''}
                        ${member.membershipStatus === 'expiring' ? 'bg-yellow-400' : ''}
                      `}></div>
                      {getStatusText(member.membershipStatus)}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white focus:outline-none"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-700">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'personal', name: 'Personal Info', icon: '👤' },
                { id: 'workout', name: 'Workout Schedule', icon: '💪' },
                { id: 'weight', name: 'Weight History', icon: '📊' },
                { id: 'photos', name: 'Photos', icon: '📷' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2
                    ${activeTab === tab.id
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                    }
                  `}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="px-6 py-6 max-h-96 overflow-y-auto">
            {activeTab === 'personal' && (
              <div className="space-y-6">
                {/* Member Status Section */}
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Membership Status
                  </h4>
                  <div className="flex items-center space-x-4">
                    <span className={`
                      inline-flex items-center px-4 py-2 rounded-full text-sm font-medium
                      ${member.membershipStatus === 'active' ? 'bg-green-900 text-green-300 border border-green-700' : ''}
                      ${member.membershipStatus === 'expired' ? 'bg-red-900 text-red-300 border border-red-700' : ''}
                      ${member.membershipStatus === 'expiring' ? 'bg-yellow-900 text-yellow-300 border border-yellow-700' : ''}
                    `}>
                      <div className={`
                        w-3 h-3 rounded-full mr-2
                        ${member.membershipStatus === 'active' ? 'bg-green-400' : ''}
                        ${member.membershipStatus === 'expired' ? 'bg-red-400' : ''}
                        ${member.membershipStatus === 'expiring' ? 'bg-yellow-400' : ''}
                      `}></div>
                      {getStatusText(member.membershipStatus)}
                    </span>
                    <span className="text-gray-400 text-sm">
                      Member since {formatDate(member.joinDate)}
                    </span>
                  </div>
                </div>

                {/* Personal Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                        Email Address
                      </label>
                      <p className="text-white text-lg">{member.email}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        Phone Number
                      </label>
                      <p className="text-white text-lg">{member.phone}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Gender
                      </label>
                      <p className="text-white text-lg">{member.gender}</p>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0 4 4 0 018 0zm0 0V3a4 4 0 118 0v4" />
                        </svg>
                        Date of Birth
                      </label>
                      <p className="text-white text-lg">{formatDate(member.dateOfBirth)}</p>
                      <p className="text-gray-400 text-sm mt-1">
                        Age: {new Date().getFullYear() - new Date(member.dateOfBirth).getFullYear()} years
                      </p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Address
                      </label>
                      <p className="text-white text-lg">{member.address}</p>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                      <label className="text-sm font-medium text-primary mb-2 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a4 4 0 118 0v4m-4 8a4 4 0 11-8 0 4 4 0 018 0zm0 0V3a4 4 0 118 0v4" />
                        </svg>
                        Member ID
                      </label>
                      <p className="text-white text-lg font-mono">{member._id.slice(-8).toUpperCase()}</p>
                      <p className="text-gray-400 text-xs mt-1">Full ID: {member._id}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'workout' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    Custom Workout Schedule
                  </h4>
                  <p className="text-gray-400 text-sm">Weekly workout plan customized for {member.fullName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(member.customWorkoutSchedule || {}).map(([day, workouts]) => {
                    const isRestDay = workouts.some(w => w.toLowerCase().includes('rest'));
                    return (
                      <div key={day} className={`
                        bg-gray-800 p-5 rounded-lg border transition-all duration-200 hover:border-primary
                        ${isRestDay ? 'border-gray-600' : 'border-gray-700'}
                      `}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-lg font-semibold text-white flex items-center">
                            <div className={`
                              w-3 h-3 rounded-full mr-3
                              ${isRestDay ? 'bg-gray-500' : 'bg-primary'}
                            `}></div>
                            {day}
                          </h4>
                          <span className={`
                            text-xs px-2 py-1 rounded-full
                            ${isRestDay ? 'bg-gray-700 text-gray-400' : 'bg-primary bg-opacity-20 text-primary'}
                          `}>
                            {isRestDay ? 'Rest' : `${workouts.length} exercises`}
                          </span>
                        </div>
                        
                        {workouts.length > 0 ? (
                          <ul className="space-y-3">
                            {workouts.map((workout, index) => (
                              <li key={index} className="text-gray-300 flex items-start">
                                <div className="flex-shrink-0 mt-2">
                                  {isRestDay ? (
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                  )}
                                </div>
                                <span className="ml-3 leading-relaxed">{workout}</span>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <div className="text-center py-4">
                            <svg className="w-8 h-8 text-gray-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                            <p className="text-gray-400 text-sm">No workouts scheduled</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeTab === 'weight' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    Weight Progress Tracking
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {member.weightHistory && member.weightHistory.length > 0 && (
                      <>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Starting Weight</p>
                          <p className="text-2xl font-bold text-white">{member.weightHistory[0].weight} kg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Current Weight</p>
                          <p className="text-2xl font-bold text-white">{member.weightHistory[member.weightHistory.length - 1].weight} kg</p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Total Loss</p>
                          <p className={`text-2xl font-bold ${
                            (member.weightHistory[0].weight - member.weightHistory[member.weightHistory.length - 1].weight) > 0 
                              ? 'text-green-400' 
                              : 'text-red-400'
                          }`}>
                            {Math.abs(member.weightHistory[0].weight - member.weightHistory[member.weightHistory.length - 1].weight)} kg
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-400">Records</p>
                          <p className="text-2xl font-bold text-primary">{member.weightHistory.length}</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                
                <WeightChart weightHistory={member.weightHistory} />
              </div>
            )}

            {activeTab === 'photos' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Member Documents & Photos
                  </h4>
                  <p className="text-gray-400 text-sm">Identity verification and profile photos</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Aadhaar Document
                      </h4>
                      <span className="px-2 py-1 text-xs bg-blue-900 text-blue-300 rounded-full">Verified</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={member.aadhaarPhotoUrl}
                        alt="Aadhaar Document"
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(member.aadhaarPhotoUrl, '_blank')}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Click to view full size</p>
                  </div>

                  <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white flex items-center">
                        <svg className="w-5 h-5 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile Photo
                      </h4>
                      <span className="px-2 py-1 text-xs bg-green-900 text-green-300 rounded-full">Current</span>
                    </div>
                    <div className="border-2 border-dashed border-gray-600 rounded-lg overflow-hidden">
                      <img
                        src={member.livePhotoUrl}
                        alt="Profile Photo"
                        className="w-full h-48 object-cover hover:scale-105 transition-transform duration-200 cursor-pointer"
                        onClick={() => window.open(member.livePhotoUrl, '_blank')}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-2 text-center">Click to view full size</p>
                  </div>
                </div>

                <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <p className="text-white font-medium">Identity Verification Complete</p>
                        <p className="text-gray-400 text-sm">All required documents have been verified</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary hover:bg-yellow-300 text-gray-900 font-medium rounded-lg transition-colors duration-200">
                      Update Photos
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-800 px-6 py-3 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-400">
                Member ID: {member._id}
              </div>
              <div className="flex space-x-3">
                <button className="px-4 py-2 bg-primary hover:bg-yellow-300 text-gray-900 font-medium rounded-lg transition-colors duration-200">
                  Edit Member
                </button>
                <button 
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberModal;