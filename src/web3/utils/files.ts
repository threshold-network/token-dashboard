import { safeToString } from "../../utils/sdkDebugger"

/**
 * Safely download JSON data as a file
 * @param {any} data - The data to download (object or string)
 * @param {string} fileName - Name of the file to download
 * @param {string} fileType - Type of the file (e.g. 'text/json')
 */
export const safeDownloadJSON = (
  data: any,
  fileName: string,
  fileType: string = "text/json"
) => {
  try {
    // If data is an object, ensure all properties are safe strings
    let jsonData: string

    if (typeof data === "string") {
      // If already a string, verify it's valid JSON
      try {
        // Parse and re-stringify to validate and normalize
        JSON.parse(data)
        jsonData = data
      } catch (e) {
        console.warn("Invalid JSON string provided to safeDownloadJSON:", e)
        // Fallback to safe stringification of the original data
        jsonData = JSON.stringify({ data: safeToString(data) })
      }
    } else {
      // If object, recursively convert any nested properties
      const sanitizedData = sanitizeObjectForJSON(data)
      jsonData = JSON.stringify(sanitizedData)
    }

    // Create a blob with the data we want to download as a file
    const blob = new Blob([jsonData], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a")
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  } catch (error) {
    console.error("Failed to download file:", error)
    // Provide a fallback simple download with just the critical data
    try {
      const fallbackData = JSON.stringify({
        error: "Original data could not be processed",
        simpleData: safeToString(data, "Data unavailable"),
      })
      const blob = new Blob([fallbackData], { type: fileType })
      const a = document.createElement("a")
      a.download = `error_${fileName}`
      a.href = window.URL.createObjectURL(blob)
      a.click()
      a.remove()
    } catch (e) {
      console.error("Even fallback download failed:", e)
    }
  }
}

/**
 * Recursively sanitize an object for JSON serialization
 * Handles undefined values, circular references, etc.
 * @param {any} obj - The object to sanitize.
 * @param {Set<any>} seen - A set of already seen objects to detect circular references.
 * @return {any} The sanitized object, suitable for JSON.stringify.
 */
function sanitizeObjectForJSON(obj: any, seen = new Set<any>()): any {
  // Handle primitive types
  if (obj === null || obj === undefined) return null
  if (typeof obj !== "object") return safeToString(obj)

  // Handle circular references
  if (seen.has(obj)) return "[Circular Reference]"
  seen.add(obj)

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map((item) => sanitizeObjectForJSON(item, new Set(seen)))
  }

  // Handle objects
  const result: any = {}
  for (const [key, value] of Object.entries(obj)) {
    // Skip function properties
    if (typeof value === "function") continue

    try {
      result[key] = sanitizeObjectForJSON(value, new Set(seen))
    } catch (e) {
      // If anything fails, use a safe string representation
      result[key] = safeToString(value, `[Error: Could not process ${key}]`)
    }
  }

  return result
}

export const downloadFile = (
  data: string,
  fileName: string,
  fileType: string
) => {
  try {
    // Create a blob with the data we want to download as a file
    const blob = new Blob([data], { type: fileType })
    // Create an anchor element and dispatch a click event on it
    // to trigger a download
    const a = document.createElement("a")
    a.download = fileName
    a.href = window.URL.createObjectURL(blob)
    const clickEvt = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    })
    a.dispatchEvent(clickEvt)
    a.remove()
  } catch (error) {
    console.error("Failed to download file:", error)
  }
}

export class InvalidJSONFileError extends Error {
  constructor() {
    super("Invalid .JSON file.")
  }
}

const tryParseJSON = (data: string) => {
  return new Promise((resolve, reject) => {
    try {
      resolve(JSON.parse(data))
    } catch (error) {
      console.error("Failed to parse JSON object: ", error)
      reject(new InvalidJSONFileError())
    }
  })
}

export async function parseJSONFile(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) =>
      tryParseJSON(event?.target?.result?.toString() ?? "")
        .then(resolve)
        .catch(reject)
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsText(file)
  })
}
