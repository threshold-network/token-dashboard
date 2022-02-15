import { act, renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { useSubscribeToContractEvent } from "../useSubscribeToContractEvent"
import { EventEmitter } from "events"

jest.mock("@web3-react/core", () => ({
  ...(jest.requireActual("@web3-react/core") as {}),
  useWeb3React: jest.fn(),
}))

describe("Test `useSubscribeToContractEvent` hook", () => {
  const eventName = "Transfer"
  const from = "0x407C3329eA8f6BEFB984D97AE4Fa71945E43170b"
  const to = "0xB16c8252091599dBA492D51d845caDa42b7915C1"
  const value = "1"

  const contractEventEmitter = new EventEmitter()
  const providerEventEmitter = new EventEmitter()

  const mockedCallback = jest.fn()
  const mockedCallback2 = jest.fn()

  const mockedContract: any = {
    on: jest.fn(),
    off: jest.fn(),
    filters: {
      [eventName]: jest.fn(),
    },
    provider: {
      once: jest.fn(),
      off: jest.fn(),
    },
  }

  beforeEach(() => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      active: true,
    })

    // Clear listeners
    contractEventEmitter.removeAllListeners()
    providerEventEmitter.removeAllListeners()

    // Setup mocked implementation
    mockedContract.provider.once.mockImplementation((eventName, callback) => {
      providerEventEmitter.once(eventName, callback)
    })
    mockedContract.provider.off.mockImplementation((eventName, callback) => {
      providerEventEmitter.removeListener(eventName, callback)
    })
    mockedContract.off.mockImplementation((eventName, callback) => {
      contractEventEmitter.removeListener(eventName, callback)
    })
    mockedContract.on.mockImplementation((eventName, callback) => {
      contractEventEmitter.addListener(eventName, callback)
    })
  })

  test("should do nothing if a contract is not defined", () => {
    const { unmount } = renderHook(() =>
      useSubscribeToContractEvent(null, eventName, mockedCallback)
    )

    expect(mockedCallback).not.toHaveBeenCalled()
    expect(mockedContract.on).not.toHaveBeenCalled()
    expect(mockedContract.provider.once).not.toHaveBeenCalled()
    unmount()
    expect(mockedContract.off).not.toHaveBeenCalled()
    expect(mockedContract.provider.off).not.toHaveBeenCalled()
  })

  test("should do nothing if a user is not connected to a wallet", () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      active: false,
    })

    const { unmount } = renderHook(() =>
      useSubscribeToContractEvent(mockedContract, eventName, mockedCallback)
    )

    expect(mockedCallback).not.toHaveBeenCalled()
    expect(mockedContract.on).not.toHaveBeenCalled()
    expect(mockedContract.provider.once).not.toHaveBeenCalled()
    unmount()
    expect(mockedContract.off).not.toHaveBeenCalled()
    expect(mockedContract.provider.off).not.toHaveBeenCalled()
  })

  test("should off subscription correctly", () => {
    const { unmount } = renderHook(() =>
      useSubscribeToContractEvent(mockedContract, eventName, mockedCallback)
    )

    unmount()
    expect(mockedContract.off).toHaveBeenCalledWith(
      eventName,
      expect.any(Function)
    )
    expect(mockedContract.provider.off).toHaveBeenCalledWith(
      "block",
      expect.any(Function)
    )
  })

  test("should start subscription to an event", async () => {
    renderHook(() =>
      useSubscribeToContractEvent(mockedContract, eventName, mockedCallback)
    )

    expect(mockedContract.provider.once).toHaveBeenCalledWith(
      "block",
      expect.any(Function)
    )

    act(() => {
      providerEventEmitter.emit("block", 1)
    })

    expect(mockedContract.on).toHaveBeenCalledWith(
      eventName,
      expect.any(Function)
    )
    act(() => {
      contractEventEmitter.emit(eventName, from, to, value)
    })
    expect(mockedCallback).toHaveBeenCalledWith(from, to, value)
  })

  test("should start subscription to an event based on the indexed params", () => {
    const mockedFilterResult = "0x0"
    const indexedFilterParams = [null, to]
    mockedContract.filters[eventName].mockReturnValue(mockedFilterResult)

    renderHook(() =>
      useSubscribeToContractEvent(
        mockedContract,
        eventName,
        mockedCallback,
        indexedFilterParams
      )
    )

    expect(mockedContract.filters[eventName]).toHaveBeenCalledWith(
      ...indexedFilterParams
    )

    expect(mockedContract.provider.once).toHaveBeenCalledWith(
      "block",
      expect.any(Function)
    )

    act(() => {
      providerEventEmitter.emit("block", 1)
    })

    expect(mockedContract.on).toHaveBeenCalledWith(
      mockedFilterResult,
      expect.any(Function)
    )

    act(() => {
      contractEventEmitter.emit(mockedFilterResult, from, to, value)
    })

    expect(mockedCallback).toHaveBeenCalledWith(from, to, value)
  })

  test("should call updated callback", () => {
    const { rerender } = renderHook(({ contract, callback }) =>
      useSubscribeToContractEvent(contract, eventName, callback)
    )

    act(() => {
      rerender({ contract: mockedContract, callback: mockedCallback })
    })

    // Update callback.
    act(() => {
      rerender({ contract: mockedContract, callback: mockedCallback2 })
    })

    act(() => {
      providerEventEmitter.emit("block", 1)
    })

    expect(mockedContract.on).toHaveBeenCalledWith(
      eventName,
      expect.any(Function)
    )

    act(() => {
      contractEventEmitter.emit(eventName, from, to, value)
    })

    expect(mockedCallback2).toHaveBeenCalledWith(from, to, value)
  })
})
