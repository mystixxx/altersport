import { useQuery as useTanstackQuery } from "@tanstack/react-query";
import type {
  UseQueryOptions,
  UseQueryResult,
} from "@tanstack/react-query";

/**
 * Custom hook that wraps Tanstack Query's useQuery with better typing
 */
export function useQuery<TData, TError = Error>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, TError, TData>, "queryKey" | "queryFn">
): UseQueryResult<TData, TError> {
  return useTanstackQuery<TData, TError>({
    queryKey,
    queryFn,
    ...options,
  });
} 