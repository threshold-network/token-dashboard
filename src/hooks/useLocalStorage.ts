import { useEffect, useState } from "react"

const getStorageValue = <T>(key: string, defaultValue: T) => {
  const item = window.localStorage.getItem(key)
  return item ? JSON.parse(item) : defaultValue
}

export const useLocalStorage = <T>(
  key: string | null,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState(defaultValue)

  useEffect(() => {
    if (key) {
      try {
        setValue(getStorageValue(key, defaultValue))
      } catch (error) {
        console.error(`Could not read local storage key  "${key}":`, error)
        setValue(defaultValue)
      }
    }
  }, [key, defaultValue])

  useEffect(() => {
    if (key) {
      localStorage.setItem(key, JSON.stringify(value))
    }
  }, [key, value])

  return [value, setValue]
}
