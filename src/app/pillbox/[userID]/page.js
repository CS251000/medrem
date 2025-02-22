"use client";

import { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { navigation } from "@/lib/constants";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import { days } from "@/lib/constants";

const sampleMedicines = {
  "Mon-Morning": { name: "Paracetamol", time: "8:00 AM", dosage: "1 Tablet" },
  "Tue-Noon": { name: "Ibuprofen", time: "12:30 PM", dosage: "1 Tablet" },
};

const today = new Date().getDay();
const getTimeOfDayIndex = () => {
  const hours = new Date().getHours();
  if (hours >= 5 && hours < 12) return 0; // Morning
  if (hours >= 12 && hours < 17) return 1; // Afternoon
  if (hours >= 17 && hours < 21) return 2; // Evening
  return 3; // Night
};

export default function PillBox() {
  const [selectedCell, setSelectedCell] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(getTimeOfDayIndex());
  const medicine = sampleMedicines[selectedCell] || null;
  useEffect(() => {
    setCurrentTimeIndex(getTimeOfDayIndex());
  }, []);


  return (
    <div className="flex flex-col pt-40">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          {/* desktop view */}
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-2 p-3 ">
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
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
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
          </DialogPanel>
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
      <div className="flex flex-col items-center justify-center ">
        <h2 className="text-2xl font-bold mb-4 text-gray-700 text-center">
          Your Personalised Pillbox
        </h2>
        <Tabs
          defaultValue={days[today].toLowerCase()}
          className="w-max mx-auto px-5"
        >
          <TabsList className="flex justify-center">
            {days.map((day) => (
              <TabsTrigger key={day.toLowerCase()} value={day.toLowerCase()}>
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
          {days.map((day) => (
            <TabsContent key={day.toLowerCase()} value={day.toLowerCase()}>
            <p className="text-lg font-semibold text-gray-700">{day}'s Medicine Schedule</p>
            <Carousel className="mt-4 sm:mx-10 lg:mx-2" 
            opts={{
              loop:true,
              startIndex:currentTimeIndex
            }}
          >
              <CarouselContent>
                <CarouselItem>🌅 Morning</CarouselItem>
                <CarouselItem>☀️ Afternoon</CarouselItem>
                <CarouselItem>🌆 Evening</CarouselItem>
                <CarouselItem>🌙 Night</CarouselItem>
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}