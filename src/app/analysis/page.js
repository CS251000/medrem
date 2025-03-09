"use client"

import { TrendingUp } from "lucide-react"
import { LabelList, RadialBar, RadialBarChart, YAxis } from "recharts"

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
import { navigation } from "@/lib/constants"
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function AnalysisPage() {
  const { userId } = useAuth();
  const { user, isSignedIn, isLoaded } = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [chartConfig, setChartConfig] = useState({});

  useEffect(() => {
    if (!userId) return; // Prevent fetching if not authenticated

    const fetchMedicines = async () => {
      setLoading(true);
      try {
        const prescriptionsRef = collection(db, "prescriptions");
        const q = query(prescriptionsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        let allMedicines = querySnapshot.docs.flatMap((doc) => doc.data().medicines || []);

        setMedicines(allMedicines);

        const formattedChartData = allMedicines.map((med, index) => ({
          name: med.medicineName || `Medicine ${index + 1}`,
          adherence: (med.taken/med.total)*100,
          fill: `hsl(${Math.random() * 360}, 70%, 50%)`, // Generate random colors
        }));
        
        

        const formattedChartConfig = Object.fromEntries(
          formattedChartData.map((med) => [med.name, { label: med.name, color: med.fill }])
        );

        const updatedChartData = [
          ...formattedChartData,
          {
            name: "",
            adherence: 100,
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
          {/* Logo */}
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
          {/* Mobile Menu Button */}
          <div className="flex lg:hidden">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            >
              <Bars3Icon className="size-6" aria-hidden="true" />
            </button>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-lg font-semibold text-gray-900">
                {item.name}
              </Link>
            ))}
          </div>
          {/* User Button */}
          <div className="hidden lg:flex lg:flex-1 lg:justify-end mr-10">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <SignInButton />
            </SignedOut>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <Image
                  alt="logo"
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
                <XMarkIcon className="size-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map((item) => (
                    <Link key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50">
                      {item.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </Dialog>
      </header>

      {/* Medicine Completion Chart */}
      <Card className="flex flex-col bg-transparent">
        <CardHeader className="items-center pb-0">
          <CardTitle>Medicine Completion</CardTitle>
          <CardDescription>See all your medicines here</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[250px]">
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
  {/* Ensure tooltips work correctly */}
  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel nameKey="name" />} />

  {/* Add yAxis to explicitly define the domain */}
  {/* <YAxis type="number" domain={[0, 100]} hide /> */}

  <RadialBar 
    minAngle={15} 
    background={{ fill: "#eee" }} // Gray background ring for reference
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
          <div className="leading-none text-muted-foreground">Adherence percentage of prescribed medicines</div>
        </CardFooter>
      </Card>
    </div>
  );
}
