"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type UserContextType = {
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  age: string;
  setAge: (age: string) => void;
  location: string;
  setLocation: (location: string) => void;
  colorMode: boolean;
  setColorMode: (value: boolean) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [name, setNameState] = useState("Sachin");
  const [email, setEmailState] = useState("sachin@lifeos.app");
  const [age, setAgeState] = useState("23");
  const [location, setLocationState] = useState("Delhi, India");
  const [colorMode, setColorModeState] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const savedName = localStorage.getItem("lifeos_name");
    const savedEmail = localStorage.getItem("lifeos_email");
    const savedAge = localStorage.getItem("lifeos_age");
    const savedLocation = localStorage.getItem("lifeos_location");
    const savedTheme = localStorage.getItem("lifeos_theme");

    if (savedName) setNameState(savedName);
    if (savedEmail) setEmailState(savedEmail);
    if (savedAge) setAgeState(savedAge);
    if (savedLocation) setLocationState(savedLocation);
    if (savedTheme === "color") setColorModeState(true);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      if (colorMode) {
        document.documentElement.classList.add("color-theme");
        localStorage.setItem("lifeos_theme", "color");
      } else {
        document.documentElement.classList.remove("color-theme");
        localStorage.setItem("lifeos_theme", "day");
      }
    }
  }, [colorMode, loaded]);

  const setName = (val: string) => {
    setNameState(val);
    localStorage.setItem("lifeos_name", val);
  };

  const setEmail = (val: string) => {
    setEmailState(val);
    localStorage.setItem("lifeos_email", val);
  };

  const setAge = (val: string) => {
    setAgeState(val);
    localStorage.setItem("lifeos_age", val);
  };

  const setLocation = (val: string) => {
    setLocationState(val);
    localStorage.setItem("lifeos_location", val);
  };

  const setColorMode = (val: boolean) => {
    setColorModeState(val);
  };

  return (
    <UserContext.Provider value={{ name, setName, email, setEmail, age, setAge, location, setLocation, colorMode, setColorMode }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
