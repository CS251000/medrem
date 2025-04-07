"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useAuth,
  UserButton,
} from "@clerk/nextjs";
import { dayAbbreviations, navigation, days, timePeriod, healthLoveSlogans } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const todayIndex = new Date().getDay();
const randomSlogan = healthLoveSlogans[Math.floor(Math.random() * healthLoveSlogans.length)];
const getTimeOfDayIndex = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) return 0;
  if (hours >= 12 && hours < 16) return 1;
  if (hours >= 16 && hours < 20) return 2;
  return 3;
};

export default function PillBox() {
  const { userId } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(days[todayIndex].toLowerCase());
  const [currentTimeIndex, setCurrentTimeIndex] = useState(getTimeOfDayIndex());
  const selectedTabRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedTabRef.current) {
      selectedTabRef.current.scrollIntoView({ behavior: "smooth", inline: "center" });
    }
  }, [selectedDay]);

  useEffect(() => {
    setCurrentTimeIndex(getTimeOfDayIndex());
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!userId) return;
    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(prescriptionsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        let allMedicines = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.medicines) {
            allMedicines.push(...data.medicines.map((med) => ({
              ...med,
              prescriptionId: doc.id, // track which document it belongs to
            })));
          }
        });

        setMedicines(allMedicines);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [userId]);

  const handleMedicineTaken = async (medicine, day, time) => {
    if (!medicine.prescriptionId || !medicine.medicineName) return;
  
    try {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, "0");
      const dd = String(today.getDate()).padStart(2, "0");
      const dateKey = `${yyyy}-${mm}-${dd}`;
  
      const isCurrentlyTaken =
        medicine.medicineSchedule?.[dateKey]?.[time]?.isTaken || false;
  
      const updatedMedicines = medicines.map((m) => {
        if (
          m.medicineName === medicine.medicineName &&
          m.prescriptionId === medicine.prescriptionId
        ) {
          const newMed = JSON.parse(JSON.stringify(m));
          if (!newMed.medicineSchedule) newMed.medicineSchedule = {};
          if (!newMed.medicineSchedule[dateKey]) newMed.medicineSchedule[dateKey] = {};
          newMed.medicineSchedule[dateKey][time] = {
            isTaken: !isCurrentlyTaken,
          };
  
          // Update takenCount locally
          if (!newMed.takenCount) newMed.takenCount = 0;
          newMed.takenCount += isCurrentlyTaken ? -1 : 1;
  
          return newMed;
        }
        return m;
      });
  
      const prescriptionRef = doc(db, "prescriptions", medicine.prescriptionId);
      const prescriptionSnap = await getDocs(
        query(
          collection(db, "prescriptions"),
          where("__name__", "==", medicine.prescriptionId)
        )
      );
  
      if (!prescriptionSnap.empty) {
        const prescriptionData = prescriptionSnap.docs[0].data();
        const updatedMedList = prescriptionData.medicines.map((m) => {
          if (m.medicineName === medicine.medicineName) {
            const medCopy = JSON.parse(JSON.stringify(m));
            if (!medCopy.medicineSchedule) medCopy.medicineSchedule = {};
            if (!medCopy.medicineSchedule[dateKey]) medCopy.medicineSchedule[dateKey] = {};
            medCopy.medicineSchedule[dateKey][time] = {
              isTaken: !isCurrentlyTaken,
            };
  
            // Update takenCount in Firestore
            if (!medCopy.takenCount) medCopy.takenCount = 0;
            medCopy.takenCount += isCurrentlyTaken ? -1 : 1;
  
            return medCopy;
          }
          return m;
        });
  
        await updateDoc(prescriptionRef, {
          medicines: updatedMedList,
        });
  
        setMedicines(updatedMedicines);
      }
    } catch (error) {
      console.error("Error toggling medicine status:", error);
    }
  };
  
  

  if (loading) {
    return <p className="text-center mt-20 text-lg">Loading medicines...</p>;
  }

  return (
    <div className="flex flex-col pt-40 px-4 sm:px-8">
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
      <div className="flex flex-col items-center justify-center text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-16 text-gray-700">
          Your Personalised Pillbox
        </h2>
        <Tabs defaultValue={selectedDay} className="w-full mx-auto px-5 mb-16 rounded-lg ">
          <div className="w-full overflow-x-auto scrollbar-hide">
            <TabsList className="flex space-x-4 min-w-max border border-slate-300 p-6">
              {days.map((day) => (
                <TabsTrigger
                  key={day.toLowerCase()}
                  value={day.toLowerCase()}
                  className="text-sm sm:text-base px-4 py-2 w-full snap-start"
                  ref={selectedDay === day.toLowerCase() ? selectedTabRef : null}
                >
                  {day}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {days.map((day) => (
            <TabsContent
              key={day.toLowerCase()}
              value={day.toLowerCase()}
              className="flex flex-col justify-center items-center bg-slate-200 mt-16 rounded-xl w-fit mx-auto"
            >
              <Card className="m-2 w-80 lg:w-full max-w-md ">
                <CardHeader>
                  <CardTitle>{day}'s Medicine Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  <Carousel
                    className="mt-4 w-full bg-blue-100 rounded-lg pt-2 pb-2"
                    opts={{ loop: true, startIndex: currentTimeIndex, watchDrag: false }}
                  >
                    <CarouselContent>
                      {timePeriod.map((time, index) => (
                        <CarouselItem key={index} className="text-center mx-10">
                          <h2 className="bg-blue-400 rounded-2xl w-36 mx-auto ">
                            {time}
                          </h2>
                          <Table className="overflow-x-scroll text-center table-auto w-full">
                            <TableCaption>{randomSlogan}</TableCaption>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Taken</TableHead>
                                <TableHead>Medicine</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Instruction</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {medicines
                                .filter(
                                  (medicine) =>
                                    medicine.days.includes(dayAbbreviations[day]) &&
                                    medicine.timeOfDay.includes(time)
                                )
                                .map((medicine, index) => {
                                  const isCurrentTime =
                                    day === days[todayIndex] &&
                                    time === timePeriod[getTimeOfDayIndex()];
                                    const today = new Date();
                                    const yyyy = today.getFullYear();
                                    const mm = String(today.getMonth() + 1).padStart(2, "0");
                                    const dd = String(today.getDate()).padStart(2, "0");
                                    const dateKey = `${yyyy}-${mm}-${dd}`;
                                    const isTaken = medicine.medicineSchedule?.[dateKey]?.[time]?.isTaken || false;
                                    

                                  return (
                                    <TableRow
                                      key={index}
                                      className={`text-center ${
                                        isTaken
                                          ? "bg-blue-500"
                                          : index % 2 === 0
                                          ? "bg-blue-200"
                                          : "bg-blue-300"
                                      }`}
                                    >
                                      <TableCell>
                                        <input
                                          type="checkbox"
                                          disabled={!isCurrentTime}
                                          checked={isTaken}
                                          onChange={() => handleMedicineTaken(medicine, day, time)}
                                          className="w-5 h-5 accent-blue-600"
                                        />
                                      </TableCell>
                                      <TableCell>{medicine.medicineName}</TableCell>
                                      <TableCell>{medicine.dosage}</TableCell>
                                      <TableCell>{medicine.instructions}</TableCell>
                                    </TableRow>
                                  );
                                })}
                            </TableBody>
                          </Table>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
