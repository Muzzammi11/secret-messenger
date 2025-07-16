import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ParticlesComponent from "@/components/ParticlesComponent";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Secret Messenger",
  description: "Send anonymous messages",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' style='stop-color:%238A2BE2;'/><stop offset='100%25' style='stop-color:%2300FFFF;'/></linearGradient></defs><rect width='100' height='100' rx='20' fill='%231a1a1a' /><path d='M15,25 L85,25 L85,75 L15,75 Z M15,25 L50,55 L85,25' stroke='url(%23g)' stroke-width='8' fill='none'/></svg>" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </head>
      <body className={inter.className}>

        <ParticlesComponent />
        <div className="container">
          {children}
        </div>
      </body>
    </html>
  );
}