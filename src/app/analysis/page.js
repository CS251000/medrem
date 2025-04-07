"use client";

import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart, YAxis,Tooltip } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useState, useEffect } from "react";
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
import { navigation } from "@/lib/constants";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";


const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="custom-tooltip bg-white p-2 border rounded shadow">
        <p className="text-sm font-medium">{data.name}</p>
        <p className="text-xs text-gray-600">Completion: {data.ratio}</p>
      </div>
    );
  }
  return null;
};


export default function AnalysisPage() {
  const { userId } = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    if (!userId) return; 

    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(prescriptionsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        let allMedicines = querySnapshot.docs.flatMap(
          (doc) => doc.data().medicines || []
        );

        setMedicines(allMedicines);

        const formattedChartData = allMedicines.map((med, index) => ({
          name: med.medicineName || `Medicine ${index + 1}`,
          adherence: (med.takenCount / med.total) * 100,
          ratio: `${med.takenCount}/${med.total}`,
          fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
        }));

        const formattedChartConfig = Object.fromEntries(
          formattedChartData.map((med) => [
            med.name,
            { label: med.name, color: med.fill },
          ])
        );

        const updatedChartData = [
          ...formattedChartData,
          {
            name: "",
            adherence: 100,
            // ratio: "1/1",
            fill: "#fff", // White color for reference goal
          },
        ];

        setChartData(updatedChartData);
        setChartConfig(formattedChartConfig);
      } catch (error) {
        console.error("Error fetching medicines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMedicines();
  }, [userId]);
  console.log(chartConfig);

  if (!isLoaded) return <p>Loading...</p>;

  if (!user || !isSignedIn) return <SignInButton />;

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

      {/* Medicine Completion Chart */}
      <Card className="flex flex-col bg-transparent">
        <CardHeader className="items-center pb-0">
          <CardTitle>Medicine Completion</CardTitle>
          <CardDescription>See all your medicines here</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square max-h-[250px]"
          >
            <RadialBarChart
              width={300}
              height={300}
              innerRadius="40%"
              outerRadius="80%"
              barSize={10} // Adjust bar thickness
              data={chartData}
              startAngle={90}
              endAngle={-270}
            >
            <Tooltip content={<CustomTooltip />} />

              

              <RadialBar
                minAngle={15}
                background={{ fill: "#eee" }} 
                dataKey="adherence"
                cornerRadius={5}
                fill={(entry) => entry.fill}
              >
                <LabelList
                  position="insideStart"
                  dataKey="name"
                  className="fill-black font-bold capitalize mix-blend-luminosity"
                  fontSize={11}
                />
              </RadialBar>
            </RadialBarChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="text-sm">
          <div className="leading-none text-muted-foreground">
            Adherence percentage of prescribed medicines
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
