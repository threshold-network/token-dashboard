import { useLocalStorage as useRehooksLocalStorage } from "@rehooks/local-storage"

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
  return useRehooksLocalStorage(key, defaultValue)
}
