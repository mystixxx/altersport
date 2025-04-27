"use client";

import { useEffect } from "react";

export default function UuidManager() {
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("userId")) {
      const uuid = crypto.randomUUID();
      localStorage.setItem("userId", uuid);
    }
  }, []);

  return null;
}
