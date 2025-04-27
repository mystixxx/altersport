import type { KategorijaRecord } from "@/lib/services/airtable";
import { api } from "@/lib/api/client";
import { apiRoutes } from "@/lib/api/routes";
import { queryKeys } from "@/lib/api/queryKeys";
import { useQuery } from "./useQuery";
import { useMutation } from "./useMutation";
import { useQueryClient } from "@tanstack/react-query";

// Type for creating a new league
export type CreateKategorijaData = {
  name: string;
  sport: string[];
  notes?: string;
  assignee?: { id: string; email: string; name: string };
  vrstaLige: string;
  status: string;
  startdate: string;
  enddate: string;
};

// Type for updating a league
export type UpdateKategorijaData = {
  id: string;
  name: string;
  sport: string[];
  notes?: string;
  assignee?: { id: string; email: string; name: string };
  vrstaLige: string;
  status: string;
  startdate: string;
  enddate: string;
};

/**
 * Hook for fetching all Kategorije from Airtable
 */
export function useKategorije() {
  return useQuery<KategorijaRecord[]>(
    queryKeys.airtable.kategorije,
    () => api.get(apiRoutes.airtable.kategorije),
    {
      // You can customize options here
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  );
}

/**
 * Hook for fetching Kategorije (leagues) filtered by sport ID
 */
export function useKategorijeBySport(sportId?: string) {
  const { data: allKategorije, isLoading, error } = useKategorije();

  // If a sportId is provided, filter the leagues by sport
  const filteredKategorije = sportId
    ? allKategorije?.filter(
        (kategorija) => kategorija.sport && kategorija.sport.includes(sportId),
      )
    : allKategorije;

  return {
    data: filteredKategorije,
    isLoading,
    error,
  };
}

/**
 * Hook for creating a new Kategorija in Airtable
 */
export function useCreateKategorija() {
  const queryClient = useQueryClient();

  return useMutation<KategorijaRecord, Error, CreateKategorijaData>(
    (data) => api.post(apiRoutes.airtable.kategorije, data),
    {
      onSuccess: () => {
        // Invalidate and refetch the kategorije list
        queryClient.invalidateQueries({
          queryKey: queryKeys.airtable.kategorije,
        });
      },
    },
  );
}

/**
 * Hook for updating a Kategorija in Airtable
 */
export function useUpdateKategorija() {
  const queryClient = useQueryClient();

  return useMutation<KategorijaRecord, Error, UpdateKategorijaData>(
    (data) => api.put(`${apiRoutes.airtable.kategorije}/${data.id}`, data),
    {
      onSuccess: () => {
        // Invalidate and refetch the kategorije list
        queryClient.invalidateQueries({
          queryKey: queryKeys.airtable.kategorije,
        });
      },
    },
  );
}
