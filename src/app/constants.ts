export const LOGIN_URL = `${import.meta.env.VITE_BASE_API_URL}/login`

export function getLoginUrl() {
  const loginUrl = new URL(LOGIN_URL)

  if (typeof window !== 'undefined') {
    loginUrl.searchParams.set('redirect', window.location.href)
  }

  return loginUrl.toString()
}
