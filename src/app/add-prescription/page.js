"use client";

import { useState } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { navigation, timePeriod } from "@/lib/constants";
import { addDays, format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export default function AddPrescription() {
  const { userId } = useAuth();
  const { user, isSignedIn } = useUser();
  const router = useRouter();

  const [medicines, setMedicines] = useState([]);
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("");
  const [timeOfDayArr, setTimeOfDayArr] = useState([]);
  const [days, setDays] = useState([]);
  const [duration, setDuration] = useState("");
  const [total,setTotal]= useState(1)
  const [taken,setTaken]= useState(0);
  // const [startDate, setStartDate] = useState("");
  // const [endDate, setEndDate] = useState("");   
  const [start_end_date,setStartEndDate]=useState({
    from: new Date(),
    to: addDays(new Date(),10),
  }) ;
  const [instructions, setInstructions] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [doctorContact, setDoctorContact] = useState("");
  const [loading, setLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleDay = (day) => {
    setDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };

  const toggleTimeOfDay = (time) => {
    setTimeOfDayArr((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  if (!userId || !isSignedIn) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-xl font-semibold">
          Please sign in to add prescriptions.
        </p>
        <div className="bg-blue-400"><SignInButton/></div>
      </div>
    );
  }

  const addMedicine = () => {
    if (
      !medicineName ||
      !dosage ||
      !frequency ||
      timeOfDayArr.length === 0 ||
      !duration ||
      days.length === 0 ||
      !instructions
    ) {
      alert("Please fill all the required fields for medicine.");
      return;
    }

    const calculatedTotal = Number(duration) * Number(frequency);
    setMedicines([
      ...medicines,
      {
        medicineName,
        dosage,
        frequency,
        timeOfDay: timeOfDayArr,
        duration,
        taken,
        total: calculatedTotal,
        days,
        instructions,
      },
    ]);

    // Reset fields (excluding startDate and endDate)
    setMedicineName("");
    setDosage("");
    setFrequency("");
    setTimeOfDayArr([]);
    setDuration("");
    setDays([]);
    setInstructions("");
    setTaken(0);
    setTotal(1);
  };

  const removeMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const editMedicine = (index) => {
    const med = medicines[index];
    setMedicineName(med.medicineName);
    setDosage(med.dosage);
    setFrequency(med.frequency);
    setTimeOfDayArr(med.timeOfDay);
    setDuration(med.duration);
    setDays(med.days);
    setInstructions(med.instructions);
    removeMedicine(index);
    setTotal((Number(duration))*Number(frequency))
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
        startDate : start_end_date.from,    
        endDate : start_end_date.to,
        createdAt: serverTimestamp(),
      });

      setMedicines([]);
      setDoctorName("");
      setDoctorContact("");
      setStartEndDate({});     // Reset these fields
      alert("Prescription added successfully!");
      router.push(`/pillbox`);
    } catch (error) {
      console.error("Error adding prescription:", error);
      alert("Error adding prescription.");
    } finally {
      setLoading(false);
    }
  };
  

 

  return (
    <div className="pt-40">
      <header className="absolute inset-x-0 top-0 z-50">
            <nav
              aria-label="Global"
              className="flex items-center justify-between p-6 lg:px-8"
            >
              {/* desktop view */}
              <div className="flex lg:flex-1">
                <Link href="/" className="-m-2 p-3">
                  <span className="sr-only">MedRem</span>
                  <Image
                    alt="logo"
                    src="/assets/images/logo.png"
                    height={100}
                    width={100}
                    className="rounded-xl"
                  />
                </Link>
              </div>
              {/* mobile view */}
              <div className="flex lg:hidden">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(true)}
                  className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                >
                  <span className="sr-only">Open main menu</span>
                  <Bars3Icon aria-hidden="true" className="size-6" />
                </button>
              </div>
              {/* desktop */}
              <div className="hidden lg:flex lg:gap-x-12">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-lg font-semibold text-gray-900"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-10">
                <div className="text-md font-semibold text-gray-900">
                  <SignedIn>
                    <UserButton />
                  </SignedIn>
                  <SignedOut>
                    <SignInButton />
                  </SignedOut>
                </div>
              </div>
            </nav>
            <Dialog
              open={mobileMenuOpen}
              onClose={setMobileMenuOpen}
              className="lg:hidden"
            >
              <div className="fixed inset-0 z-50" />
              <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                <div className="flex items-center justify-between">
                  <Link href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">Your Company</span>
                    <Image
                      alt=""
                      src="/assets/images/logo.png"
                      height={100}
                      width={100}
                      className="rounded-xl"
                    />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon aria-hidden="true" className="size-6" />
                  </button>
                </div>
                <div className="mt-6 flow-root">
                  <div className="-my-6 divide-y divide-gray-500/10">
                    <div className="space-y-2 py-6">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                    <div className="py-6">
                      <div className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
                        <SignedIn>
                          <UserButton />
                        </SignedIn>
                        <SignedOut>
                          <SignInButton />
                        </SignedOut>
                      </div>
                    </div>
                  </div>
                </div>
              </Dialog.Panel>
            </Dialog>
          </header>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
          >
            <div
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
              className="relative left-[calc(50%-11rem)] w-[36.125rem] h-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#b2dbff] to-[#4a89e6] opacity-90"
            />
          </div>
      
      <div className="flex flex-col md:flex-row items-start pt-10 px-4 md:px-0">
        <div className="flex-1">
          <div className="max-w-lg mx-auto p-6 shadow-lg rounded-lg border border-gray-200">
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
              {/* <input
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
              /> */}
              <p className="pt-5">Select Prescription Duration</p>
               <div className="grid gap-2 pb-5">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="start_end_date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !start_end_date && "text-muted-foreground"
            )}
          >
            <CalendarIcon />
            {start_end_date?.from ? (
              start_end_date.to ? (
                <>
                  {format(start_end_date.from, "LLL dd, y")} -{" "}
                  {format(start_end_date.to, "LLL dd, y")}
                </>
              ) : (
                format(start_end_date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={start_end_date?.from}
            selected={start_end_date}
            onSelect={setStartEndDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
              {/* Medicine-specific fields */}
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
                {timePeriod.map((day) => (
                  <label key={day} className="inline-flex items-center mr-2">
                    <input
                      type="checkbox"
                      checked={timeOfDayArr.includes(day)}
                      onChange={() => toggleTimeOfDay(day)}
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
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => (
                    <label key={day} className="inline-flex items-center mr-2">
                      <input
                        type="checkbox"
                        checked={days.includes(day)}
                        onChange={() => toggleDay(day)}
                        className="mr-1"
                      />
                      {day}
                    </label>
                  )
                )}
              </div>
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
        </div>
        {/* Medicine Stack Display remains unchanged */}
        <div className="w-full md:w-64 mt-6 md:mt-10 mx-auto">
          <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold mb-2">Added Medicines</h3>
            <ul>
              {medicines.map((med, index) => (
                <li
                  key={index}
                  className="border-b py-1 flex justify-between items-center"
                >
                  <div>
                    <span className="font-bold">{med.medicineName}</span> (
                    {med.dosage})
                  </div>
                  <div>
                    <button
                      onClick={() => editMedicine(index)}
                      className="text-blue-500 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => removeMedicine(index)}
                      className="text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}