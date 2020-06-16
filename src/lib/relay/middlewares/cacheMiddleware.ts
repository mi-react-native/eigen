import { captureMessage } from "@sentry/react-native"
import { MiddlewareNextFn, RelayNetworkLayerRequest } from "react-relay-network-modern/node8"
import { CacheConfig as RelayCacheConfig, RequestParameters } from "relay-runtime"
import * as cache from "../../NativeModules/GraphQLQueryCache"

type Mutable<T> = { -readonly [P in keyof T]: T[P] } // Remove readonly
type GraphQLRequestOperation = Mutable<RequestParameters>

interface CacheConfig extends RelayCacheConfig {
  emissionCacheTTLSeconds?: number
}

export type GraphQLRequest = RelayNetworkLayerRequest & {
  cacheConfig: CacheConfig
  operation: GraphQLRequestOperation
  variables: Record<any, any>
}

const IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST = ["ArtworkMarkAsRecentlyViewedQuery"]

export const cacheMiddleware = () => {
  return (next: MiddlewareNextFn) => async (req: GraphQLRequest) => {
    const { cacheConfig, operation, variables } = req
    const isQuery = operation.operationKind === "query"
    const queryID = operation.id

    // If we have valid data in cache return
    if (isQuery && !cacheConfig.force) {
      // @ts-ignore STRICTNESS_MIGRATION
      const dataFromCache = await cache.get(queryID, variables)
      if (dataFromCache) {
        return JSON.parse(dataFromCache)
      }
    }

    // @ts-ignore STRICTNESS_MIGRATION
    cache.set(queryID, variables, null)

    // Get query body either from local queryMap or
    // send queryID to metaphysics
    let body: { variables?: object; query?: string; documentID?: string } = {}
    if (__DEV__) {
      // @ts-ignore STRICTNESS_MIGRATION
      body = { query: require("../../../../data/complete.queryMap.json")[queryID], variables }
      req.operation.text = body.query ?? null
    } else {
      // @ts-ignore STRICTNESS_MIGRATION
      body = { documentID: queryID, variables }
    }

    if (body && (body.query || body.documentID)) {
      req.fetchOpts.body = JSON.stringify(body)
    }

    let response: any
    try {
      response = await next(req)
    } catch (e) {
      if (!__DEV__ && e.toString().includes("Unable to serve persisted query with ID")) {
        // this should not happen normally, but let's try again with full query text to avoid ruining the user's day?
        captureMessage(e.stack)
        // @ts-ignore STRICTNESS_MIGRATION
        body = { query: require("../../../../data/complete.queryMap.json")[queryID], variables }
        req.fetchOpts.body = JSON.stringify(body)
        response = await next(req)
      } else {
        throw e
      }
    }

    const clearCache = () => {
      // @ts-ignore STRICTNESS_MIGRATION
      cache.clear(queryID, req.variables)
    }

    if (response.status >= 200 && response.status < 300) {
      if (isQuery) {
        // Don't cache responses with errors in them (GraphQL responses are always 200, even if they contain errors).
        if (response.json.errors === undefined) {
          // @ts-ignore STRICTNESS_MIGRATION
          cache.set(queryID, req.variables, JSON.stringify(response.json), req.cacheConfig.emissionCacheTTLSeconds)
        } else {
          clearCache()
          return response
        }
      } else {
        // Clear the entire cache if a mutation is made (unless it's in the allowlist).
        if (!IGNORE_CACHE_CLEAR_MUTATION_ALLOWLIST.includes(req.operation.name)) {
          cache.clearAll()
        }
      }
      return response
    } else {
      clearCache()
      return response
    }
  }
}
