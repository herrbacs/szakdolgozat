export type LoginRequest = {
  identifier: string
  password: string
}

export type LoginResponse = {
  access_token: string
  refresh_token: string
}

export type RegisterRequest = {
  email: string
  username: string
  password: string
}

export type RefreshRequest = {
  refresh_token: string
}

export type RefreshResponse = {
  access_token: string
  refresh_token: string
}
