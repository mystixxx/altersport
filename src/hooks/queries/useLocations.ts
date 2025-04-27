import type { LocationRecord } from "@/lib/services/airtable";
import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "./useQuery";
import { useMutation } from "./useMutation";
import { useQueryClient } from "@tanstack/react-query";
import type { UseMutationResult } from "@tanstack/react-query";

/**
 * Hook for fetching all Locations from Airtable
 */
export function useLocations() {
  return useQuery<LocationRecord[]>(
    queryKeys.airtable.locations,
    () => api.get(apiRoutes.airtable.locations),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching a single Location by ID from Airtable
 */
export function useLocation(id: string) {
  return useQuery<LocationRecord>(
    [...queryKeys.airtable.locations, id],
    () => api.get(`${apiRoutes.airtable.locations}?id=${id}`),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}

/**
 * Hook for creating a new Location
 */
export function useCreateLocation(): UseMutationResult<
  LocationRecord,
  Error,
  Omit<LocationRecord, "id">
> {
  const queryClient = useQueryClient();

  return useMutation<LocationRecord, Error, Omit<LocationRecord, "id">>(
    (locationData) => api.post(apiRoutes.airtable.locations, locationData),
    {
      onSuccess: () => {
        // Invalidate the locations list query to refetch the updated data
        queryClient.invalidateQueries({
          queryKey: queryKeys.airtable.locations,
        });
      },
    },
  );
}

/**
 * Hook for updating a Location
 */
export function useUpdateLocation(
  id: string,
): UseMutationResult<LocationRecord, Error, Partial<LocationRecord>> {
  const queryClient = useQueryClient();

  return useMutation<LocationRecord, Error, Partial<LocationRecord>>(
    (locationData) =>
      api.put(`${apiRoutes.airtable.locations}/${id}`, locationData),
    {
      onSuccess: () => {
        // Invalidate the specific location query and the locations list query
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.airtable.locations, id],
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.airtable.locations,
        });
      },
    },
  );
}

/**
 * Hook for fetching locations filtered by sport
 */
export function useLocationsBySport(sportId: string) {
  const { data: allLocations, isLoading, error } = useLocations();

  // If we have locations and a sportId, filter by sport
  const filteredLocations =
    sportId && allLocations
      ? allLocations.filter(
          (location) => location.sport && location.sport.includes(sportId),
        )
      : allLocations;

  return {
    data: filteredLocations,
    isLoading,
    error,
  };
}
