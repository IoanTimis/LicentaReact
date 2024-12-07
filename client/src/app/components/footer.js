"use client";

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
      <div className="container mx-auto text-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Online BSc/MSc Themes Selection Application. Toate drepturile rezervate.
        </p>
        <p className="text-xs mt-2">
          Creat de <strong>Ioan Timiș</strong>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
