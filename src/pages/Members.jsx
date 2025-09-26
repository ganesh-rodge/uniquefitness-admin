import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberModal from '../components/MemberModal';

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on your provided structure
      setMembers([
        {
          _id: "68cee487612f35ed1e58d2f0",
          fullName: "Ganesh",
          email: "ganeshrodge25@gmail.com",
          phone: 9665552822,
          isEmailVerified: true,
          height: 7,
          weight: 75,
          address: "Ashoknagar",
          gender: "Male",
          dob: "2005-02-10T00:00:00.000Z",
          aadhaarPhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758389382/w4czowxjefowsyzwqulr.jpg",
          livePhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758639931/f4qkwujr37y6kwvqfyri.jpg",
          membership: {
            status: "inactive"
          },
          customWorkoutSchedule: {
            monday: ["Back", "Shoulders"],
            tuesday: ["Biceps"],
            wednesday: ["Biceps", "Shoulders"],
            thursday: ["Triceps"],
            friday: ["Cardio"],
            saturday: ["Calves"],
            sunday: ["Forearms"]
          },
          role: "member",
          weightHistory: [
            {
              date: "2025-09-21T11:39:26.197Z",
              weight: 76,
              _id: "68cfe3ee612f35ed1e58d455"
            },
            {
              date: "2025-09-21T11:39:51.943Z",
              weight: 74,
              _id: "68cfe407612f35ed1e58d46b"
            }
          ],
          createdAt: "2025-09-20T17:29:43.787Z",
          updatedAt: "2025-09-25T05:12:35.402Z",
          membershipStatus: "expired"
        },
        {
          _id: "68cef823612f35ed1e58d3fe",
          fullName: "Poonam",
          email: "iamganeshro@gmail.com",
          phone: 9665552822,
          isEmailVerified: true,
          height: 5.5,
          weight: 60,
          address: "Hinjawadi",
          gender: "Female",
          dob: "1999-04-24T00:00:00.000Z",
          aadhaarPhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758464524/gbuauahxlcclm9wzjfn1.jpg",
          livePhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758464525/pusfxhpfoxtcxopvnfiw.jpg",
          membership: {
            status: "inactive"
          },
          customWorkoutSchedule: {
            monday: ["Chest", "Triceps"],
            tuesday: ["Back", "Biceps"],
            wednesday: ["Shoulders", "Abs"],
            thursday: ["Chest", "Triceps"],
            friday: ["Back", "Biceps", "Forearms"],
            saturday: ["Legs", "Shoulders", "Abs"],
            sunday: ["Rest"]
          },
          role: "member",
          weightHistory: [],
          createdAt: "2025-09-21T14:22:05.687Z",
          updatedAt: "2025-09-22T03:44:20.689Z",
          membershipStatus: "expired"
        },
        {
          _id: "68d103da9faddc5467c07796",
          fullName: "Amit",
          email: "amitkanse62@gmail.com",
          phone: 7030646438,
          isEmailVerified: true,
          height: 5.8,
          weight: 70,
          address: "Ashok Nagar",
          gender: "Male",
          dob: "1995-11-11T00:00:00.000Z",
          aadhaarPhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758528472/sxgzfyv0e1wdobzi7cic.jpg",
          livePhotoUrl: "http://res.cloudinary.com/dknvdmkou/image/upload/v1758528473/vpnei2daoj5qwx0i4cfm.jpg",
          membership: {
            status: "inactive"
          },
          customWorkoutSchedule: {},
          role: "member",
          weightHistory: [],
          createdAt: "2025-09-22T08:07:54.084Z",
          updatedAt: "2025-09-22T08:07:54.916Z",
          membershipStatus: "expired"
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || member.membershipStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Members</h1>
          <p className="text-gray-400 mt-2">Manage gym members and their details</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="bg-primary hover:bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon</option>
          </select>
        </div>
      </div>

      {/* Members List */}
      <div className="space-y-4">
        {filteredMembers.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-400">No members found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        ) : (
          filteredMembers.map((member) => (
            <div
              key={member._id}
              onClick={() => navigate(`/members/${member._id}`)}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-primary cursor-pointer transition-all duration-200 transform hover:scale-105 animate-fade-in"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                {/* Profile Photo */}
                <div className="flex-shrink-0">
                  <img
                    className="h-16 w-16 rounded-full object-cover border-2 border-gray-700"
                    src={member.livePhotoUrl}
                    alt={member.fullName}
                  />
                </div>

                {/* Member Info */}
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{member.fullName}</h3>
                      <p className="text-gray-400 text-sm">{member.email}</p>
                      <p className="text-gray-400 text-sm">Phone: {member.phone}</p>
                    </div>
                    
                    <div className="mt-3 sm:mt-0 flex items-center gap-3">
                      {/* Status Badge */}
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

                      {/* View Details Arrow */}
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Member Detail Modal */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          isOpen={!!selectedMember}
          onClose={() => setSelectedMember(null)}
        />
      )}
    </div>
  );
};

export default Members;