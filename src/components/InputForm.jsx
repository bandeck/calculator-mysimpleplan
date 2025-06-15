import { useState } from "react";

function InputForm({ onSubmit }) {
  const [form, setForm] = useState({
    gender: "male",
    age: "",
    height: "",
    weight: "",
    activity: "moderate",
    goal: "maintain",
    goalWeight: ""
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <div className="flex flex-col items-center">
      <a
        href="https://mysimpleplan.com"
        className="inline-block mb-6 px-4 py-2 rounded-lg bg-white border border-gray-200 shadow hover:bg-gray-50 text-black font-medium transition"
      >
        ← Back to Home
      </a>
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-auto space-y-6 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-4">Nutrition Calculator</h2>
        <div className="flex flex-col gap-4">
          {/* Gender */}
          <label className="flex flex-col">
            Gender
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          {/* Age */}
          <label className="flex flex-col">
            Age
            <input
              type="number"
              name="age"
              value={form.age}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            />
          </label>
          {/* Height */}
          <label className="flex flex-col">
            Height (inches)
            <input
              type="number"
              name="height"
              value={form.height}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            />
          </label>
          {/* Weight */}
          <label className="flex flex-col">
            Weight (lbs)
            <input
              type="number"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              required
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            />
          </label>
          {/* Activity Level */}
          <label className="flex flex-col">
            <span className="font-semibold">Physical Activity Level</span>
            <span className="text-xs text-gray-500 mb-2">
              Choose the option that best fits your weekly exercise <b>and your job</b>.
            </span>
            <select
              name="activity"
              value={form.activity}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition mb-2"
            >
              <option value="sedentary">
                Sedentary: Little or no exercise, desk job (mostly sitting)
              </option>
              <option value="light">
                Light: Light exercise 1–3 days/week, light activity at work (teacher, nurse, some walking)
              </option>
              <option value="moderate">
                Moderate: Moderate exercise 3–5 days/week, active job (server, retail, walking/standing much of the day)
              </option>
              <option value="active">
                Active: Hard exercise 6–7 days/week, manual labor job (landscaper, mover)
              </option>
              <option value="extra">
                Extra Active: Very hard exercise, very physical job or 2×/day training (athlete, construction, farming)
              </option>
            </select>
            <ul className="text-xs text-gray-500 space-y-1 mt-1 pl-4 list-disc">
              <li>
                <span className="font-semibold">Sedentary:</span> Little or no exercise, desk job (mostly sitting)
              </li>
              <li>
                <span className="font-semibold">Light:</span> Light exercise 1–3 days/week, light activity at work (teacher, nurse, some walking)
              </li>
              <li>
                <span className="font-semibold">Moderate:</span> Moderate exercise 3–5 days/week, active job (server, retail, walking/standing much of the day)
              </li>
              <li>
                <span className="font-semibold">Active:</span> Hard exercise 6–7 days/week, manual labor job (landscaper, mover)
              </li>
              <li>
                <span className="font-semibold">Extra Active:</span> Very hard exercise, very physical job or 2×/day training (athlete, construction, farming)
              </li>
            </ul>
          </label>
          {/* Goal */}
          <label className="flex flex-col col-span-2">
            Goal
            <select
              name="goal"
              value={form.goal}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            >
              <option value="cut">Fat Loss</option>
              <option value="maintain">Maintenance</option>
              <option value="bulk">Muscle Gain</option>
            </select>
          </label>
          {/* Goal Weight */}
          <label className="flex flex-col col-span-2">
            Goal Weight (lbs)
            <input
              type="number"
              name="goalWeight"
              value={form.goalWeight}
              onChange={handleChange}
              className="rounded-lg border border-gray-300 focus:border-black focus:ring-1 focus:ring-black p-2 transition"
            />
          </label>
        </div>

        <button
          type="submit"
          className="bg-black text-white font-bold py-3 px-4 rounded-xl hover:bg-gray-900 w-full transition-colors duration-150"
        >
          Calculate
        </button>
      </form>
    </div>
  );
}

export default InputForm;