import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardStats, getRecentActivities, getMembers } from '../api';
import { toast } from 'react-toastify';
import { summarizeMemberships } from '../utils/membership';

const colorStyles = {
  blue: {
    accentBar: 'bg-blue-500/70',
    hoverBorder: 'hover:border-blue-400/60',
    hoverBg: 'group-hover:bg-blue-500/5',
    iconBg: 'bg-blue-500/15',
    iconText: 'text-blue-200',
    iconRing: 'ring-1 ring-blue-400/40',
  },
  green: {
    accentBar: 'bg-emerald-500/70',
    hoverBorder: 'hover:border-emerald-400/60',
    hoverBg: 'group-hover:bg-emerald-500/5',
    iconBg: 'bg-emerald-500/15',
    iconText: 'text-emerald-200',
    iconRing: 'ring-1 ring-emerald-400/40',
  },
  yellow: {
    accentBar: 'bg-amber-400/80',
    hoverBorder: 'hover:border-amber-400/60',
    hoverBg: 'group-hover:bg-amber-400/5',
    iconBg: 'bg-amber-400/15',
    iconText: 'text-amber-100',
    iconRing: 'ring-1 ring-amber-300/50',
  },
  red: {
    accentBar: 'bg-rose-500/70',
    hoverBorder: 'hover:border-rose-400/60',
    hoverBg: 'group-hover:bg-rose-500/5',
    iconBg: 'bg-rose-500/15',
    iconText: 'text-rose-100',
    iconRing: 'ring-1 ring-rose-400/40',
  },
  purple: {
    accentBar: 'bg-violet-500/70',
    hoverBorder: 'hover:border-violet-400/60',
    hoverBg: 'group-hover:bg-violet-500/5',
    iconBg: 'bg-violet-500/15',
    iconText: 'text-violet-200',
    iconRing: 'ring-1 ring-violet-400/40',
  },
};

