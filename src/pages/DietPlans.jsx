import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const defaultDietPlans = [
  // ...sample data from your request...
];


const DietPlans = () => {
  const [dietPlans, setDietPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [purposeFilter, setPurposeFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('dietPlans');
    if (stored) {
      setDietPlans(JSON.parse(stored));
    } else {
      setDietPlans(defaultDietPlans);
      localStorage.setItem('dietPlans', JSON.stringify(defaultDietPlans));
    }
  }, []);

  // Filter plans
  const filteredPlans = dietPlans.filter(plan =>
    (purposeFilter === 'All' || plan.purpose === purposeFilter)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Diet Plans</h1>
      <div className="flex space-x-4 mb-6">
        <div>
          <label className="mr-2">Purpose:</label>
          <select value={purposeFilter} onChange={e => setPurposeFilter(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded">
            <option>All</option>
            <option>Weight Loss</option>
            <option>Weight Gain</option>
            <option>Maintain</option>
            <option>General Health</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Category:</label>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded">
            <option>All</option>
            <option>Vegetarian</option>
            <option>Eggatarian</option>
            <option>Non-Vegetarian</option>
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
        {filteredPlans.map((plan, idx) => (
          <div key={idx}>
            {plan.categories
              .filter(cat => categoryFilter === 'All' || cat.category === categoryFilter)
              .map((cat, cidx) => (
                <button
                  key={cidx}
                  className="w-full text-left bg-gray-800 text-lg font-semibold px-6 py-4 rounded-lg flex justify-between items-center hover:bg-gray-700 transition-all duration-200"
                  onClick={() => setSelectedPlan({ ...plan, ...cat })}
                >
                  <span>{plan.purpose}: {cat.category}</span>
                  <span className="text-amber-300 text-2xl">&gt;</span>
                </button>
              ))}
          </div>
        ))}
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
            <h2 className="text-2xl font-bold mb-2">{selectedPlan.purpose}</h2>
            <div className="mb-2 text-gray-300">Category: {selectedPlan.category}</div>
            <div className="mb-4 text-gray-300">Timing:</div>
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
