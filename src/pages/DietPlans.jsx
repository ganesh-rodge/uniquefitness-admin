import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { deleteDietPlan } from '../api';

const PURPOSE_OPTIONS = ['gain', 'loose', 'maintain'];
const CATEGORY_OPTIONS = ['eggetarian', 'vegetarian', 'non-vegetarian'];

const formatLabel = (value) => value.replace(/-/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());

const DietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const navigate = useNavigate();
  const BASE_URL = 'https://uniquefitness.onrender.com/api/v1/dietplan';

  const fetchDietPlans = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get(BASE_URL, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.success && Array.isArray(res.data.message)) {
        setDietPlans(res.data.message);
      } else {
        setDietPlans([]);
      }
    } catch (err) {
      setDietPlans([]);
    }
  };
  useEffect(() => {
    fetchDietPlans();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this diet plan?')) return;
    try {
      const res = await deleteDietPlan(id);
      if (res.data && res.data.success) {
        fetchDietPlans();
      } else {
        alert(res.data?.data || 'Failed to delete');
      }
    } catch (err) {
      alert('Failed to delete');
    }
  };

  // Filter plans
  const filteredPlans = dietPlans.filter(plan =>
    (purposeFilter === 'all' || plan.purpose === purposeFilter) &&
    (categoryFilter === 'all' || plan.category === categoryFilter)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Diet Plans</h1>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
        <div className="flex items-center gap-2">
          <label className="mr-2">Purpose:</label>
          <select value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)} className="bg-gray-800 text-white px-4 py-3 sm:py-2 rounded border border-gray-600">
            <option value="all">All</option>
            {PURPOSE_OPTIONS.map(option => (
              <option key={option} value={option}>{formatLabel(option)}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="mr-2">Category:</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-gray-800 text-white px-4 py-3 sm:py-2 rounded border border-gray-600">
            <option value="all">All</option>
            {CATEGORY_OPTIONS.map(option => (
              <option key={option} value={option}>{formatLabel(option)}</option>
            ))}
          </select>
        </div>
      </div>
      <button
        className="mb-6 px-6 py-3 bg-amber-300 text-gray-900 font-semibold rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200"
        onClick={() => navigate('/create-diet-plan')}
      >
        + Create New
      </button>
      <div className="space-y-4">
        {filteredPlans.map((plan) => {
          const firstItem = Array.isArray(plan.plan) && plan.plan.length > 0 ? plan.plan[0] : null;
          return (
            <div key={plan._id} className="relative">
              <button
                className="w-full text-left bg-gray-800 text-lg font-semibold px-6 py-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-all duration-200"
                onClick={() => setSelectedPlan(plan)}
                disabled={!firstItem}
              >
                <span>{firstItem ? `${firstItem.time}: ${firstItem.items}` : 'No plan details'}</span>
                <span className="text-amber-300 text-2xl">&gt;</span>
              </button>
              <button
                className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                title="Delete"
                onClick={() => handleDelete(plan._id)}
              >Delete</button>
            </div>
          );
        })}
      </div>
      {/* Modal Popup */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl p-8 max-w-lg w-full relative overflow-y-auto max-h-[80vh]">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
              onClick={() => setSelectedPlan(null)}
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-2">{formatLabel(selectedPlan.purpose)}</h2>
            <div className="mb-2 text-gray-300">Category: {formatLabel(selectedPlan.category)} Timing:</div>
            <div>
              <span className="font-bold text-amber-300">Plan:</span>
              <ul className="list-disc ml-6 mt-2">
                {selectedPlan.plan.map((item, iidx) => (
                  <li key={iidx} className="mb-4">
                    <span className="font-semibold">{item.time}:</span> {item.items}
                    <div className="ml-4 mt-2">
                      <span className="font-bold text-amber-300">Nutrition:</span>
                      <div className="grid grid-cols-2 gap-2 mt-1 bg-gray-800 rounded-lg p-2">
                        <div className="text-gray-300">Calories</div>
                        <div className="text-gray-100">{item.nutrition.calories} kcal</div>
                        <div className="text-gray-300">Protein</div>
                        <div className="text-gray-100">{item.nutrition.protein}</div>
                        <div className="text-gray-300">Carbs</div>
                        <div className="text-gray-100">{item.nutrition.carbs}</div>
                        <div className="text-gray-300">Fat</div>
                        <div className="text-gray-100">{item.nutrition.fat}</div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DietPlans;
