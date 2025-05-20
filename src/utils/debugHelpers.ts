/**
 * Cross-chain debugging utilities
 */

/**
 * Debug helper to inspect Map keys with case-sensitive comparison
 *
 * @param {Map<any, any>} map - The Map object to inspect
 * @param {string} searchKey - The key we're trying to access
 * @return {string} A debug message with details about the Map and key matching
 */
export function inspectMapKeys(map: Map<any, any>, searchKey: string): string {
  if (!map) return "Map is undefined or null"
  if (map.size === 0) return "Map is empty"

  const keys = Array.from(map.keys())
  const exactMatch = keys.find((k) => k === searchKey)
  const caseInsensitiveMatch = keys.find(
    (k) =>
      typeof k === "string" &&
      typeof searchKey === "string" &&
      k.toLowerCase() === searchKey.toLowerCase()
  )

  let result = `Map has ${map.size} entries.\nKeys: ${JSON.stringify(keys)}\n`
  result += `Searching for key: "${searchKey}"\n`

  if (exactMatch) {
    result += `✓ EXACT MATCH FOUND: "${exactMatch}"\n`
  } else {
    result += `✗ No exact match found for "${searchKey}"\n`
  }

  if (caseInsensitiveMatch && caseInsensitiveMatch !== exactMatch) {
    result += `⚠️ CASE-INSENSITIVE MATCH FOUND: "${caseInsensitiveMatch}"\n`
    result += `Try using this key instead: "${caseInsensitiveMatch}"\n`
  }

  return result
}

/**
 * Case-insensitive Map lookup helper
 * Attempts to find a key in a Map using case-insensitive matching
 *
 * @param {Map<any, any>} map - The Map to search in
 * @param {string} searchKey - The key to search for
 * @return {any} The value if found, undefined if not found
 */
export function findInMapCaseInsensitive(
  map: Map<any, any>,
  searchKey: string
): any {
  if (!map || map.size === 0 || !searchKey) return undefined

  // First try direct access
  if (map.has(searchKey)) return map.get(searchKey)

  // Then try case-insensitive lookup
  for (const [key, value] of map.entries()) {
    if (
      typeof key === "string" &&
      key.toLowerCase() === searchKey.toLowerCase()
    ) {
      return value
    }
  }

  return undefined
}
