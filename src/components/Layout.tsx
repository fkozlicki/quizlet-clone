import React, { type PropsWithChildren } from "react";
import { useAuthFormContext } from "../contexts/AuthFormContext";
import Navbar from "./Navbar";

const Layout = ({ children }: PropsWithChildren) => {
  const [authForm] = useAuthFormContext();
  return (
    <div
      className={`relative ${
        authForm === "closed" ? "" : "h-screen overflow-hidden"
      }`}
    >
      <Navbar />
      {children}
    </div>
  );
};

export default Layout;
