import Cookies from 'js-cookie'
import Token from '../types/token'

const ACCESS_COOKIE = 'MINDPILL_TOKEN'
const REFRESH_COOKIE = 'MINDPILL_REFRESH_TOKEN'

export function getCookieToken(): Token | null {
  const accessToken = Cookies.get(ACCESS_COOKIE)
  const refreshToken = Cookies.get(REFRESH_COOKIE)
  if (accessToken == null || refreshToken == null) {
    return null
  }
  return {
    access: accessToken,
    refresh: refreshToken
  }
}

export function setCookieToken(token: Token) {
  Cookies.set(ACCESS_COOKIE, token.access)
  Cookies.set(REFRESH_COOKIE, token.refresh)
}

export function clearCookieToken() {
  Cookies.remove(ACCESS_COOKIE)
  Cookies.remove(REFRESH_COOKIE)
}
