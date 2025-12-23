import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById, deleteMemberById, getMembershipPlans, getMembershipPlanById, assignPlanToMember, updateMemberPlanAssignment, deleteMemberPlanAssignment } from '../api';
import { toast } from 'react-toastify';

const MemberDetails = () => {
    const resolveMembershipPlanId = (membership) => {
      if (!membership) {
        return '';
      }

      const ensureString = (value) => {
        if (typeof value === 'string') {
          return value.trim();
        }
        if (value == null) {
          return '';
        }
        if (typeof value === 'object') {
          return '';
        }
        return String(value).trim();
      };

      const directPlan = ensureString(membership.plan);
      if (directPlan) {
        return directPlan;
      }

      if (membership.plan && typeof membership.plan === 'object') {
        const nestedId = ensureString(membership.plan._id || membership.plan.id);
        if (nestedId) {
          return nestedId;
        }
      }

      const explicitPlanId = ensureString(membership.planId);
      if (explicitPlanId) {
        return explicitPlanId;
      }

      return '';
    };

  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');
  const [planForm, setPlanForm] = useState({ planId: '', startDate: '' });
  const [assigningPlan, setAssigningPlan] = useState(false);
  const [removingPlan, setRemovingPlan] = useState(false);
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [membershipPlanDetails, setMembershipPlanDetails] = useState(null);
  const [planDetailsCache, setPlanDetailsCache] = useState({});
  const memberPlanId = resolveMembershipPlanId(member?.membership);
  const hasAssignedMembership = useMemo(() => {
    if (!member?.membership) {
      return false;
    }
    return Boolean(memberPlanId);
  }, [member?.membership, memberPlanId]);

  useEffect(() => {
    fetchMemberDetails();
  }, [id]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setPlansLoading(true);
        const res = await getMembershipPlans();
        if (res.data && res.data.success) {
          const fetchedPlans = Array.isArray(res.data.data) ? res.data.data : [];
          setPlans(fetchedPlans);
        } else {
          setPlans([]);
          toast.error(res.data?.message || 'Failed to fetch membership plans.');
        }
      } catch (error) {
        setPlans([]);
        toast.error(error.response?.data?.message || 'Failed to fetch membership plans.');
      } finally {
        setPlansLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const fetchMemberDetails = async () => {
    try {
      setLoading(true);
      const res = await getMemberById(id);
      if (res.data && res.data.success) {
        const foundMember = res.data.data;
        setMember(foundMember);
        setEditFormData({
          fullName: foundMember.fullName,
          email: foundMember.email,
          phone: foundMember.phone.toString(),
          height: foundMember.height.toString(),
          weight: foundMember.weight.toString(),
          address: foundMember.address,
          gender: foundMember.gender,
          dob: foundMember.dob.split('T')[0]
        });
        setPlanForm({
          planId: resolveMembershipPlanId(foundMember.membership),
          startDate: foundMember.membership?.startDate ? foundMember.membership.startDate.split('T')[0] : ''
        });
      } else {
        toast.error(res.data?.message || 'Failed to fetch member details.');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to fetch member details.');
      console.error('Failed to fetch member details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (!editFormData.fullName.trim() || !editFormData.email.trim() || !editFormData.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update member data
      const updatedMember = {
        ...member,
        fullName: editFormData.fullName,
        email: editFormData.email,
        phone: parseInt(editFormData.phone),
        height: parseFloat(editFormData.height),
        weight: parseInt(editFormData.weight),
        address: editFormData.address,
        gender: editFormData.gender,
        dob: editFormData.dob + 'T00:00:00.000Z',
        updatedAt: new Date().toISOString()
      };
      
      setMember(updatedMember);
      setShowEditModal(false);
      alert('Member updated successfully!');
    } catch (error) {
      console.error('Failed to update member:', error);
      alert('Failed to update member');
    }
  };

  const handleDeleteMember = async () => {
    if (!window.confirm(`Are you sure you want to delete ${member.fullName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await deleteMemberById(member._id);
      toast.success('Member deleted successfully!');
      navigate('/members');
    } catch (error) {
      console.error('Failed to delete member:', error);
      toast.error(error.response?.data?.message || 'Failed to delete member');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob) => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: 'bg-green-900 text-green-300 border-green-700',
      expiring: 'bg-yellow-900 text-yellow-300 border-yellow-700',
      inactive: 'bg-gray-900 text-gray-300 border-gray-700',
      expired: 'bg-red-900 text-red-300 border-red-700'
    };
    
    return statusConfig[status] || statusConfig.inactive;
  };

  const getDaySchedule = (day, schedule) => {
    const daySchedule = schedule[day.toLowerCase()];
    return daySchedule && daySchedule.length > 0 ? daySchedule.join(', ') : 'Rest';
  };

  const getLatestWeight = () => {
    if (!member.weightHistory || member.weightHistory.length === 0) {
      return member.weight;
    }
    return member.weightHistory[member.weightHistory.length - 1].weight;
  };

  const getWeightChange = () => {
    if (!member.weightHistory || member.weightHistory.length < 2) {
      return null;
    }
    const latest = member.weightHistory[member.weightHistory.length - 1].weight;
    const previous = member.weightHistory[member.weightHistory.length - 2].weight;
    return latest - previous;
  };

  useEffect(() => {
    const loadMembershipPlanDetails = async () => {
      if (!member?.membership) {
        setMembershipPlanDetails(null);
        return;
      }

      if (!memberPlanId) {
        setMembershipPlanDetails(null);
        return;
      }

      const cachedPlan = planDetailsCache[memberPlanId];
      if (cachedPlan) {
        setMembershipPlanDetails(cachedPlan);
        return;
      }

      const catalogPlan = plans.find((plan) => plan._id === memberPlanId || plan.id === memberPlanId);
      if (catalogPlan) {
        setMembershipPlanDetails(catalogPlan);
        setPlanDetailsCache((prev) => (prev[memberPlanId] ? prev : { ...prev, [memberPlanId]: catalogPlan }));

        const hasPrice = catalogPlan.price != null;
        const hasDuration = (catalogPlan.duration ?? catalogPlan.durationMonths) != null;
        if (hasPrice && hasDuration) {
          return;
        }
      }

      try {
        const res = await getMembershipPlanById(memberPlanId);
        if (res.data && res.data.success && res.data.data) {
          setMembershipPlanDetails(res.data.data);
          setPlanDetailsCache((prev) => ({ ...prev, [memberPlanId]: res.data.data }));
        } else {
          setMembershipPlanDetails(catalogPlan || null);
        }
      } catch (error) {
        console.error('Failed to fetch membership plan details:', error);
        setMembershipPlanDetails(catalogPlan || null);
      }
    };

    loadMembershipPlanDetails();
  }, [member?.membership, memberPlanId, plans, planDetailsCache]);

  useEffect(() => {
    const fetchSelectedPlanDetails = async () => {
      if (!planForm.planId || planDetailsCache[planForm.planId]) {
        return;
      }

      const planFromCatalog = plans.find((plan) => plan._id === planForm.planId || plan.id === planForm.planId);
      if (planFromCatalog) {
        setPlanDetailsCache((prev) => (prev[planForm.planId] ? prev : { ...prev, [planForm.planId]: planFromCatalog }));
        const hasPrice = planFromCatalog.price != null;
        const hasDuration = (planFromCatalog.duration ?? planFromCatalog.durationMonths) != null;
        if (hasPrice && hasDuration) {
          return;
        }
      }

      try {
        const res = await getMembershipPlanById(planForm.planId);
        if (res.data && res.data.success && res.data.data) {
          setPlanDetailsCache((prev) => ({ ...prev, [planForm.planId]: res.data.data }));
        }
      } catch (error) {
        console.error('Failed to fetch selected plan details:', error);
      }
    };

    fetchSelectedPlanDetails();
  }, [planForm.planId, planDetailsCache, plans]);

  const branchPlans = useMemo(() => {
    if (!member?.branch) {
      return plans;
    }
    const branchKey = member.branch.toLowerCase();
    return plans.filter((plan) => {
      const planBranch = (plan.branch || '').toLowerCase();
      return planBranch === branchKey || planBranch === 'all';
    });
  }, [member?.branch, plans]);

  const selectedPlan = useMemo(() => {
    const planIdValue = planForm.planId;
    return plans.find((plan) => plan._id === planIdValue || plan.id === planIdValue) || null;
  }, [plans, planForm.planId]);

  const selectedPlanDetail = useMemo(() => {
    if (!planForm.planId) {
      return null;
    }
    return planDetailsCache[planForm.planId] || selectedPlan;
  }, [planDetailsCache, planForm.planId, selectedPlan]);

  const selectedPlanDurationValue = useMemo(() => {
    if (!selectedPlanDetail) {
      return null;
    }
    return selectedPlanDetail.duration ?? selectedPlanDetail.durationMonths ?? null;
  }, [selectedPlanDetail]);

  const memberPlanFromCatalog = useMemo(() => {
    if (!member?.membership || !memberPlanId) {
      return null;
    }
    return plans.find((plan) => plan._id === memberPlanId || plan.id === memberPlanId) || null;
  }, [member?.membership, memberPlanId, plans]);

  const autoEndDate = useMemo(() => {
    if (!selectedPlanDetail || !planForm.startDate) {
      return '';
    }
    const rawDuration = selectedPlanDurationValue;
    if (rawDuration == null) {
      return '';
    }
    const durationMonths = Number(rawDuration);
    if (!Number.isFinite(durationMonths) || durationMonths <= 0) {
      return '';
    }
    const start = new Date(`${planForm.startDate}T00:00:00`);
    const end = new Date(start);
    end.setMonth(end.getMonth() + durationMonths);
    end.setDate(end.getDate() - 1);
    return end.toISOString().split('T')[0];
  }, [planForm.startDate, selectedPlanDetail, selectedPlanDurationValue]);

  const resetMembershipForm = () => {
    setPlanForm({ planId: '', startDate: '' });
  };

  const handleAssignMembership = async (event) => {
    event.preventDefault();
    if (assigningPlan) {
      return;
    }
    if (!planForm.planId || !planForm.startDate) {
      toast.error('Select a plan and a start date.');
      return;
    }
    if (!selectedPlanDetail) {
      toast.error('Selected plan is not available for this branch.');
      return;
    }

    const formattedStartDate = new Date(`${planForm.startDate}T00:00:00`).toLocaleDateString('en-GB');
    const payload = {
      planId: selectedPlanDetail._id || selectedPlanDetail.id || planForm.planId,
      startDate: formattedStartDate.replace(/\//g, '-'),
    };

    try {
      setAssigningPlan(true);
      if (hasAssignedMembership) {
        await updateMemberPlanAssignment(member._id, payload);
        toast.success('Plan updated successfully.');
      } else {
        await assignPlanToMember(member._id, payload);
        toast.success('Plan assigned successfully.');
      }
      await fetchMemberDetails();
      resetMembershipForm();
    } catch (error) {
      console.error('Failed to assign plan:', error);
      toast.error(error.response?.data?.message || 'Failed to assign plan.');
    } finally {
      setAssigningPlan(false);
    }
  };

  const handleRemoveMembership = async () => {
    if (!member?.membership) {
      toast.error('No membership assigned to remove.');
      return;
    }

    const confirmation = window.confirm('Remove the current membership plan? This action cannot be undone.');
    if (!confirmation) {
      return;
    }

    try {
      setRemovingPlan(true);
      await deleteMemberPlanAssignment(member._id);
      setMembershipPlanDetails(null);
      toast.success('Membership plan removed successfully.');
      await fetchMemberDetails();
      resetMembershipForm();
    } catch (error) {
      console.error('Failed to remove membership plan:', error);
      toast.error(error.response?.data?.message || 'Failed to remove membership plan.');
    } finally {
      setRemovingPlan(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading member details...</p>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-400 mb-2">Member Not Found</h3>
          <p className="text-gray-500 mb-4">The requested member could not be found.</p>
          <button
            onClick={() => navigate('/members')}
            className="bg-primary hover:bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  const resolvedPlanDetails = membershipPlanDetails
    || memberPlanFromCatalog
    || (memberPlanId ? planDetailsCache[memberPlanId] : null);
  const assignedPlanName = resolvedPlanDetails?.name || member.membership?.planName || member.membership?.name || '';
  const assignedPlanBranch = (resolvedPlanDetails?.branch || member.membership?.branch || member.branch || 'N/A').toString();
  const assignedPlanPrice = resolvedPlanDetails?.price ?? member.membership?.price;
  const assignedPlanDuration = (resolvedPlanDetails?.duration ?? resolvedPlanDetails?.durationMonths ?? member.membership?.duration ?? member.membership?.durationMonths);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: '👤' },
    { id: 'workout', label: 'Workout Schedule', icon: '💪' },
    { id: 'weight', label: 'Weight History', icon: '📊' },
    { id: 'photos', label: 'Photos', icon: '📷' },
    { id: 'membership', label: 'Membership Plan', icon: '🪪' }
  ];

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/members')}
              className="mr-4 p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-white">{member.fullName}</h1>
              <div className="flex items-center mt-2 space-x-4">
                <span className={`
                  inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                  ${getStatusBadge(member.membership?.status)}
                `}>
                  <div className={`
                    w-2 h-2 rounded-full mr-2
                    ${member.membership?.status === 'active' ? 'bg-green-400' : 
                      member.membership?.status === 'expired' ? 'bg-red-400' : 
                      member.membership?.status === 'expiring' ? 'bg-yellow-400' : 'bg-gray-400'}
                  `}></div>
                  {member.membership?.status
                    ? member.membership.status.charAt(0).toUpperCase() + member.membership.status.slice(1)
                    : 'Unknown'}
                </span>
                <span className="text-gray-400 text-sm">
                  Member since {formatDate(member.createdAt)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button
              onClick={handleDeleteMember}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Member
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200
                  ${activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
                  }
                `}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'personal' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Basic Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Full Name</label>
                    <p className="text-white mt-1">{member.fullName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Gender</label>
                    <p className="text-white mt-1">{member.gender}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Date of Birth</label>
                    <p className="text-white mt-1">{formatDate(member.dob)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Age</label>
                    <p className="text-white mt-1">{calculateAge(member.dob)} years</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Address</label>
                  <p className="text-white mt-1">{member.address}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact Information
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Email</label>
                  <div className="flex items-center mt-1">
                    <p className="text-white mr-2">{member.email}</p>
                    {member.isEmailVerified && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-900 text-green-300 border border-green-700">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Phone</label>
                  <p className="text-white mt-1">{member.phone}</p>
                </div>
              </div>
            </div>

            {/* Physical Stats */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Physical Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">Height</label>
                  <p className="text-white mt-1">{member.height} ft</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-400">Current Weight</label>
                  <div className="flex items-center mt-1">
                    <p className="text-white mr-2">{getLatestWeight()} kg</p>
                    {getWeightChange() !== null && (
                      <span className={`
                        inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                        ${getWeightChange() > 0 ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}
                      `}>
                        {getWeightChange() > 0 ? '+' : ''}{getWeightChange()} kg
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Account Information
              </h3>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Member ID</label>
                    <p className="text-white mt-1 text-xs font-mono">{member._id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Role</label>
                    <p className="text-white mt-1 capitalize">{member.role}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">Joined Date</label>
                    <p className="text-white mt-1">{formatDate(member.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">Last Updated</label>
                    <p className="text-white mt-1">{formatDate(member.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workout' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Weekly Workout Schedule
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => (
                <div key={day} className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-white">{day}</h4>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-medium
                      ${getDaySchedule(day, member.customWorkoutSchedule) === 'Rest' 
                        ? 'bg-blue-900 text-blue-300' 
                        : 'bg-green-900 text-green-300'}
                    `}>
                      {getDaySchedule(day, member.customWorkoutSchedule) === 'Rest' ? 'Rest Day' : 'Workout'}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    {getDaySchedule(day, member.customWorkoutSchedule)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'weight' && (
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
              <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Weight History ({member.weightHistory?.length || 0} records)
            </h3>
            
            {member.weightHistory && member.weightHistory.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {member.weightHistory.map((record, index) => {
                  const prevWeight = index > 0 ? member.weightHistory[index - 1].weight : member.weight;
                  const change = record.weight - prevWeight;
                  
                  return (
                    <div key={record._id} className="bg-gray-800 border border-gray-600 rounded-lg p-4 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{record.weight} kg</p>
                        <p className="text-gray-400 text-sm">{formatDate(record.date)}</p>
                      </div>
                      <div className="text-right">
                        {change !== 0 && (
                          <span className={`
                            inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${change > 0 ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}
                          `}>
                            {change > 0 ? '+' : ''}{change} kg
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <p className="text-gray-400">No weight history available</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'photos' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Aadhaar Photo
              </h3>
              {member.aadhaarPhotoUrl ? (
                <img
                  src={member.aadhaarPhotoUrl}
                  alt="Aadhaar"
                  className="w-full h-64 object-cover rounded-lg border border-gray-600"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No Aadhaar photo available</p>
                </div>
              )}
            </div>
            
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Live Photo
              </h3>
              {member.livePhotoUrl ? (
                <img
                  src={member.livePhotoUrl}
                  alt="Live"
                  className="w-full h-64 object-cover rounded-lg border border-gray-600"
                />
              ) : (
                <div className="w-full h-64 bg-gray-800 border border-gray-600 rounded-lg flex items-center justify-center">
                  <p className="text-gray-400">No live photo available</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'membership' && (
          <div className="space-y-6">
            <div className="relative rounded-2xl border border-gray-700 bg-gradient-to-br from-gray-900 via-gray-900 to-gray-800 shadow-xl overflow-hidden">
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-primary/5 via-transparent to-red-500/5" />
              <div className="relative flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 p-6 lg:p-8">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6 9.5 7.12 9.5 8.5 10.62 11 12 11zm0 0c-3.59 0-6.5 2.91-6.5 6.5V19a1 1 0 001 1h11a1 1 0 001-1v-1.5c0-3.59-2.91-6.5-6.5-6.5z" />
                      </svg>
                      Current Membership
                    </h3>
                    {member.membership && (
                      <button
                        onClick={handleRemoveMembership}
                        type="button"
                        disabled={removingPlan}
                        className={`inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-semibold transition-all duration-200 ${removingPlan ? 'bg-gray-800 text-gray-500 cursor-not-allowed' : 'bg-red-600/90 hover:bg-red-600 text-white shadow-lg shadow-red-900/40'}`}
                      >
                        {removingPlan ? (
                          'Removing...'
                        ) : (
                          <span className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Remove Plan
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                  <p className="text-gray-400 text-sm mb-4">
                    Review the member’s current plan, benefits, and key dates in one place.
                  </p>
                  {member.membership ? (
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`
                          inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                          ${getStatusBadge(member.membership.status)}
                        `}>
                          <div className={`
                            w-2 h-2 rounded-full mr-2
                            ${member.membership.status === 'active' ? 'bg-green-400' :
                              member.membership.status === 'expired' ? 'bg-red-400' :
                              member.membership.status === 'expiring' ? 'bg-yellow-400' : 'bg-gray-400'}
                          `}></div>
                          {member.membership.status ? member.membership.status.charAt(0).toUpperCase() + member.membership.status.slice(1) : 'Unknown'}
                        </span>
                        {assignedPlanName && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary bg-opacity-10 text-primary border border-primary border-opacity-30">
                            {assignedPlanName}
                          </span>
                        )}
                        {membershipPlanDetails?.status && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-800 text-gray-200 border border-gray-600">
                            Plan {membershipPlanDetails.status.charAt(0).toUpperCase() + membershipPlanDetails.status.slice(1)}
                          </span>
                        )}
                      </div>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">Plan Name</dt>
                          <dd className="text-white mt-1 text-base">
                            {assignedPlanName || 'Not assigned'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">Branch</dt>
                          <dd className="text-white mt-1 text-base">
                            {assignedPlanBranch ? assignedPlanBranch.toUpperCase() : 'N/A'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">Start Date</dt>
                          <dd className="text-white mt-1 text-base">
                            {member.membership.startDate ? formatDate(member.membership.startDate) : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">End Date</dt>
                          <dd className="text-white mt-1 text-base">
                            {member.membership.endDate ? formatDate(member.membership.endDate) : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">Price</dt>
                          <dd className="text-white mt-1 text-base">
                            {assignedPlanPrice != null ? `₹${assignedPlanPrice}` : 'Not set'}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-gray-400 uppercase tracking-wide">Duration</dt>
                          <dd className="text-white mt-1 text-base">
                            {assignedPlanDuration ? `${assignedPlanDuration} month(s)` : 'Not set'}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  ) : (
                    <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-6 text-center">
                      <svg className="w-10 h-10 text-gray-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m9 3a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h5l2-2h5a2 2 0 012 2v12z" />
                      </svg>
                      <p className="text-gray-300 font-medium">No plan assigned yet</p>
                      <p className="text-gray-500 text-sm mt-1">Use the assignment panel to stage a plan for this member.</p>
                    </div>
                  )}
                </div>

                <div className="w-full lg:w-80">
                  <div className="h-full rounded-xl border border-gray-700 bg-gray-900/90 p-5 shadow-lg">
                    <h4 className="text-md font-semibold text-white mb-4 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7l9-4 9 4-9 4-9-4zm0 6l9 4 9-4" />
                      </svg>
                      Branch Snapshot
                    </h4>
                    <div className="space-y-4 text-sm">
                      <div className="flex items-start justify-between">
                        <div className="text-gray-400">Member Branch</div>
                        <div className="text-white font-medium">{member.branch ? member.branch.toUpperCase() : 'N/A'}</div>
                      </div>
                      <div className="flex items-start justify-between">
                        <div className="text-gray-400">Plans Available</div>
                        <div className="text-white font-medium">{branchPlans.length}</div>
                      </div>
                      <div className="rounded-lg border border-gray-700 bg-gray-800/70 p-3 text-xs text-gray-400 space-y-2">
                        <div className="flex items-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary mr-2 text-xs font-semibold">i</span>
                          Plans list adapts automatically to the member’s branch.
                        </div>
                        <div className="flex items-center">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/20 text-green-300 mr-2 text-xs font-semibold">✓</span>
                          Highlights surface once you pick a plan.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-2 bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 1.343-3 3v5h6v-5c0-1.657-1.343-3-3-3zm0 0V5m0 13h.01M5 13a7 7 0 0114 0v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5z" />
                  </svg>
                  Assign Membership Plan
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                  Assign the right membership plan and choose when it begins; the end date is calculated automatically.
                </p>

                <form className="space-y-5" onSubmit={handleAssignMembership}>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Select Plan</label>
                    <select
                      value={planForm.planId}
                      onChange={(event) => setPlanForm((prev) => ({ ...prev, planId: event.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="">Choose a plan for {member.branch ? member.branch.toUpperCase() : 'this branch'}</option>
                      {branchPlans.map((plan) => {
                        const optionId = plan._id || plan.id;
                        const cachedDetail = planDetailsCache[optionId];
                        const optionDuration = plan.duration ?? plan.durationMonths ?? cachedDetail?.duration ?? cachedDetail?.durationMonths;
                        const optionPrice = plan.price ?? cachedDetail?.price;
                        return (
                          <option key={optionId} value={optionId}>
                            {plan.name} • {optionPrice != null ? `₹${optionPrice}` : '₹—'} • {optionDuration != null ? `${optionDuration} month(s)` : 'Duration unknown'}
                          </option>
                        );
                      })}
                    </select>
                    {branchPlans.length === 0 && (
                      <p className="text-xs text-red-300 mt-2">No plans are listed for this branch yet.</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Start Date *</label>
                    <input
                      type="date"
                      value={planForm.startDate}
                      onChange={(event) => setPlanForm((prev) => ({ ...prev, startDate: event.target.value }))}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                    {autoEndDate && (
                      <p className="text-xs text-gray-500 mt-1">Suggested end date: {autoEndDate}.</p>
                    )}
                  </div>

                  {selectedPlanDetail && (
                    <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-white mb-2">Plan Highlights</h4>
                      <div className="text-sm text-gray-300 space-y-1">
                        <p>Duration: {selectedPlanDurationValue != null ? `${selectedPlanDurationValue} month(s)` : 'Duration unknown'}</p>
                        <p>Price: {selectedPlanDetail.price != null ? `₹${selectedPlanDetail.price}` : 'Price unavailable'}</p>
                        <p>Branch: {!selectedPlanDetail.branch
                          ? 'Not specified'
                          : selectedPlanDetail.branch === 'all'
                            ? 'All branches'
                            : selectedPlanDetail.branch.toUpperCase()}</p>
                        {selectedPlanDetail.perks && selectedPlanDetail.perks.length > 0 && (
                          <ul className="list-disc list-inside text-xs text-gray-400 pt-1">
                            {selectedPlanDetail.perks.map((perk) => (
                              <li key={perk}>{perk}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={resetMembershipForm}
                      className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors duration-200"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={assigningPlan}
                      className={`px-4 py-2 font-medium rounded-lg transition-colors duration-200 ${assigningPlan ? 'bg-yellow-200 text-gray-500 cursor-not-allowed' : 'bg-primary bg-yellow-300 text-gray-900'}`}
                    >
                      {assigningPlan ? 'Assigning...' : 'Assign Plan'}
                    </button>
                  </div>
                </form>
              </div>

              <div className="space-y-6">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 17l-4 4m0 0l-4-4m4 4V3" />
                    </svg>
                    Available Plans Preview
                  </h3>
                  <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
                    {branchPlans.length > 0 ? (
                      branchPlans.map((plan) => {
                        const previewPlanId = plan._id || plan.id;
                        const cachedDetail = planDetailsCache[previewPlanId];
                        const previewDuration = plan.duration ?? plan.durationMonths ?? cachedDetail?.duration ?? cachedDetail?.durationMonths;
                        const previewPrice = plan.price ?? cachedDetail?.price;
                        const previewPerks = (Array.isArray(plan.perks) && plan.perks.length > 0)
                          ? plan.perks
                          : (Array.isArray(cachedDetail?.perks) ? cachedDetail.perks : []);
                        return (
                          <div key={previewPlanId} className={`border rounded-lg p-4 ${previewPlanId === planForm.planId ? 'border-primary bg-gray-800 bg-opacity-50' : 'border-gray-700 bg-gray-800'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="text-white font-semibold">{plan.name}</p>
                                <p className="text-xs text-gray-500 uppercase mt-1">Duration: {previewDuration != null ? `${previewDuration} month(s)` : 'Duration unknown'}</p>
                              </div>
                              <span className="text-primary font-semibold">{previewPrice != null ? `₹${previewPrice}` : '₹—'}</span>
                            </div>
                            {previewPerks.length > 0 && (
                              <ul className="list-disc list-inside text-xs text-gray-400 mt-3 space-y-1">
                                {previewPerks.map((perk) => (
                                  <li key={perk}>{perk}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      <div className="bg-gray-800 border border-dashed border-gray-600 rounded-lg p-5 text-center text-sm text-gray-400">
                        No plans are available for preview right now.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* Background overlay */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-75 transition-opacity"
              onClick={() => setShowEditModal(false)}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full border border-gray-700">
              <div className="bg-gray-900 px-6 py-4 border-b border-gray-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">Edit Member Information</h3>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={editFormData.fullName}
                      onChange={(e) => setEditFormData({ ...editFormData, fullName: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Gender
                    </label>
                    <select
                      value={editFormData.gender}
                      onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={editFormData.email}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      value={editFormData.phone}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Height (ft)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={editFormData.height}
                      onChange={(e) => setEditFormData({ ...editFormData, height: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={editFormData.weight}
                      onChange={(e) => setEditFormData({ ...editFormData, weight: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      value={editFormData.dob}
                      onChange={(e) => setEditFormData({ ...editFormData, dob: e.target.value })}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Address
                  </label>
                  <textarea
                    value={editFormData.address}
                    onChange={(e) => setEditFormData({ ...editFormData, address: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowEditModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary bg-yellow-300 text-gray-900 font-medium rounded-lg transition-colors duration-200"
                  >
                    Update Member
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDetails;