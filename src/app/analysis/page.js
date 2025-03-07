"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
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
  useUser,
} from "@clerk/nextjs";
import { navigation } from "@/lib/constants"
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs,updateDoc } from "firebase/firestore";


const chartData = [
  { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
  { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
  { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
  { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
  { browser: "other", visitors: 90, fill: "var(--color-other)" },
]
const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} 

export default function AnalysisPage() {
  const {userId}= useAuth();
  const {user,isSignedIn,isLoaded}= useUser();
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading,setLoading]=useState(true);


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
              allMedicines = [...allMedicines, ...data.medicines];
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

console.log("meds",medicines);
  if(!user|| !isSignedIn)return (
    <SignInButton/>
  )
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
    <Card className="flex flex-col bg-transparent">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Label</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={chartData}
            startAngle={-90}
            endAngle={380}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="browser" />}
            />
            <RadialBar dataKey="visitors" background>
              <LabelList
                position="insideStart"
                dataKey="browser"
                className="fill-white capitalize mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
    </div>
  )
}
