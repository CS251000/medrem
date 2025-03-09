import React from 'react'

export default function Prescription({ prescriptions, handleDelete }) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">My Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map((prescription) => {
            
            const startDate =
              prescription.startDate && prescription.startDate.toDate
                ? prescription.startDate.toDate()
                : new Date(prescription.startDate);

            const endDate =
              prescription.endDate && prescription.endDate.toDate
                ? prescription.endDate.toDate()
                : new Date(prescription.endDate);

            return (
              <li key={prescription.id} className="p-4 border rounded shadow flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{prescription.prescriptionName}</h2>
                  <p>
                    <strong>Doctor:</strong> {prescription.doctorName} ({prescription.doctorContact})
                  </p>
                  <p><strong>Start Date:</strong> {startDate.toLocaleDateString()}</p>
                  <p><strong>End Date:</strong> {endDate.toLocaleDateString()}</p>
                  <h3 className="mt-2 font-medium">Medicines:</h3>
                  <ul className="list-disc ml-6">
                    {prescription.medicines.map((medicine, index) => (
                      <li key={index}>
                        {medicine.medicineName} - {medicine.frequency} ({medicine.dosage})
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => handleDelete(prescription.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
