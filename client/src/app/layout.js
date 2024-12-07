import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./components/header";
import Footer from "./components/footer";

import store from "../store/page";

// Fonturile localizate
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Online BSc/MSc Themes Selection Application",
  description: "Gestionarea online a temelor de licență și disertație",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar /> {/* Bara de navigare */}
        <main className="flex-grow">{children}</main> {/* Conținutul principal */}
        <Footer /> {/* Footer */}
      </body>
    </html>
  );
}
