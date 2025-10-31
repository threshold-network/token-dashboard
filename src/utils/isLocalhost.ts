/**
 * Check if the current environment is localhost/development
 * @return {boolean} True if running on localhost
 */
export const isLocalhost = (): boolean => {
  if (typeof window === "undefined") return false

  const hostname = window.location.hostname
  return (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname === "0.0.0.0" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.endsWith(".local")
  )
}
