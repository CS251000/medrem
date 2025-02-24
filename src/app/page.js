'use client'

import { useState } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import Image from 'next/image'
import Link from 'next/link'
import { SignedIn, SignedOut, SignInButton, UserButton, useUser,useAuth } from '@clerk/nextjs'
import { navigation } from '@/lib/constants'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoaded, isSignedIn } = useUser();
  const {userId}= useAuth();

  return (
    <div>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <Link href="#" className="-m-2 p-3">
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

          {/* Mobile menu button */}
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

          {/* Desktop navigation */}
          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href} className="text-lg font-semibold text-gray-900">
                {item.name}
              </Link>
            ))}
          </div>

          {/* Authentication Section */}
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

        {/* Mobile Menu */}
        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-blue-100 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">Your Company</span>
                <Image alt="" src="/assets/images/logo.png" height={100} width={100} className="rounded-xl" />
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
                    <Link key={item.name} href={item.href} className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50">
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

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative rounded-full px-3 py-1 text-sm/6 text-gray-600 ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Empowering Health, Simplifying Care. 💙
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
              Stay Healthy, Stay on Track
            </h1>
            <p className="mt-8 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
              Never miss a dose with our smart pillbox and real-time notifications.
              Take control of your medications with AI-powered reminders and prescription tracking.
            </p>

            {/* Call to Actions */}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href={'/add-prescription'}
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add a Prescription +
              </Link>

              {isSignedIn ? (
                <Link
                  href={`/pillbox/${userId}`}
                  className="text-md font-semibold text-blue-700"
                >
                  Go to PillBox <span aria-hidden="true">→</span>
                </Link>
              ) : (
                <SignInButton>
                  <button className="text-md font-semibold text-blue-700">
                    Go to PillBox <span aria-hidden="true">→</span>
                  </button>
                </SignInButton>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
