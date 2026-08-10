import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free QR Code Generator",
  description: "Generate customizable QR codes for links, text, Wi-Fi, contact details, email, phone, and more.",
  alternates: {
    canonical: "/qr-generator",
  },
  openGraph: {
    url: "/qr-generator",
    title: "Free QR Code Generator | DocSprintHub",
    description: "Generate customizable QR codes for links, text, Wi-Fi, contact details, email, phone, and more.",
  },
};

export default function QrGeneratorLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
