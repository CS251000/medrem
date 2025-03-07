'use client';

import { useEffect, useState } from 'react';
import { db } from "@/lib/firebase"; 
import { collection, getDocs, query, where} from "firebase/firestore";
import { useAuth, useUser } from '@clerk/nextjs';
import Prescription from './Prescription';

const PrescriptionsPage = () => {
  const {userId}= useAuth()
  const { user,isSignedIn,isLoaded } = useUser();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    const fetchPrescriptions = async () => {
      try {
        const q = query(collection(db, 'prescriptions'), where('userId', '==', user.id));
        const querySnapshot = await getDocs(q);
        const prescriptionsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPrescriptions(prescriptionsList);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [user]);

  if (loading) return <p>Loading...</p>;
  if (!userId || !isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">
          Please sign in to see saved prescriptions.
        </p>
        <div className="bg-blue-400"><SignInButton/></div>
      </div>
    );
  }

  return (
    <>
    <Prescription prescriptions={prescriptions}/>
    </>
  );
};

export default PrescriptionsPage;
