import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../api';
import { deriveMembershipStatus } from '../utils/membership';
import { toast } from 'react-toastify';

const Members = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchMembers();
  }, []);

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

  const statusBadgeConfig = {
    active: { label: 'Active', classes: 'border border-green-500/40 bg-green-500/10 text-green-300' },
    expired: { label: 'Expired', classes: 'border border-red-500/40 bg-red-500/10 text-red-300' },
    expiring: { label: 'Expiring Soon', classes: 'border border-yellow-500/40 bg-yellow-500/10 text-yellow-200' },
    inactive: { label: 'Inactive', classes: 'border border-gray-500/40 bg-gray-500/10 text-gray-300' },
    default: { label: 'Pending', classes: 'border border-gray-500/40 bg-gray-500/10 text-gray-300' },
  };

  const getStatusBadge = (status) => statusBadgeConfig[status] || statusBadgeConfig.default;

  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Members</h1>
            <p className="text-gray-400 mt-2">Manage gym members and their details</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button
              onClick={() => navigate('/members/create')}
              className="flex items-center rounded-lg bg-yellow-300 px-4 py-2 font-medium text-gray-900 transition-colors duration-200 hover:bg-yellow-200"
            >
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Member
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="flex-1">
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-lg border border-gray-700 bg-gray-900 py-2 pl-10 pr-3 text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-lg border border-gray-700 bg-gray-900 py-2 px-3 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary"
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
        <div className="space-y-3">
          {filteredMembers.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border border-gray-700 bg-gray-900/70">
              <svg className="mx-auto mb-4 h-16 w-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0 a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <h3 className="text-lg font-medium text-gray-400">No members found</h3>
              <p className="text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredMembers.map((member) => {
              const { label, classes } = getStatusBadge(member.membershipStatus);
              return (
                <div
                  key={member._id}
                  onClick={() => navigate(`/members/${member._id}`)}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-gray-700/60 bg-gray-900/70 px-4 py-3 transition-colors duration-200 hover:border-primary/50 hover:bg-gray-900"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setPreviewImage({ url: member.livePhotoUrl, name: member.fullName });
                      }}
                      className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-gray-700 transition-all duration-200 hover:ring-primary/60"
                      aria-label={`View photo of ${member.fullName}`}
                    >
                      <img
                        className="h-full w-full object-cover"
                        src={member.livePhotoUrl}
                        alt={member.fullName}
                      />
                    </button>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-white">{member.fullName}</p>
                      <span className={`rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wide ${classes}`}>
                        {label}
                      </span>
                    </div>
                  </div>
                  <svg className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Photo Preview */}
      {previewImage && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80" onClick={() => setPreviewImage(null)}></div>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl shadow-black/40">
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-4 top-4 rounded-full bg-black/40 p-2 text-gray-200 transition-colors hover:text-white"
              aria-label="Close preview"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img src={previewImage.url} alt={previewImage.name} className="w-full bg-gray-950 object-contain" />
            <div className="border-t border-gray-800 bg-gray-900/90 px-5 py-3 text-sm text-gray-300">
              Viewing photo of <span className="font-semibold text-white">{previewImage.name}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Members;
