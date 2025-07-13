import 'server-only'

import { cache } from 'react'

import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'

import { Effect, Exit } from 'effect'

import { makeQueryClient } from '../react/query-client'
import type { Context } from './createContext'
import { appRouter } from './routers/app'
import { AnyRouter } from '@trpc/server'

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient)

/**
 * Configuration options for creating tRPC instances
 */
export interface TRPCConfig {
  /** The URL for external tRPC server calls */
  externalUrl?: string
  /** Optional headers for external requests */
  headers?: () => Record<string, string>
}

/**
 * Creates a server-side tRPC instance for internal server-to-server calls.
 *
 * This factory function accepts a context directly, avoiding the complexity
 * of Effect-based context resolution. The calling client provides the context
 * which can be created using the existing context creation functions.
 *
 * @param context - The tRPC context to use for this instance
 * @returns Configured server-side tRPC instance
 *
 * @example
 * ```typescript
 * import { createTRPCContextInner } from '@hux/trpc'
 *
 * // Create context first
 * const contextFn = await Effect.runPromise(createTRPCContextInner)
 * const context = await contextFn()
 *
 * // Create tRPC instance with context
 * const trpc = createServerTRPC(context)
 * const result = await trpc.user.getByID.query({ id: 'user123' })
 * ```
 */
export function createServerTRPC(context: Context) {
  return createTRPCOptionsProxy({
    ctx: context,
    router: appRouter,
    queryClient: getQueryClient,
  })
}

/**
 * Creates an external tRPC client for cross-server communication.
 *
 * This client is used when you need to make tRPC calls to a separate server
 * (e.g., microservices, external APIs, or when the tRPC server is hosted
 * on a different domain/port).
 *
 * @param config - Configuration options including URL and headers
 * @returns Configured external tRPC client
 *
 * @example
 * ```typescript
 * const etrpc = createExternalTRPC({
 *   externalUrl: 'https://api.example.com/api/trpc',
 *   headers: () => ({ 'Authorization': 'Bearer token' })
 * })
 * const result = await etrpc.user.getByID.query({ id: 'user123' })
 * ```
 */
export function createExternalTRPC<Router extends AnyRouter>(
  config: Required<Pick<TRPCConfig, 'externalUrl'>> & Pick<TRPCConfig, 'headers'>,
) {
  return createTRPCOptionsProxy<Router>({
    client: createTRPCClient<AnyRouter>({
      links: [
        httpBatchLink({
          url: config.externalUrl,
          headers: config.headers || (() => ({})),
        }),
      ],
    }),
    queryClient: getQueryClient,
  })
}

/**
 * Helper function to safely execute tRPC operations with proper error handling.
 *
 * @param operation - The tRPC operation to execute
 * @returns Promise that resolves to the operation result or rejects with an error
 */
export async function executeTRPCOperation<T>(operation: Effect.Effect<T, Error>): Promise<T> {
  const exit = await Effect.runPromiseExit(operation)

  if (Exit.isFailure(exit)) {
    console.error('tRPC operation failed:', exit.cause)
    throw new Error(`tRPC operation failed: ${exit.cause}`)
  }

  return exit.value
}

/**
 * Type-safe wrapper for the server-side tRPC instance.
 * This ensures proper typing when using the tRPC instance.
 */
export type ServerTRPC = ReturnType<typeof createTRPCOptionsProxy>

/**
 * Type-safe wrapper for the external tRPC client.
 */
export type ExternalTRPC = ReturnType<typeof createTRPCOptionsProxy>
