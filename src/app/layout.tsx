import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Head from "next/head";
import QueryProvider from "@/components/QueryProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script
          src="https://kit.fontawesome.com/1b387810f3.js"
          crossOrigin="anonymous"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffc40d" />
        <meta name="theme-color" content="#2c3e50" />

        <title>Bar Schichtplan</title>
        <meta name="description" content="Hier gibts kein Bier!" />
      </head>
      <body className={inter.className}>
        <div className="flex flex-col justify-center">
          <div className="flex flex-col items-center mb-20">
            <QueryProvider>{children}</QueryProvider>
          </div>
        </div>

        <div className="flex fixed bottom-0 left-0 shadow w-full text-5xl bg-bg border-2 border-primary p-4 justify-evenly z-10">
          <a href="/shiftPlan">
            <i
              aria-hidden
              className="fa-solid fa-beer-mug-empty"
              style={{ color: "#e74c3c" }}
            />
          </a>
          <a href="/">
            <i
              aria-hidden
              className="fa-solid fa-house"
              style={{ color: "#e74c3c" }}
            />
          </a>
          <a href="/barCalendar">
            <i
              aria-hidden
              className="fa-regular fa-calendar"
              style={{ color: "#e74c3c" }}
            />
          </a>
          <a href="/admin">
            <i
              aria-hidden
              className="fa-solid fa-lock"
              style={{ color: "#e74c3c" }}
            />
          </a>
        </div>
      </body>
    </html>
  );
}
