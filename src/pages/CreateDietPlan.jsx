import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createDietPlanAdmin } from '../api';

const PURPOSE_OPTIONS = ['gain', 'loose', 'maintain'];
const CATEGORY_OPTIONS = ['eggetarian', 'vegetarian', 'non-vegetarian'];

const CreateDietPlan = () => {

  const navigate = useNavigate();
  const [mode, setMode] = useState('single'); // single | multi | raw
  const [purpose, setPurpose] = useState('');
  const [category, setCategory] = useState('');
  const [planItems, setPlanItems] = useState([
    { time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } }
  ]);

  const [multiCategories, setMultiCategories] = useState([
    { category: '', plan: [{ time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } }] }
  ]);

  const [rawJson, setRawJson] = useState('[\n  {\n    "purpose": "gain",\n    "categories": [\n      {\n        "category": "vegetarian",\n        "plan": [\n          {\n            "time": "breakfast",\n            "items": "Oats + Apple + Raisins",\n            "nutrition": { "calories": 300, "protein": "6g", "carbs": "58g", "fat": "3g" }\n          }\n        ]\n      }\n    ]\n  }\n]');

  const addPlanItem = () => {
    setPlanItems([...planItems, { time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } }]);
  };

  const updatePlanItem = (idx, field, value) => {
    const next = [...planItems];
    if (field.startsWith('nutrition.')) {
      const key = field.split('.')[1];
      next[idx].nutrition[key] = value;
    } else {
      next[idx][field] = value;
    }
    setPlanItems(next);
  };

  const addCategory = () => {
    setMultiCategories([...multiCategories, { category: '', plan: [{ time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } }] }]);
  };

  const addCategoryPlanItem = (cIdx) => {
    const next = [...multiCategories];
    next[cIdx].plan.push({ time: '', items: '', nutrition: { calories: '', protein: '', carbs: '', fat: '' } });
    setMultiCategories(next);
  };

  const updateCategory = (cIdx, field, value) => {
    const next = [...multiCategories];
    next[cIdx][field] = value;
    setMultiCategories(next);
  };

  const updateCategoryPlanItem = (cIdx, pIdx, field, value) => {
    const next = [...multiCategories];
    if (field.startsWith('nutrition.')) {
      const key = field.split('.')[1];
      next[cIdx].plan[pIdx].nutrition[key] = value;
    } else {
      next[cIdx].plan[pIdx][field] = value;
    }
    setMultiCategories(next);
  };

  const buildPayload = () => {
    if (mode === 'single') {
      return {
        purpose,
        category,
        plan: planItems.map(i => ({
          time: i.time,
          items: i.items,
          nutrition: {
            calories: Number(i.nutrition.calories),
            protein: i.nutrition.protein,
            carbs: i.nutrition.carbs,
            fat: i.nutrition.fat,
          },
        }))
      };
    }
    if (mode === 'multi') {
      return {
        purpose,
        categories: multiCategories.map(c => ({
          category: c.category,
          plan: c.plan.map(i => ({
            time: i.time,
            items: i.items,
            nutrition: {
              calories: Number(i.nutrition.calories),
              protein: i.nutrition.protein,
              carbs: i.nutrition.carbs,
              fat: i.nutrition.fat,
            },
          }))
        }))
      };
    }
    // raw
    try {
      return JSON.parse(rawJson);
    } catch (e) {
      throw new Error('Invalid JSON');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      const res = await createDietPlanAdmin(payload);
      if (res.data && res.data.success) {
        toast.success(res.data.data || 'Diet plan created');
        navigate(-1);
      } else {
        toast.error(res.data?.data || 'Failed to create diet plan');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to create diet plan');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Create Diet Plan</h1>
      <div className="mb-4">
        <label className="mr-2">Mode:</label>
        <select value={mode} onChange={e => setMode(e.target.value)} className="bg-gray-800 text-white px-4 py-2 rounded">
          <option value="single">Single Plan</option>
          <option value="multi">Multi Category</option>
          <option value="raw">Raw JSON</option>
        </select>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {(mode === 'single' || mode === 'multi') && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm mb-2">Purpose</label>
              <select
                className="w-full px-4 py-2 bg-gray-800 rounded"
                value={purpose}
                onChange={e => setPurpose(e.target.value)}
                required
              >
                <option value="" disabled>Select purpose</option>
                {PURPOSE_OPTIONS.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
            {mode === 'single' && (
              <div>
                <label className="block text-sm mb-2">Category</label>
                <select
                  className="w-full px-4 py-2 bg-gray-800 rounded"
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {mode === 'single' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Plan Items</h2>
              <button type="button" onClick={addPlanItem} className="px-3 py-1 bg-amber-300 text-gray-900 rounded">+ Add Item</button>
            </div>
            {planItems.map((item, idx) => (
              <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                <input className="px-3 py-2 bg-gray-800 rounded" placeholder="time" value={item.time} onChange={e => updatePlanItem(idx, 'time', e.target.value)} />
                <input className="px-3 py-2 bg-gray-800 rounded md:col-span-2" placeholder="items" value={item.items} onChange={e => updatePlanItem(idx, 'items', e.target.value)} />
                <input className="px-3 py-2 bg-gray-800 rounded" placeholder="calories" type="number" value={item.nutrition.calories} onChange={e => updatePlanItem(idx, 'nutrition.calories', e.target.value)} />
                <input className="px-3 py-2 bg-gray-800 rounded" placeholder="protein" value={item.nutrition.protein} onChange={e => updatePlanItem(idx, 'nutrition.protein', e.target.value)} />
                <input className="px-3 py-2 bg-gray-800 rounded" placeholder="carbs" value={item.nutrition.carbs} onChange={e => updatePlanItem(idx, 'nutrition.carbs', e.target.value)} />
                <input className="px-3 py-2 bg-gray-800 rounded" placeholder="fat" value={item.nutrition.fat} onChange={e => updatePlanItem(idx, 'nutrition.fat', e.target.value)} />
              </div>
            ))}
          </div>
        )}

        {mode === 'multi' && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold">Categories</h2>
              <button type="button" onClick={addCategory} className="px-3 py-1 bg-amber-300 text-gray-900 rounded">+ Add Category</button>
            </div>
            {multiCategories.map((cat, cIdx) => (
              <div key={cIdx} className="mb-4">
                <select
                  className="px-3 py-2 bg-gray-800 rounded mb-2"
                  value={cat.category}
                  onChange={e => updateCategory(cIdx, 'category', e.target.value)}
                  required
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORY_OPTIONS.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
                {cat.plan.map((item, pIdx) => (
                  <div key={pIdx} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                    <input className="px-3 py-2 bg-gray-800 rounded" placeholder="time" value={item.time} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'time', e.target.value)} />
                    <input className="px-3 py-2 bg-gray-800 rounded md:col-span-2" placeholder="items" value={item.items} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'items', e.target.value)} />
                    <input className="px-3 py-2 bg-gray-800 rounded" placeholder="calories" type="number" value={item.nutrition.calories} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'nutrition.calories', e.target.value)} />
                    <input className="px-3 py-2 bg-gray-800 rounded" placeholder="protein" value={item.nutrition.protein} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'nutrition.protein', e.target.value)} />
                    <input className="px-3 py-2 bg-gray-800 rounded" placeholder="carbs" value={item.nutrition.carbs} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'nutrition.carbs', e.target.value)} />
                    <input className="px-3 py-2 bg-gray-800 rounded" placeholder="fat" value={item.nutrition.fat} onChange={e => updateCategoryPlanItem(cIdx, pIdx, 'nutrition.fat', e.target.value)} />
                  </div>
                ))}
                <button type="button" onClick={() => addCategoryPlanItem(cIdx)} className="px-3 py-1 bg-amber-300 text-gray-900 rounded">+ Add Item</button>
              </div>
            ))}
          </div>
        )}

        {mode === 'raw' && (
          <div>
            <textarea className="w-full h-64 bg-gray-800 rounded p-3" value={rawJson} onChange={e => setRawJson(e.target.value)} />
          </div>
        )}

        <div className="mt-6">
          <button type="submit" className="px-6 py-3 bg-amber-300 text-gray-900 font-semibold rounded">Create</button>
          <button type="button" className="ml-3 px-6 py-3 bg-gray-700 text-white rounded" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateDietPlan;
