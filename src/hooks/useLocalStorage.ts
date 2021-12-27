import { useEffect, useState } from "react"
import { EventEmitter } from "events"

const localStorageEmittetr = new EventEmitter()

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
      localStorageEmittetr.emit("value_changed", key, value)
      localStorage.setItem(key, JSON.stringify(value))
    }
    // eslint-disable-next-line
  }, [key, JSON.stringify(value)])

  useEffect(() => {
    const cb = (emittedKey: string, value: T) => {
      if (key === emittedKey) {
        setValue(value)
      }
    }
    localStorageEmittetr.on("value_changed", cb)

    return () => {
      localStorageEmittetr.off("value_changed", cb)
    }
  }, [key])

  return [value, setValue]
}
