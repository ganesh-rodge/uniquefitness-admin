import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const initialPlanItem = { time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } };

const CreateDietPlan = () => {
  const [purpose, setPurpose] = useState('Weight Loss');
  const [category, setCategory] = useState('Vegetarian');
  const [plan, setPlan] = useState([ { ...initialPlanItem } ]);
  const navigate = useNavigate();

  const handlePlanChange = (idx, field, value) => {
    const updatedPlan = plan.map((item, i) =>
      i === idx ? { ...item, [field]: value } : item
    );
    setPlan(updatedPlan);
  };

  const handleNutritionChange = (idx, nutField, value) => {
    const updatedPlan = plan.map((item, i) =>
      i === idx ? { ...item, nutrition: { ...item.nutrition, [nutField]: value } } : item
    );
    setPlan(updatedPlan);
  };

  const addPlanItem = () => {
    setPlan([...plan, { ...initialPlanItem }]);
  };

  const removePlanItem = (idx) => {
    setPlan(plan.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Save to localStorage
    const stored = localStorage.getItem('dietPlans');
    let dietPlans = stored ? JSON.parse(stored) : [];
    // Check if a plan with same purpose/category exists
    const idx = dietPlans.findIndex(p => p.purpose === purpose);
    if (idx !== -1) {
      // If category exists, add to categories, else add new category
      const catIdx = dietPlans[idx].categories.findIndex(c => c.category === category);
      if (catIdx !== -1) {
        dietPlans[idx].categories[catIdx].plan = [...dietPlans[idx].categories[catIdx].plan, ...plan];
      } else {
        dietPlans[idx].categories.push({ category, plan });
      }
    } else {
      dietPlans.push({ purpose, categories: [{ category, plan }] });
    }
    localStorage.setItem('dietPlans', JSON.stringify(dietPlans));
    alert('Diet plan created!');
    navigate('/diet-plans');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create Diet Plan</h1>
      <form onSubmit={handleSubmit} className="max-w-xl mx-auto bg-gray-800 rounded-xl p-8 shadow-lg space-y-6">
        <div>
          <label className="block text-lg font-semibold mb-2">Purpose</label>
            <select value={purpose} onChange={e => setPurpose(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none">
              <option>Weight Loss</option>
              <option>Weight Gain</option>
              <option>Maintain</option>
              <option>General Health</option>
            </select>
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Category</label>
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white focus:outline-none">
            <option>Vegetarian</option>
            <option>Eggatarian</option>
            <option>Non-Vegetarian</option>
          </select>
        </div>
        <div>
          <label className="block text-lg font-semibold mb-2">Plan Items</label>
          {plan.map((item, idx) => (
            <div key={idx} className="bg-gray-900 rounded-lg p-4 mb-4 shadow">
              <div className="flex space-x-4 mb-2">
                <input
                  type="text"
                  placeholder="Time (e.g. breakfast)"
                  value={item.time}
                  onChange={e => handlePlanChange(idx, 'time', e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Items (e.g. Oats)"
                  value={item.items}
                  onChange={e => handlePlanChange(idx, 'items', e.target.value)}
                  className="flex-1 px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-2">
                <input
                  type="number"
                  placeholder="Calories"
                  value={item.nutrition.calories}
                  onChange={e => handleNutritionChange(idx, 'calories', e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Protein (e.g. 5g)"
                  value={item.nutrition.protein}
                  onChange={e => handleNutritionChange(idx, 'protein', e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Carbs (e.g. 40g)"
                  value={item.nutrition.carbs}
                  onChange={e => handleNutritionChange(idx, 'carbs', e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
                <input
                  type="text"
                  placeholder="Fat (e.g. 2g)"
                  value={item.nutrition.fat}
                  onChange={e => handleNutritionChange(idx, 'fat', e.target.value)}
                  className="px-3 py-2 rounded bg-gray-800 text-white focus:outline-none"
                  required
                />
              </div>
              <div className="flex justify-end">
                {plan.length > 1 && (
                  <button type="button" onClick={() => removePlanItem(idx)} className="text-red-400 hover:text-red-600">Remove</button>
                )}
              </div>
            </div>
          ))}
          <button type="button" onClick={addPlanItem} className="mt-2 px-4 py-2 bg-amber-300 text-gray-900 rounded-lg font-semibold shadow hover:shadow-md transition-all">+ Add Item</button>
        </div>
        <div className="flex space-x-4 mt-6">
          <button type="submit" className="flex-1 py-3 px-4 bg-amber-300 text-gray-900 font-medium rounded-lg shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200">Create Plan</button>
          <button type="button" className="flex-1 py-3 px-4 bg-gray-700 text-white rounded-lg" onClick={() => navigate('/diet-plans')}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateDietPlan;
