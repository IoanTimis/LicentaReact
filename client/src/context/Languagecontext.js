'use client';

import { createContext, useContext, useState } from "react";
import translations from "@/locales/translations.json";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState("ro"); 

  const translate = (text) => {
    if (language === "ro" && translations[text]) {
      return translations[text]; 
    }
    return text; 
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
