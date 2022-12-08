import { act } from "@testing-library/react"
import { renderHook } from "@testing-library/react-hooks"
import { useLocalStorage } from "../useLocalStorage"

describe("Test `useLocalStorage` hook", () => {
  const key = "key"
  const value = { test: "0" }
  let mockedLocalStorageState: { [key: string]: string } = {}
  let setItemSpy: jest.SpyInstance
  let getItemSpy: jest.SpyInstance

  beforeEach(() => {
    mockedLocalStorageState = {}
    getItemSpy = jest
      .spyOn(Storage.prototype, "getItem")
      .mockImplementation((key: string) => {
        return mockedLocalStorageState[key]
      })

    setItemSpy = jest
      .spyOn(Storage.prototype, "setItem")
      .mockImplementation((key: string, value: string) => {
        mockedLocalStorageState[key] = value
      })
  })

  test("should return default value", () => {
    const { result } = renderHook(() => useLocalStorage(key, value))

    expect(result.current[0]).toEqual(value)
    expect(getItemSpy).toHaveBeenCalledWith(key)
  })

  test("should save data in local storage and return updated value", () => {
    const existingValue = { test: "123" }
    const stringifiedExistingValue = JSON.stringify(existingValue)
    const newValue = { test: "500" }

    // Simulate that the value exists in local storage.
    localStorage.setItem(key, stringifiedExistingValue)

    const { result } = renderHook(() => useLocalStorage(key, value))

    expect(result.current[0]).toEqual(existingValue)
    expect(getItemSpy).toHaveBeenCalledWith(key)

    act(() => {
      result.current[1](newValue)
    })

    expect(setItemSpy).toHaveBeenLastCalledWith(key, JSON.stringify(newValue))
    expect(result.current[0]).toEqual(newValue)
    expect(mockedLocalStorageState[key]).toEqual(JSON.stringify(newValue))
  })

  test("should not override storage data by a default value if use hook second time", () => {
    const newValue = { test: "999" }
    const { result } = renderHook(() => useLocalStorage(key, value))

    act(() => {
      result.current[1](newValue)
    })

    const { result: result2 } = renderHook(() => useLocalStorage(key, value))

    expect(result.current[0]).toEqual(newValue)
    expect(result2.current[0]).toEqual(newValue)
    expect(result.current[0]).toEqual(result2.current[0])
    expect(mockedLocalStorageState[key]).toEqual(JSON.stringify(newValue))
  })

  test("can have a numeric default value", () => {
    const value = 12
    const key = "numeric-value"
    const { result } = renderHook(() => useLocalStorage(key, value))

    expect(result.current[0]).toEqual(value)
  })

  test("can have a string default value", () => {
    const value = "string"
    const key = "string-value"
    const { result } = renderHook(() => useLocalStorage(key, value))

    expect(result.current[0]).toEqual(value)
  })
})
