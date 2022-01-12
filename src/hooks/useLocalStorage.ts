import { useEffect, useState } from "react"
import { EventEmitter } from "events"

const localStorageEmitter = new EventEmitter()

const getStorageValue = <T>(key: string | null, defaultValue: T) => {
  if (!key) {
    return defaultValue
  }
  const item = window.localStorage.getItem(key)
  return item ? JSON.parse(item) : defaultValue
}

export const useLocalStorage = <T>(
  key: string | null,
  defaultValue: T
): [T, (value: T) => void] => {
  const [value, setValue] = useState(getStorageValue(key, defaultValue))

  useEffect(() => {
    if (key) {
      try {
        setValue(getStorageValue(key, defaultValue))
      } catch (error) {
        console.error(`Could not read local storage key  "${key}":`, error)
        setValue(defaultValue)
      }
    }
    // eslint-disable-next-line
  }, [key, JSON.stringify(defaultValue)])

  useEffect(() => {
    if (key) {
      localStorageEmitter.emit("value_changed", key, value)
      localStorage.setItem(key, JSON.stringify(value))
    }
    // eslint-disable-next-line
  }, [key, JSON.stringify(value)])

  useEffect(() => {
    const callback = (emittedKey: string, value: T) => {
      if (key === emittedKey) {
        setValue(value)
      }
    }
    localStorageEmitter.on("value_changed", callback)

    return () => {
      localStorageEmitter.off("value_changed", callback)
    }
  }, [key])

  return [value, setValue]
}
