"use client";

import { useEffect, useState } from "react";
import { externalApi } from "@/lib/api/client";

export default function UserInitializer() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const initUser = async () => {
      if (typeof window === "undefined") return;

      // Check if the user is already initialized
      const userInitialized =
        localStorage.getItem("userInitialized") === "true";
      if (userInitialized) {
        setIsInitialized(true);
        return;
      }

      // Wait a short moment to ensure UuidManager has run
      setTimeout(async () => {
        const userId = localStorage.getItem("userId");

        if (userId && !isInitialized) {
          console.log(`Starting initialization for user: ${userId}`);

          try {
            // Call the external API directly without going through Next.js API
            const response = await externalApi.post(
              `users/initialize/${userId}`,
              {},
            );
            console.log("User initialized successfully:", response);
            localStorage.setItem("userInitialized", "true");
            setIsInitialized(true);
          } catch (error) {
            console.error("Failed to initialize user:", error);
          }
        }
      }, 100); // Small delay to ensure UUID has been set
    };

    if (!isInitialized) {
      initUser();
    }
  }, [isInitialized]);

  return null;
}
