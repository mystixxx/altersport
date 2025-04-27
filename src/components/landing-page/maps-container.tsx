"use client";

import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ChevronDownIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { CustomMarker } from "../ui/custom-marker";
import MapLocationCard from "../ui/map-location-card";
import SearchInput from "./search-input";
import {
  useTeamsWithCoordinates,
  type TeamWithCoordinates,
} from "@/hooks/queries/useTeamsWithCoordinates";

// Modify location type to include teams data
type Location = {
  id: string;
  position: { lat: number; lng: number };
  label: string;
  address: string;
  imageUrl?: string;
  sport: string[];
  website?: string;
};

// Define a type for Sport
type Sport = {
  id: string;
  name: string;
  fields?: {
    Name: string;
  };
};

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

// Convert TeamWithCoordinates to Location
const teamToLocation = (team: TeamWithCoordinates): Location | null => {
  if (!team.coordinates) return null;

  return {
    id: team.id,
    position: team.coordinates,
    label: team.name,
    address: team.address || "",
    imageUrl: team.logo?.[0]?.url,
    sport: team.sport,
    website: team.website,
  };
};

// Function to calculate distance between two coordinates using Haversine formula
const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number): number => {
  return deg * (Math.PI / 180);
};

// Props type for FilterDropdown
type FilterDropdownProps = {
  label: string;
  options: { id: string; name: string }[];
  onSelect: (option: string) => void;
  align?: "center" | "start" | "end";
  selectedValue?: string;
};

