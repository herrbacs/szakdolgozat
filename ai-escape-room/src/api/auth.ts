import { StatusCodes } from "http-status-codes"
import { API_BASE_URL } from "../shared/urls"
import { post } from "./api"
import type { LoginRequest, LoginResponse, RegisterRequest } from "./types/auth"
import type { RefreshResponse } from "./types/auth"
import { AuthTokens, authTokenStorage } from "../store/tokenStorage"

export async function tryLogin(
  payload: LoginRequest,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> {
  try {
    const response = await post(`${API_BASE_URL}/auth/login`, payload)

    if (!response.ok) {
      if (response.status === StatusCodes.UNAUTHORIZED) {
        setError("Invalid email/username or password")
        return false
      }

      setError("An error occurred while logging in")
      return false
    }

    const data: LoginResponse = await response.json()
    authTokenStorage.set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    } as AuthTokens)

    return true
  } catch (err) {
    setError("An error occurred while logging in")
    return false
  }
}

export async function tryRefresh(): Promise<boolean> {
  const tokens = authTokenStorage.get()
  if (!tokens?.refreshToken) {
    return false
  }

  try {
    const response = await post(
      `${API_BASE_URL}/auth/refresh-token`,
      { refresh_token: tokens.refreshToken }
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
  }
}

export async function tryRegister(
  payload: RegisterRequest,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> {
  try {
    const response = await post(`${API_BASE_URL}/auth/register`, payload)

    if (!response.ok) {
      if (response.status === StatusCodes.CONFLICT) {
        setError("Email or username already exists")
        return false
      }

      setError("An error occurred while registering")
      return false
    }

    return true
  } catch (err) {
    setError("An error occurred while registering")
    return false
  }
}
