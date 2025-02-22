"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddPrescription() {
  const { userId } = useAuth();
  const { user } = useUser();

  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeOfDay, setTimeOfDay] = useState("morning");

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">
          Please sign in to add prescriptions.
        </p>
      </div>
    );
  }

  const addMedicine = () => {
    if (!medicineName || !dosage || !frequency || !timeOfDay) return;

    setMedicines([
      ...medicines,
      { medicineName, dosage, frequency, timeOfDay },
    ]);
    setMedicineName("");
    setDosage("");
    setFrequency("");
    setTimeOfDay("morning");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (medicines.length === 0) {
      alert("Please add at least one medicine.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "prescriptions"), {
        userId,
        userName: user?.fullName,
        medicines,
        createdAt: serverTimestamp(),
      });

      setMedicines([]);
      alert("Prescription added successfully!");
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error adding prescription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Create Your Prescription
      </h2>

      {/* Add Medicine Form */}
      <div className="space-y-3">
        <input
          type="text"
          placeholder="Medicine Name"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dosage (e.g., 500mg)"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Frequency (e.g., 2 times/day)"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="morning">Morning</option>
          <option value="noon">Noon</option>
          <option value="night">Night</option>
        </select>
        <button
          type="button"
          onClick={addMedicine}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Medicine
        </button>
      </div>

      {/* Display Added Medicines */}
      {medicines.length > 0 && (
        <div className="mt-4 p-4 bg-gray-100 rounded-md">
          <h3 className="text-lg font-semibold mb-2">Prescription List:</h3>
          <ul className="space-y-2">
            {medicines.map((med, index) => (
              <li key={index} className="p-2 bg-white shadow rounded-md">
                <span className="font-semibold">{med.medicineName}</span> -{" "}
                {med.dosage}, {med.frequency}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Prescription */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full mt-4 p-2 text-white rounded ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Saving..." : "Save Prescription"}
      </button>
    </div>
  );
}