// Filter dropdown component for better organization
const FilterDropdown = ({
  label,
  options,
  onSelect,
  align = "center",
  selectedValue,
}: FilterDropdownProps) => {
  // Find the selected sport name for display
  const selectedName =
    options.find((option) => option.id === selectedValue)?.name || label;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="rounded-full border-white/30 bg-transparent text-white shadow-none hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-0 focus-visible:outline-none"
        >
          {selectedName}
          <ChevronDownIcon className="size-5" color="white" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        className="border-white/30 bg-[#0E0C28] shadow-lg"
      >
        {options.map((option) => (
          <DropdownMenuCheckboxItem
            key={option.id}
            checked={selectedValue === option.id}
            onClick={() =>
              onSelect(selectedValue === option.id ? "" : option.id)
            }
            className="text-white focus:bg-white/10 focus:text-white"
          >
            {option.name}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Custom hook to fetch sports from API
const useSports = () => {
  const [sports, setSports] = useState<Sport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSports = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/airtable/sports");
        if (!response.ok) {
          throw new Error("Failed to fetch sports");
        }
        const data = await response.json();

        // Keep the full sport objects
        setSports(data);
      } catch (error) {
        console.error("Error fetching sports:", error);
        setSports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSports();
  }, []);

  return { sports, isLoading };
};

// Custom hook to handle user location
const useUserLocation = () => {
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolokacija nije podržana u vašem pregledniku.");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setIsLocating(false);
      },
      (error) => {
        setLocationError(
          error.code === error.PERMISSION_DENIED
            ? "Molimo dopustite pristup lokaciji za bolje iskustvo."
            : "Greška pri dohvaćanju vaše lokacije.",
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  }, []);

  return { userLocation, locationError, isLocating, requestLocation };
};

export default function MapsContainer() {
  // State management
  const [selectedSport, setSelectedSport] = useState<string>("");
  const [selectedDistance, setSelectedDistance] = useState<string>("");
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showLocationRequest, setShowLocationRequest] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Get user location
  const { userLocation, locationError, isLocating, requestLocation } =
    useUserLocation();

  // Fetch teams with coordinates
  const { teams, isLoading: isTeamsLoading } = useTeamsWithCoordinates();

  // Fetch sports from API
  const { sports, isLoading: isSportsLoading } = useSports();

  // Convert teams to locations
  const locations = useMemo(() => {
    if (!teams) return [];
    return teams
      .filter((team) => team.coordinates) // Only include teams with valid coordinates
      .map((team) => teamToLocation(team))
      .filter((location): location is Location => location !== null);
  }, [teams]);

  // Google Maps API loading
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  // Map callbacks
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
    // Show location request prompt after map loads
    setShowLocationRequest(true);
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  // Request location on component mount
  useEffect(() => {
    // Only automatically request location when the map is loaded
    if (isLoaded && showLocationRequest) {
      requestLocation();
      setShowLocationRequest(false);
    }
  }, [isLoaded, showLocationRequest, requestLocation]);

  // Update map center when user location is available
  useEffect(() => {
    if (map && userLocation) {
      map.panTo(userLocation);
      map.setZoom(13); // Zoom in when we have user's location
    }
  }, [map, userLocation]);

  // Close location card when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setSelectedLocation(null);
        setActiveMarker(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle marker click
  const handleMarkerClick = (markerId: string) => {
    if (markerId === activeMarker) {
      setActiveMarker(null);
      setSelectedLocation(null);
    } else {
      setActiveMarker(markerId);
      const location = locations.find((loc) => loc.id === markerId);
      setSelectedLocation(location || null);
    }
  };

  // Toggle location favorite status
  const handleToggleFavorite = (locationId: string) => {
    setFavorites((prev) =>
      prev.includes(locationId)
        ? prev.filter((id) => id !== locationId)
        : [...prev, locationId],
    );
  };

  // Calculate default center from locations or use user location
  const defaultCenter = useMemo(() => {
    if (userLocation) return userLocation;
    if (locations.length === 0) return MAP_CONFIG.defaultCenter;

    // Calculate average of all coordinates
    const sum = locations.reduce(
      (acc, loc) => ({
        lat: acc.lat + loc.position.lat,
        lng: acc.lng + loc.position.lng,
      }),
      { lat: 0, lng: 0 },
    );

    return {
      lat: sum.lat / locations.length,
      lng: sum.lng / locations.length,
    };
  }, [locations, userLocation]);

  // Filter locations based on selected sport ID and distance
  const filteredLocations = useMemo(() => {
    let filtered = locations;

    // Filter by sport if a sport is selected
    if (selectedSport) {
      filtered = filtered.filter((location) =>
        location.sport.includes(selectedSport),
      );
    }

    // Filter by distance if a distance is selected and user location is available
    if (selectedDistance && userLocation) {
      const distanceKm = parseInt(selectedDistance.replace("km", ""));

      filtered = filtered.filter((location) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          location.position.lat,
          location.position.lng,
        );
        return distance <= distanceKm;
      });
    }

    return filtered;
  }, [locations, selectedSport, selectedDistance, userLocation]);

  // Prepare distance options
  const distanceOptions = useMemo(
    () => [
      { id: "1km", name: "1km" },
      { id: "5km", name: "5km" },
      { id: "10km", name: "10km" },
      { id: "20km", name: "20km" },
      { id: "50km", name: "50km" },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-semibold text-white">Pretraži na karti</h2>

      <div className="flex flex-col gap-5 rounded-md bg-[#0E0C28] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FilterDropdown
              label="Sport"
              options={
                isSportsLoading
                  ? []
                  : sports.map((sport) => ({
                      id: sport.id,
                      name: sport.name || sport.fields?.Name || "",
                    }))
              }
              onSelect={setSelectedSport}
              align="start"
              selectedValue={selectedSport}
            />
            <FilterDropdown
              label="Udaljenost"
              options={distanceOptions}
              onSelect={setSelectedDistance}
              align="end"
              selectedValue={selectedDistance}
            />
          </div>
          <SearchInput />
        </div>

        <div className="relative w-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={MAP_CONFIG.containerStyle}
              center={defaultCenter}
              zoom={userLocation ? 13 : 10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={MAP_CONFIG.options}
            >
              {/* User location marker */}
              {userLocation && <Marker position={userLocation} />}

              {selectedLocation && (
                <div ref={cardRef}>
                  <MapLocationCard
                    location={{
                      ...selectedLocation,
                      // If a sport is selected in the filter, prioritize it
                      sport: selectedSport
                        ? selectedLocation.sport?.includes(selectedSport)
                          ? selectedLocation.sport
                          : [selectedSport, ...(selectedLocation.sport || [])]
                        : selectedLocation.sport,
                    }}
                    favorite={favorites.includes(selectedLocation.id)}
                    handleToggleFavorite={() =>
                      handleToggleFavorite(selectedLocation.id)
                    }
                  />
                </div>
              )}

              {filteredLocations.map((marker) => {
                return (
                  <CustomMarker
                    key={marker.id}
                    position={marker.position}
                    label={marker.label}
                    isActive={activeMarker === marker.id}
                    onClick={() => handleMarkerClick(marker.id)}
                    imageUrl={marker.imageUrl}
                  />
                );
              })}
            </GoogleMap>
          ) : (
            <div className="flex h-[400px] w-full items-center justify-center rounded-md bg-gray-800">
              <p className="text-white">
                {isTeamsLoading || isSportsLoading
                  ? "Učitavanje podataka..."
                  : "Učitavanje karte..."}
              </p>
            </div>
          )}

          {isLocating && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 transform rounded-full bg-black/50 px-4 py-2 text-sm text-white">
              Dohvaćanje vaše lokacije...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
