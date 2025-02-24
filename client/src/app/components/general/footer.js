"use client";

import React from "react";
import { useLanguage } from "@/context/Languagecontext";

const Footer = () => {
  const { translate } = useLanguage();
  return (
    <footer className="bg-navbar-gradient text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} {translate("Online BSc/MSc themes selection application. All rights reserved.")}
        </p>
        <p className="text-xs mt-2">
          {translate("Created by")} <strong>Ioan Timiș</strong>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
