export const downloadFile = (
  data: string,
  fileName: string,
  fileType: string
) => {
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
