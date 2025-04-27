import { useMutation as useTanstackMutation } from "@tanstack/react-query";
import type {
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

/**
 * Custom hook that wraps Tanstack Query's useMutation with better typing
 */
export function useMutation<TData, TError = Error, TVariables = void, TContext = unknown>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: Omit<
    UseMutationOptions<TData, TError, TVariables, TContext>,
    "mutationFn"
  >
): UseMutationResult<TData, TError, TVariables, TContext> {
  return useTanstackMutation<TData, TError, TVariables, TContext>({
    mutationFn,
    ...options,
  });
} 