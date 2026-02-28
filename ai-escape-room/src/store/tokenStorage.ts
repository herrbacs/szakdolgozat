const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"

export type AuthTokens = {
  accessToken: string
  refreshToken: string
}

export const authTokenStorage = {
  get(): AuthTokens | null {
    const accessToken = sessionStorage.getItem(ACCESS_KEY)
    const refreshToken = sessionStorage.getItem(REFRESH_KEY)
    if (!accessToken || !refreshToken) return null
    return { accessToken, refreshToken }
  },

  set(tokens: AuthTokens) {
    sessionStorage.setItem(ACCESS_KEY, tokens.accessToken)
    sessionStorage.setItem(REFRESH_KEY, tokens.refreshToken)
  },

  clear() {
    sessionStorage.removeItem(ACCESS_KEY)
    sessionStorage.removeItem(REFRESH_KEY)
  },
}