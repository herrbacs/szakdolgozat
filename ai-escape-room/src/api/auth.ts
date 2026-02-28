import { StatusCodes } from "http-status-codes";
import { API_BASE_URL } from "../shared/urls"
import { post } from "./api"
import type { LoginRequest, LoginResponse } from "./types/auth"
import { AuthTokens, authTokenStorage } from "../store/tokenStorage";

export async function tryLogin(
  credentials: LoginRequest,
  setError: React.Dispatch<React.SetStateAction<string | null>>
): Promise<boolean> {
  try {
    const response = await post(`${API_BASE_URL}/auth/login`, credentials);

    if (!response.ok) {
      if (response.status === StatusCodes.UNAUTHORIZED) {
        setError("Invalid email/username or password");
        return false;
      }

      setError("An error occurred while logging in");
      return false;
    }

    const data: LoginResponse = await response.json();
    authTokenStorage.set({
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
    } as AuthTokens);

    return true;
  } catch (err) {
    setError("An error occurred while logging in");
    return false;
  }
}
