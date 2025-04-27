"use client";

import { useEffect } from "react";

export default function UuidManager() {
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("userId")) {
      const uuid = "demo_user_1745674557_8";
      localStorage.setItem("userId", uuid);
    }
  }, []);

  return null;
}
