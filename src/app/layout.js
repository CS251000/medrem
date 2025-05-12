import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";





const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "MedRem",
  description: "By Chirag and Tanay",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <Script
          id="pushalert"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(d, t) {
              var g = d.createElement(t),
              s = d.getElementsByTagName(t)[0];
              g.src = "https://cdn.pushalert.co/integrate_26bda26de01abbbea4803110fc2405cc.js";
              s.parentNode.insertBefore(g, s);
            })(document, "script");`,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
