import { useState, useEffect } from 'react';

const Plans = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    status: 'active'
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      setPlans([
        {
          _id: "plan1",
          name: "Premium Plan",
          price: 1300,
          duration: 3,
          status: "active",
          createdAt: "2024-01-15T10:30:00Z",
          updatedAt: "2024-01-15T10:30:00Z",
          membersCount: 15
        },
        {
          _id: "plan2",
          name: "Basic Plan",
          price: 800,
          duration: 1,
          status: "active",
          createdAt: "2024-01-10T08:15:00Z",
          updatedAt: "2024-01-10T08:15:00Z",
          membersCount: 25
        },
        {
          _id: "plan3",
          name: "Gold Plan",
          price: 2500,
          duration: 6,
          status: "active",
          createdAt: "2024-01-05T14:45:00Z",
          updatedAt: "2024-01-05T14:45:00Z",
          membersCount: 8
        },
        {
          _id: "plan4",
          name: "Student Plan",
          price: 600,
          duration: 1,
          status: "inactive",
          createdAt: "2024-01-01T12:00:00Z",
          updatedAt: "2024-01-01T12:00:00Z",
          membersCount: 12
        }
      ]);
    } catch (error) {
      console.error('Failed to fetch plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.duration) {
      alert('Please fill in all required fields');
      return;
    }

    if (formData.price <= 0) {
      alert('Price must be greater than 0');
      return;
    }

    if (formData.duration <= 0) {
      alert('Duration must be greater than 0');
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const newPlan = {
        _id: Date.now().toString(),
        name: formData.name,
        price: parseInt(formData.price),
        duration: parseInt(formData.duration),
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        membersCount: 0
      };

      if (editingPlan) {
        // Update existing plan
        setPlans(plans.map(plan => 
          plan._id === editingPlan._id 
            ? { ...newPlan, _id: editingPlan._id, createdAt: editingPlan.createdAt, membersCount: editingPlan.membersCount }
            : plan
        ));
      } else {
        // Add new plan
        setPlans([newPlan, ...plans]);
      }

      // Reset form
      setFormData({ name: '', price: '', duration: '', status: 'active' });
      setShowForm(false);
      setEditingPlan(null);
    } catch (error) {
      console.error('Failed to save plan:', error);
      alert('Failed to save plan');
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration: plan.duration.toString(),
      status: plan.status
    });
    setShowForm(true);
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setPlans(plans.filter(plan => plan._id !== planId));
    } catch (error) {
      console.error('Failed to delete plan:', error);
      alert('Failed to delete plan');
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPlan(null);
    setFormData({ name: '', price: '', duration: '', status: 'active' });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status) => {
    return status === 'active' 
      ? 'bg-green-900 text-green-300 border-green-700'
      : 'bg-red-900 text-red-300 border-red-700';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-400">Loading plans...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Membership Plans</h1>
          <p className="text-gray-400 mt-2">Manage gym membership plans and pricing</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            onClick={() => setShowForm(true)}
            className="bg-primary hover:bg-yellow-300 text-gray-900 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Plan
          </button>
        </div>
      </div>

      {/* Plan Form */}
      {showForm && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-6 mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">
              {editingPlan ? 'Edit Plan' : 'Create New Plan'}
            </h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Plan Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter plan name"
                required
              />
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">
                Price (₹) *
              </label>
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter price"
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-300 mb-2">
                Duration (months) *
              </label>
              <input
                type="number"
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                placeholder="Enter duration in months"
                min="1"
                required
              />
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-300 mb-2">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 font-medium rounded-lg transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary hover:bg-yellow-300 text-gray-900 font-medium rounded-lg transition-colors duration-200"
              >
                {editingPlan ? 'Update' : 'Create'} Plan
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <svg className="w-16 h-16 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-400">No plans yet</h3>
            <p className="text-gray-500">Create your first membership plan to get started</p>
          </div>
        ) : (
          plans.map((plan) => (
            <div
              key={plan._id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-primary transition-all duration-200 transform hover:scale-105 animate-fade-in"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border
                      ${getStatusBadge(plan.status)}
                    `}>
                      <div className={`
                        w-2 h-2 rounded-full mr-2
                        ${plan.status === 'active' ? 'bg-green-400' : 'bg-red-400'}
                      `}></div>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-gray-400 hover:text-primary transition-colors duration-200"
                    title="Edit plan"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(plan._id)}
                    className="p-2 text-gray-400 hover:text-red-400 transition-colors duration-200"
                    title="Delete plan"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Price */}
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary mb-1">
                  ₹{plan.price}
                  <span className="text-lg text-gray-400 font-normal">
                    /{plan.duration} month{plan.duration > 1 ? 's' : ''}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  ₹{Math.round(plan.price / plan.duration)} per month
                </p>
              </div>

              {/* Members Count */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-800 rounded-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span className="text-gray-300">Active Members</span>
                </div>
                <span className="text-white font-bold">{plan.membersCount}</span>
              </div>

              {/* Date */}
              <div className="text-xs text-gray-400">
                Created: {formatDate(plan.createdAt)}
                {plan.updatedAt !== plan.createdAt && (
                  <span className="block mt-1">
                    Updated: {formatDate(plan.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Plans;