const StatCard = ({ title, value, icon, color, trend = null, description }) => {
  const styles = colorStyles[color] || colorStyles.blue;
  const hasTrend = typeof trend === 'number';
  const trendColor = trend > 0 ? 'text-green-400' : trend < 0 ? 'text-red-400' : 'text-gray-400';

  return (
    <div className={`group relative overflow-hidden rounded-2xl border border-gray-800/70 bg-gray-900/75 p-6 shadow-lg shadow-black/20 transition-colors duration-200 animate-fade-in ${styles.hoverBorder} ${styles.hoverBg}`}>
      <span className={`absolute inset-x-0 top-0 h-1 ${styles.accentBar}`}></span>
      <div className="relative flex flex-col items-center text-center gap-4">
        {hasTrend && (
          <div className={`absolute right-0 top-0 flex items-center ${trendColor}`}>
            {trend > 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ) : trend < 0 ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            )}
            <span className="ml-1 text-xs font-medium">{Math.abs(trend)}%</span>
          </div>
        )}

        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${styles.iconBg} ${styles.iconRing}`}>
          <div className={`${styles.iconText} drop-shadow`}>{icon}</div>
        </div>

        <div>
          <h3 className="text-xs font-semibold text-gray-400 tracking-[0.2em] uppercase">{title}</h3>
          <p className="text-3xl font-extrabold text-white mt-2 tracking-tight">{value}</p>
          {description && (
            <p className="text-xs text-gray-500 mt-2">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const formattedLastUpdated = lastUpdated
    ? lastUpdated.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDashboardStats = async () => {
    const hasExistingStats = Boolean(stats);
    const showFullScreenLoader = !hasExistingStats;
    try {
      if (showFullScreenLoader) {
        setLoading(true);
      } else {
        setIsRefreshing(true);
      }

      const [statsRes, membersRes] = await Promise.allSettled([
        getDashboardStats(),
        getMembers(),
      ]);

      let baseStats = null;
      if (statsRes.status === 'fulfilled') {
        const res = statsRes.value;
        if (res.data && res.data.success) {
          baseStats = res.data.data;
        } else {
          toast.error(res.data?.message || 'Failed to fetch dashboard stats.');
        }
      } else {
        toast.error('Failed to fetch dashboard stats.');
        console.error('Dashboard stats request failed:', statsRes.reason);
      }

      let summary = null;
      if (membersRes.status === 'fulfilled') {
        const res = membersRes.value;
        if (res.data && res.data.success) {
          const members = Array.isArray(res.data.data) ? res.data.data : [];
          summary = summarizeMemberships(members);
        } else {
          toast.error(res.data?.message || 'Failed to fetch members for stats.');
        }
      } else {
        toast.error('Failed to fetch members for stats.');
        console.error('Members request failed:', membersRes.reason);
      }

      const previousStats = stats ? { ...stats } : null;
      let mergedStats = baseStats ? { ...baseStats } : previousStats ? { ...previousStats } : {};

      if (summary) {
        mergedStats = {
          ...mergedStats,
          totalMembers: summary.total,
          activeMembers: summary.active,
          expiringSoon: summary.expiring,
          expiredMembers: summary.expired,
          inactiveMembers: summary.inactive,
        };
      } else {
        mergedStats = {
          totalMembers: mergedStats.totalMembers ?? 0,
          activeMembers: mergedStats.activeMembers ?? 0,
          expiringSoon: mergedStats.expiringSoon ?? 0,
          expiredMembers: mergedStats.expiredMembers ?? 0,
          inactiveMembers: mergedStats.inactiveMembers ?? 0,
        };
      }

      setStats(mergedStats);
      if (baseStats || summary) {
        setLastUpdated(new Date());
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch dashboard stats.');
      console.error('Failed to fetch dashboard stats:', error);
      if (!stats) {
        setStats({
          totalMembers: 0,
          activeMembers: 0,
          expiringSoon: 0,
          expiredMembers: 0,
          inactiveMembers: 0,
        });
      }
    } finally {
      if (showFullScreenLoader) {
        setLoading(false);
      } else {
        setIsRefreshing(false);
      }
    }
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  };

  const handleRefresh = () => {
    fetchDashboardStats();
    fetchActivities();
  };

  const fetchActivities = async () => {
    try {
      const res = await getRecentActivities(1, 2);
      if (res.data && res.data.success) {
        const items = res.data.data?.items || [];
        setActivities(items.slice(0, 2));
      }
    } catch (error) {
      console.error('Failed to fetch activities:', error);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
    fetchActivities();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back! Here's what's happening at Unique Fitness.</p>
          {formattedLastUpdated && (
            <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-gray-700/60 bg-gray-900/70 px-3 py-1 text-xs text-gray-400">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Updated {formattedLastUpdated}
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Total Members"
          value={stats?.totalMembers || 0}
          color="blue"
          trend={5}
          description="All registered members"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
        />

        <StatCard
          title="Active Members"
          value={stats?.activeMembers || 0}
          color="green"
          trend={0}
          description="Currently active"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Expiring Soon"
          value={stats?.expiringSoon || 0}
          color="yellow"
          trend={0}
          description="Within 7 days"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          }
        />

        <StatCard
          title="Expired Members"
          value={stats?.expiredMembers || 0}
          color="red"
          trend={0}
          description="Need renewal"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Inactive Members"
          value={stats?.inactiveMembers ?? 0}
          color="purple"
          description="No plan assigned"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9V5a1 1 0 011-1h2a1 1 0 011 1v4m0 0h3a1 1 0 011 1v2a1 1 0 01-1 1h-3m0 0v4a1 1 0 01-1 1h-2a1 1 0 01-1-1v-4m0 0H7a1 1 0 01-1-1v-2a1 1 0 011-1h3" />
            </svg>
          }
        />
        </div>

        {/* Additional Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Quick Actions */}
          <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/30">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={() => navigate('/members/create')}
                className="group w-full flex items-center justify-between rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30 px-4 py-4 text-gray-300 transition-all duration-200 hover:border-primary/60 hover:from-primary/10 hover:via-gray-900/40 hover:to-transparent hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/60 bg-gray-800/80 text-green-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Add New Member</p>
                    <p className="text-xs text-gray-400">Create a profile instantly</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={() => navigate('/announcements', { state: { openForm: true } })}
                className="group w-full flex items-center justify-between rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30 px-4 py-4 text-gray-300 transition-all duration-200 hover:border-blue-400/60 hover:from-blue-500/10 hover:via-gray-900/40 hover:to-transparent hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/60 bg-gray-800/80 text-blue-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Create Announcement</p>
                    <p className="text-xs text-gray-400">Share updates with members</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                className="group w-full flex items-center justify-between rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30 px-4 py-4 text-gray-300 transition-all duration-200 hover:border-yellow-400/60 hover:from-yellow-500/10 hover:via-gray-900/40 hover:to-transparent hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/60 bg-gray-800/80 text-yellow-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">View Reports</p>
                    <p className="text-xs text-gray-400">Review performance metrics</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <button
                onClick={handleChangePassword}
                className="group w-full flex items-center justify-between rounded-xl border border-gray-700/50 bg-gradient-to-r from-gray-900/85 via-gray-900/60 to-gray-900/30 px-4 py-4 text-gray-300 transition-all duration-200 hover:border-red-400/60 hover:from-red-500/10 hover:via-gray-900/40 hover:to-transparent hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-700/60 bg-gray-800/80 text-red-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                    </svg>
                  </span>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-white">Change Password</p>
                    <p className="text-xs text-gray-400">Update admin credentials</p>
                  </div>
                </div>
                <svg className="h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900/80 border border-gray-700/60 rounded-2xl p-6 backdrop-blur-sm shadow-xl shadow-black/30">
            <h2 className="text-xl font-semibold text-white mb-5 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recent Activity
            </h2>
            <div className="space-y-3">
              {activities.length === 0 ? (
                <div className="rounded-xl border border-gray-800/60 bg-gray-900/70 px-4 py-5 text-center">
                  <p className="text-sm text-gray-300">No recent activity</p>
                  <p className="text-xs text-gray-500 mt-1">Member activities will appear here</p>
                </div>
              ) : (
                activities.map((act, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-800/60 bg-gray-900/70 px-4 py-4 flex items-start justify-between transition-colors duration-200 hover:border-primary/50"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{act.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(act.at).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                      {act.actor?.name && (
                        <p className="text-xs text-gray-500 mt-1">By: {act.actor.name}{act.actor?.email ? ` (${act.actor.email})` : ''}</p>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        {/* Refresh button */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-transparent bg-yellow-500 px-5 py-2.5 text-sm font-semibold text-slate-900 shadow-lg shadow-yellow-500/30 transition-colors duration-200 hover:bg-yellow-400 focus:outline-none focus-visible:ring-2 focus-visible:ring-yellow-300 disabled:cursor-not-allowed disabled:bg-yellow-500/70"
          >
            {isRefreshing ? (
              <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            )}
            {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
          </button>
        </div>
      {/* Add Member Modal */}
      </div>
    </div>
  );
};

export default Dashboard;