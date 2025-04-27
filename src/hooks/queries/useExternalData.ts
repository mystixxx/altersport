"use client";

import { externalApi } from "@/lib/api/client";
import { useQuery } from "./useQuery";

// Define the query key prefix for external API data
const EXTERNAL_QUERY_KEYS = {
  users: ["external", "users"],
  products: ["external", "products"],
  // Add more as needed
};

// Type for external API user data - adjust based on your actual API response
interface User {
  id: number;
  name: string;
  email: string;
  // Add more fields as needed
}

// Type for external API product data - adjust based on your actual API response
interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  // Add more fields as needed
}

/**
 * Hook for fetching all users from the external API
 */
export function useExternalUsers() {
  return useQuery<User[]>(
    EXTERNAL_QUERY_KEYS.users,
    () => externalApi.get("users"), // Adjust this endpoint to match your external API
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Add other options as needed
    },
  );
}

/**
 * Hook for fetching a single user by ID from the external API
 */
export function useExternalUser(id: number) {
  return useQuery<User>(
    [...EXTERNAL_QUERY_KEYS.users, id.toString()],
    () => externalApi.get(`users/${id}`), // Adjust this endpoint to match your external API
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}

/**
 * Hook for fetching all products from the external API
 */
export function useExternalProducts() {
  return useQuery<Product[]>(
    EXTERNAL_QUERY_KEYS.products,
    () => externalApi.get("products"), // Adjust this endpoint to match your external API
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      // Add other options as needed
    },
  );
}

/**
 * Hook for fetching a single product by ID from the external API
 */
export function useExternalProduct(id: number) {
  return useQuery<Product>(
    [...EXTERNAL_QUERY_KEYS.products, id.toString()],
    () => externalApi.get(`products/${id}`), // Adjust this endpoint to match your external API
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
      enabled: !!id, // Only run the query if we have an ID
    },
  );
}
