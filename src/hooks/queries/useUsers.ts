"use client";

import { externalApi } from "@/lib/api/client";
import { useQuery } from "./useQuery";
import { useMutation } from "./useMutation";

// Define the query key prefix for user data
const USER_QUERY_KEYS = {
  all: ["users"],
  detail: (id: string | number) => ["users", id.toString()],
  initialize: (id: string | number) => ["users", id.toString(), "initialize"],
};

// Type for user data - adjust based on your actual API response
interface User {
  id: string | number;
  name: string;
  email: string;
  // Add more fields as needed
}

/**
 * Hook for fetching all users
 */
export function useUsers() {
  return useQuery<User[]>(USER_QUERY_KEYS.all, () => externalApi.get("users"), {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for fetching a single user by ID
 */
export function useUser(id: string | number) {
  return useQuery<User>(
    USER_QUERY_KEYS.detail(id),
    () => externalApi.get(`users/${id}`),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}

/**
 * Hook for creating a new user
 */
export function useCreateUser() {
  return useMutation<User, Partial<User>>(
    (userData) => externalApi.post("users", userData),
    {
      // Options for the mutation
      onSuccess: (data) => {
        // You can optionally invalidate queries here
        // queryClient.invalidateQueries(USER_QUERY_KEYS.all)
      },
    },
  );
}

/**
 * Hook for updating a user
 */
export function useUpdateUser(id: string | number) {
  return useMutation<User, Partial<User>>(
    (userData) => externalApi.put(`users/${id}`, userData),
    {
      // Options for the mutation
      onSuccess: (data) => {
        // You can optionally invalidate queries here
        // queryClient.invalidateQueries(USER_QUERY_KEYS.detail(id))
      },
    },
  );
}

/**
 * Hook for initializing a user
 */
export function useInitializeUser(id: string | number) {
  return useMutation<
    { user_id: string; profile: User },
    Record<string, any> | undefined
  >((initData) => externalApi.post(`users/${id}/initialize`, initData ?? {}), {
    // Options for the mutation
    onSuccess: (data) => {
      // You can optionally invalidate queries here
      // queryClient.invalidateQueries(USER_QUERY_KEYS.all)
    },
  });
}

/**
 * Hook for getting user initialization status
 */
export function useUserInitializationStatus(id: string | number) {
  return useQuery<{ initialized: boolean; status: string }>(
    USER_QUERY_KEYS.initialize(id),
    () => externalApi.get(`users/${id}/initialize`),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}
