import { API_BASE_URL } from "../shared/urls"
import type { RefreshResponse } from "./types/auth"
import { AuthTokens, authTokenStorage } from "../store/tokenStorage"

let onAuthFailed: ((reason?: string) => void) | null = null
export function setOnAuthFailed(cb: (reason?: string) => void) {
  onAuthFailed = cb
}

export class HttpError extends Error {
  status: number

  constructor(status: number, message?: string) {
    super(message ?? `HTTP ${status}`)
    this.status = status
    this.name = "HttpError"
  }
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64 + "===".slice((base64.length + 3) % 4)
  return atob(padded)
}

export function isJwtExpired(token: string): boolean {
  try {
    const payloadPart = token.split(".")[1]
    if (!payloadPart) return true

    const payload = JSON.parse(base64UrlDecode(payloadPart))
    const expSec = payload?.exp
    if (typeof expSec !== "number") return true

    const now = Date.now()
    const expiry = expSec * 1000

    const safety = 60 * 1000
    return expiry - safety < now
  } catch {
    return true
  }
}


let refreshInFlight: Promise<boolean> | null = null

async function refreshOnce(): Promise<boolean> {
  if (refreshInFlight) return refreshInFlight

  refreshInFlight = (async () => {
    const tokens = authTokenStorage.get()
    if (!tokens?.refreshToken) {
      return false
    }

    try {
      const response = await fetchJson(
        `${API_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          body: { refresh_token: tokens.refreshToken },
        },
        {
          tokenMode: "none",
          handle401: "none",
          retryOn401: false,
        }
      )

      if (!response.ok) {
        return false
      }

      const data: RefreshResponse = await response.json()

      authTokenStorage.set({
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
      } as AuthTokens)

      return true
    } catch {
      return false
    } finally {
      refreshInFlight = null
    }
  })()

  return refreshInFlight
}

type FetchJsonOptions = Omit<RequestInit, "body"> & {
  body?: unknown
}

type FetchJsonConfig = {
  /**
   * tokenMode:
   * - "auto": storage-ből veszi az access tokent és teszi headerbe (default)
   * - "none": nem tesz Authorization headert
   */
  tokenMode?: "auto" | "none"

  /**
   * handle401:
   * - "logout": auth failed callback + error (default)
   * - "none": nem csinál semmit extra 401-re, csak visszaadja / dobja az error-t a callernek
   */
  handle401?: "logout" | "none"

  /**
   * retryOn401:
   * - true: 401 esetén 1x refresh+retry (default)
   * - false: nem retry-ol
   */
  retryOn401?: boolean
}

async function fetchJson(
  url: string,
  options: FetchJsonOptions,
  config: FetchJsonConfig = {},
  _didRetry: boolean = false
): Promise<Response> {
  const tokenMode = config.tokenMode ?? "auto"
  const handle401 = config.handle401 ?? "logout"
  const retryOn401 = config.retryOn401 ?? true

  let accessToken: string | undefined

  if (tokenMode === "auto") {
    accessToken = authTokenStorage.get()?.accessToken

    // pre-flight refresh, ha van token és lejáróban
    if (accessToken && isJwtExpired(accessToken)) {
      const ok = await refreshOnce()
      if (ok) {
        accessToken = authTokenStorage.get()?.accessToken
      }
    }
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }

  if (tokenMode === "auto" && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`
  }

  const mergedHeaders = {
    ...headers,
    ...(options.headers as Record<string, string> | undefined),
  }
  const { body, ...rest } = options

  const init: RequestInit = {
    ...rest,
    headers: mergedHeaders,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  }

  const response = await fetch(url, init)
  if (
    response.status === 401 &&
    retryOn401 &&
    !_didRetry &&
    tokenMode === "auto"
  ) {
    const ok = await refreshOnce()
    if (ok) {
      return fetchJson(url, options, config, true)
    }
  }

  if (response.status === 401 && handle401 === "logout") {
    try {
      ;(authTokenStorage as any).clear?.()
    } catch {
      // ignore
    }

    onAuthFailed?.("Unauthorized")
    throw new HttpError(401, "Unauthorized")
  }

  return response
}

// ----------------------- Public API -----------------------

export async function get(url: string): Promise<Response> {
  return fetchJson(url, { method: "GET" })
}

export async function post(url: string, body?: unknown): Promise<Response> {
  return fetchJson(url, { method: "POST", body })
}

export async function put(url: string, body?: unknown): Promise<Response> {
  return fetchJson(url, { method: "PUT", body })
}

export async function del(url: string, body?: unknown): Promise<Response> {
  return fetchJson(url, { method: "DELETE", body })
}

export async function publicGet(url: string): Promise<Response> {
  return fetchJson(url, { method: "GET" }, { tokenMode: "none", handle401: "none", retryOn401: false })
}

export async function publicPost(url: string, body?: unknown): Promise<Response> {
  return fetchJson(
    url,
    { method: "POST", body },
    { tokenMode: "none", handle401: "none", retryOn401: false }
  )
}

// Convenience: API_BASE_URL-os path-okhoz
export const api = {
  get: (path: string) => get(`${API_BASE_URL}${path}`),
  post: (path: string, body?: unknown) => post(`${API_BASE_URL}${path}`, body),
  put: (path: string, body?: unknown) => put(`${API_BASE_URL}${path}`, body),
  del: (path: string, body?: unknown) => del(`${API_BASE_URL}${path}`, body),

  publicGet: (path: string) => publicGet(`${API_BASE_URL}${path}`),
  publicPost: (path: string, body?: unknown) =>
    publicPost(`${API_BASE_URL}${path}`, body),
}