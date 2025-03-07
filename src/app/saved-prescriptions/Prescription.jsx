

import React from 'react'

export default function Prescription({prescriptions}) {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Prescriptions</h1>
      {prescriptions.length === 0 ? (
        <p>No prescriptions found.</p>
      ) : (
        <ul className="space-y-4">
          {prescriptions.map(prescription => (
            <li key={prescription.id} className="p-4 border rounded shadow">
              <h2 className="text-xl font-semibold">{prescription.prescriptionName}</h2>
              <p><strong>Doctor:</strong> {prescription.doctorName} ({prescription.doctorContact})</p>
              <p><strong>Start Date:</strong> {prescription.startDate}</p>
              <p><strong>End Date:</strong> {prescription.endDate}</p>
              <h3 className="mt-2 font-medium">Medicines:</h3>
              <ul className="list-disc ml-6">
                {prescription.medicines.map((medicine, index) => (
                  <li key={index}>
                    {medicine.medicineName} - {medicine.frequency} ({medicine.dosage})
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
