export interface CreateTokenRequest {
  email: string
  password: string
}

export interface CreateTokenResponse {
  access_token: string
  refresh_token: string
}
