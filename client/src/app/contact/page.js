"use client";
import { useLanguage } from "@/context/Languagecontext";

export default function Contact() {
  const { translate } = useLanguage();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800">{translate("Contact Us")}</h1>
    </div>
  );
}
