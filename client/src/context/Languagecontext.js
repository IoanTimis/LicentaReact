'use client';

import { createContext, useContext, useState } from "react";
import translations from "@/locales/translations.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("en"); // Limba implicită setată la română
  console.log("translations", translations);

  const translate = (text) => {
    console.log("text", text);
    if (language === "ro" && translations[text]) {
      return translations[text]; // Returnează traducerea în română
    }
    return text; // Returnează cheia (în engleză) dacă limba este "en" sau traducerea lipsește
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
