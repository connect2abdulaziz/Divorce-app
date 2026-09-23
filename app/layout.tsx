import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import "./marketing.css";

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["opsz"],
  display: "swap",
});

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata = {
  title: "Legal Divorce Docs | Arizona Divorce Document Preparation",
  description:
    "Prepare your Arizona divorce documents online with a simple step-by-step process and support from an Arizona Certified Legal Document Preparer.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
