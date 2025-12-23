import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MemberModal from '../components/MemberModal';
import { getMembers } from '../api';
import { toast } from 'react-toastify';

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

  const deriveMembershipStatus = (member) => {
    const fallbackStatus = typeof member?.membershipStatus === 'string' ? member.membershipStatus : null;
    const membership = member?.membership;

    if (!membership) {
      return { status: fallbackStatus || 'inactive', daysRemaining: null };
    }

    if (!membership.endDate) {
      return { status: fallbackStatus || 'active', daysRemaining: null };
    }

    const endDate = new Date(membership.endDate);
    if (Number.isNaN(endDate.getTime())) {
      return { status: fallbackStatus || 'active', daysRemaining: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    const msPerDay = 24 * 60 * 60 * 1000;
    const diffMs = endDate.getTime() - today.getTime();
    const daysRemaining = Math.ceil(diffMs / msPerDay);

    if (diffMs < 0) {
      return { status: 'expired', daysRemaining: 0 };
    }

    if (daysRemaining <= 8) {
      return { status: 'expiring', daysRemaining };
    }

    return { status: 'active', daysRemaining };
  };

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const res = await getMembers();
      if (res.data && res.data.success) {
        const enhancedMembers = (res.data.data || []).map((member) => {
          const { status, daysRemaining } = deriveMembershipStatus(member);
          return {
            ...member,
            membershipStatus: status,
            membershipDaysRemaining: daysRemaining,
          };
        });
        setMembers(enhancedMembers);
      } else {
        toast.error(res.data?.message || 'Failed to fetch members.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch members.');
      console.error('Failed to fetch members:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = (member) => {
    const status = member?.membershipStatus;
    const days = member?.membershipDaysRemaining;

    switch (status) {
      case 'active':
        return 'Active';
      case 'expired':
        return 'Expired';
      case 'expiring':
        if (typeof days === 'number') {
          return `Expiring Soon · ${days} day${days === 1 ? '' : 's'} left`;
        }
        return 'Expiring Soon';
      case 'inactive':
        return 'Inactive';
      default:
        return 'Unknown';
    }
  };

  const getStatusClasses = (status) => {
    const styles = {
      active: {
        badge: 'bg-green-900 text-green-300 border border-green-700',
        dot: 'bg-green-400',
      },
      expired: {
        badge: 'bg-red-900 text-red-300 border border-red-700',
        dot: 'bg-red-400',
      },
      expiring: {
        badge: 'bg-yellow-900 text-yellow-300 border border-yellow-700',
        dot: 'bg-yellow-400',
      },
      inactive: {
        badge: 'bg-gray-900 text-gray-300 border border-gray-700',
        dot: 'bg-gray-400',
      },
      default: {
        badge: 'bg-gray-900 text-gray-300 border border-gray-700',
        dot: 'bg-gray-400',
      },
    };

    return styles[status] || styles.default;
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
          <button onClick={() => navigate('/members/create')} className="bg-primary cursor-pointer bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      {/* Filters */}
  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6">
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
              className="block w-full pl-10 pr-3 py-3 sm:py-2 border border-gray-600 rounded-lg bg-gray-900 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full px-3 py-3 sm:py-2 border border-gray-600 rounded-lg bg-gray-900 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon</option>
            <option value="inactive">Inactive</option>
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
          filteredMembers.map((member) => {
            const { badge, dot } = getStatusClasses(member.membershipStatus);

            return (
              <div
                key={member._id}
                onClick={() => navigate(`/members/${member._id}`)}
                className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-primary cursor-pointer transition-all duration-200 transform hover:scale-105 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Profile Photo */}
                  <div className="flex-shrink-0">
                    <img
                      className="h-16 w-16 sm:h-20 sm:w-20 rounded-full object-cover border-2 border-gray-700"
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
                      
                      <div className="mt-3 sm:mt-0 flex items-center gap-3 flex-wrap">
                        {/* Status Badge */}
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge}`}>
                          <div className={`w-2 h-2 rounded-full mr-2 ${dot}`}></div>
                          {getStatusText(member)}
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
            );
          })
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