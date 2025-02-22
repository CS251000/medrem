"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase"; // Ensure Firebase is correctly configured
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function AddPrescription() {
  const { userId } = useAuth();
  const { user } = useUser();

  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [duration, setDuration] = useState("");
  const [days, setDays] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [loading, setLoading] = useState(false);

  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

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
    if (
      !medicineName ||
      !dosage ||
      !frequency ||
      !timeOfDay ||
      !duration ||
      days.length === 0 ||
      !startDate ||
      !endDate ||
      !instructions
    )
      return;

    setMedicines([
      ...medicines,
      {
        medicineName,
        dosage,
        frequency,
        timeOfDay,
        duration,
        days,
        startDate,
        endDate,
        instructions,
      },
    ]);
    setMedicineName("");
    setDosage("");
    setFrequency("");
    setTimeOfDay("morning");
    setDuration("");
    setDays([]);
    setStartDate("");
    setEndDate("");
    setInstructions("");
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
        doctorName,
        doctorContact,
        medicines,
        createdAt: serverTimestamp(),
      });

      setMedicines([]);
      setDoctorName("");
      setDoctorContact("");
      alert("Prescription added successfully!");
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error adding prescription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 mt-10 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">
        Create Your Prescription
      </h2>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="Doctor's Name"
          value={doctorName}
          onChange={(e) => setDoctorName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Doctor's Contact"
          value={doctorContact}
          onChange={(e) => setDoctorContact(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Medicine Name *"
          value={medicineName}
          onChange={(e) => setMedicineName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Dosage (e.g., 500mg) *"
          value={dosage}
          onChange={(e) => setDosage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Frequency (e.g., 2 times/day) *"
          value={frequency}
          onChange={(e) => setFrequency(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="w-full p-2 border rounded bg-gray-100">
          <p className="font-semibold mb-2">Time *</p>
          {["Morning", "Noon", "Night"].map((day) => (
            <label key={day} className="inline-flex items-center mr-2">
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
                className="mr-1"
              />
              {day}
            </label>
          ))}
        </div>
        <input
          type="text"
          placeholder="Duration (e.g., 10 days) *"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <div className="w-full p-2 border rounded bg-gray-100">
          <p className="font-semibold mb-2">Days *</p>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
            <label key={day} className="inline-flex items-center mr-2">
              <input
                type="checkbox"
                checked={days.includes(day)}
                onChange={() => toggleDay(day)}
                className="mr-1"
              />
              {day}
            </label>
          ))}
        </div>
        <input
          type="date"
          placeholder="Start Date *"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="date"
          placeholder="End Date *"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <textarea
          placeholder="Special Instructions"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="button"
          onClick={addMedicine}
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Add Medicine
        </button>
      </div>
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
