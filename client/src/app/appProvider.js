'use client';

import React, { use } from "react";
import { Provider } from "react-redux";
import Navbar from "./components/header";
import Footer from "./components/footer";
import store from "@/store/page";


export default function AppProvider({ children }) {
  return (
    <Provider store={store}>
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
    </Provider>
  );
}
