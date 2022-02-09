import { act, renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { BigNumber } from "@ethersproject/bignumber"
import { useSubscribeToERC20TransferEvent } from "../useSubscribeToERC20TransferEvent"
import { EventEmitter } from "events"
import { Token } from "../../../enums"
import { useToken } from "../../../hooks/useToken"
import { useTokenBalance } from "../../../hooks/useTokenBalance"
import { useTokenState } from "../../../hooks/useTokenState"

jest.mock("@web3-react/core", () => ({
  ...(jest.requireActual("@web3-react/core") as {}),
  useWeb3React: jest.fn(),
}))

jest.mock("../../../hooks/useToken", () => ({
  useToken: jest.fn(),
}))

jest.mock("../../../hooks/useTokenBalance", () => ({
  useTokenBalance: jest.fn(),
}))

jest.mock("../../../hooks/useTokenState", () => ({
  useTokenState: jest.fn(),
}))

describe("Test `useSubscribeToERC20TransferEvent` hook", () => {
  const account = "0x086813525A7dC7dafFf015Cdf03896Fd276eab60"
  const from = "0x407C3329eA8f6BEFB984D97AE4Fa71945E43170b"
  const to = "0xB16c8252091599dBA492D51d845caDa42b7915C1"
  const value = "10000000000000000000" // 10
  const currentTokenBalance = "100000000000000000000" // 100
  const token = Token.Keep

  const contractEventEmitter = new EventEmitter()
  const providerEventEmitter = new EventEmitter()

  const mockedSetTokenBalance = jest.fn()
  const mockedContract: any = {
    on: jest.fn(),
    off: jest.fn(),
    filters: {
      ["Transfer"]: jest.fn(),
    },
    provider: {
      once: jest.fn(),
      off: jest.fn(),
    },
  }

  beforeEach(() => {
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
    ;(useWeb3React as jest.Mock).mockReturnValue({ account, active: true })
    ;(useToken as jest.Mock).mockReturnValue({ contract: mockedContract })
    ;(useTokenBalance as jest.Mock).mockReturnValue(currentTokenBalance)
    ;(useTokenState as jest.Mock).mockReturnValue({
      setTokenBalance: mockedSetTokenBalance,
    })
  })

  test("should catch an event and update the token balance if the tokens have been transferred to current account", () => {
    const expectedBalance = BigNumber.from(currentTokenBalance)
      .add(BigNumber.from(value))
      .toString()

    renderHook(() => useSubscribeToERC20TransferEvent(token))

    act(() => {
      providerEventEmitter.emit("block", 1)
    })
    act(() => {
      contractEventEmitter.emit("Transfer", from, account, value)
    })

    expect(mockedSetTokenBalance).toHaveBeenCalledWith(token, expectedBalance)
  })

  test("should catch an event and update the token balance if the tokens have been transferred from current account", () => {
    const expectedBalance = BigNumber.from(currentTokenBalance)
      .sub(BigNumber.from(value))
      .toString()

    renderHook(() => useSubscribeToERC20TransferEvent(token))

    act(() => {
      providerEventEmitter.emit("block", 1)
    })
    act(() => {
      contractEventEmitter.emit("Transfer", account, to, value)
    })

    expect(mockedSetTokenBalance).toHaveBeenCalledWith(token, expectedBalance)
  })

  test("should omit an event if event is not addressed to current account", () => {
    renderHook(() => useSubscribeToERC20TransferEvent(token))

    act(() => {
      providerEventEmitter.emit("block", 1)
    })
    act(() => {
      contractEventEmitter.emit("Transfer", from, to, value)
    })

    expect(mockedSetTokenBalance).not.toHaveBeenCalled()
  })
})
