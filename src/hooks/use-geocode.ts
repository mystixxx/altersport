"use client";

import { useState, useEffect } from "react";
import {
  setKey,
  setLanguage,
  setRegion,
  fromAddress,
  RequestType,
  geocode,
} from "react-geocode";

// Set default options for react-geocode
setKey(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "");
setLanguage("hr");
setRegion("hr");

export type GeocodingResult = {
  lat: number;
  lng: number;
  success: boolean;
  error?: string;
};

/**
 * Hook to convert an address to latitude and longitude coordinates
 * @param address - The address to geocode
 * @returns The geocoding result containing latitude and longitude
 */
export function useGeocode(
  address: string,
): GeocodingResult & { isLoading: boolean } {
  const [result, setResult] = useState<GeocodingResult>({
    lat: 0,
    lng: 0,
    success: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!address) return;

    setIsLoading(true);

    // Using fromAddress function from react-geocode
    fromAddress(address)
      .then((response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setResult({
          lat,
          lng,
          success: true,
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error geocoding address:", error);
        setResult({
          lat: 0,
          lng: 0,
          success: false,
          error: error.message,
        });
        setIsLoading(false);
      });
  }, [address]);

  return { ...result, isLoading };
}
