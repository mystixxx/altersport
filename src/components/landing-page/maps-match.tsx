"use client";

import { useState, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { CustomMarkerMatch } from "../ui/custom-marker-match";

// Map configuration constants
const MAP_CONFIG = {
  containerStyle: {
    width: "100%",
    height: "580px",
    borderRadius: "8px",
  },
  defaultCenter: {
    lat: 45.815399, // Croatia
    lng: 15.966568,
  },
  options: {
    disableDefaultUI: true,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    styles: [
      { elementType: "geometry", stylers: [{ color: "#131033" }] },
      { elementType: "labels.text.stroke", stylers: [{ color: "#131033" }] },
      { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
      {
        featureType: "administrative.land_parcel",
        stylers: [{ visibility: "off" }],
      },
      {
        featureType: "administrative.neighborhood",
        stylers: [{ visibility: "off" }],
      },
      { featureType: "poi", stylers: [{ visibility: "off" }] },
      { featureType: "poi.business", stylers: [{ visibility: "off" }] },
      {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#131033" }],
      },
      {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
      },
      {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
      },
      {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
      },
      {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
      },
      {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
      },
      {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
      },
      {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
      },
      {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
      },
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
      },
      {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
      },
      { featureType: "landscape.man_made", stylers: [{ visibility: "off" }] },
      {
        featureType: "all",
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }],
      },
    ],
  },
};

type MapsMatchProps = {
  locationName?: string;
  locationCoordinates?: { lat: number; lng: number };
  locationImageUrl?: string;
};

export default function MapsMatch({
  locationName,
  locationCoordinates,
  locationImageUrl,
}: MapsMatchProps = {}) {
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Map callbacks
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  // Default to MAP_CONFIG.defaultCenter if no coordinates provided
  const center = locationCoordinates || MAP_CONFIG.defaultCenter;

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold text-white">Lokacija utakmice</h2>

      <div className="flex flex-col gap-5 rounded-md bg-[#0E0C28] p-5">
        <div className="relative w-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONFIG.containerStyle}
              center={center}
              zoom={15}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={MAP_CONFIG.options}
            >
              {/* Location marker */}
              {locationCoordinates && (
                <CustomMarkerMatch
                  position={locationCoordinates}
                  label={locationName || "Match Location"}
                  isActive={true}
                />
              )}
            </GoogleMap>
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-gray-800">
              <p className="text-white">Učitavanje karte...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
