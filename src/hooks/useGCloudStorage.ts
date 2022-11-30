import { useCallback } from "react"

const bucket = "threshold_dapp_feedback"

const useGCloudStorage: () => (file: File) => Promise<string> = () => {
  return useCallback(async (file) => {
    const formData = new FormData()

    formData.append("file", file)
    formData.append("key", file.name)

    return fetch(`https://storage.googleapis.com/${bucket}`, {
      method: "POST",
      body: formData,
    }).then((resp) => {
      return `https://storage.cloud.google.com/${bucket}/${file.name}`
    })
  }, [])
}

export default useGCloudStorage
