export function decodeVapidPublicKey(value: string): Uint8Array<ArrayBuffer> {
  const padding = '='.repeat((4 - value.length % 4) % 4)
  const base64 = `${value}${padding}`
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const binary = window.atob(base64)

  return Uint8Array.from(binary, character => character.charCodeAt(0))
}
