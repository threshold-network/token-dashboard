import { renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { getSigner } from "../../../utils/getContract"
import { useSendTransaction } from "../useSendTransaction"
import { ModalType, TransactionStatus } from "../../../enums"
import { useModal } from "../../../hooks/useModal"

jest.mock("@web3-react/core", () => ({
  ...(jest.requireActual("@web3-react/core") as {}),
  useWeb3React: jest.fn(),
}))

jest.mock("../../../utils/getContract", () => ({
  ...(jest.requireActual("../../../utils/getContract") as {}),
  getSigner: jest.fn(),
}))

jest.mock("../../../hooks/useModal", () => ({
  ...(jest.requireActual("../../../hooks/useModal") as {}),
  useModal: jest.fn(),
}))

describe("Test `useSendTransaction` hook", () => {
  const methodName = "Transfer"
  const mockedLibrary = {}
  const account = "0x086813525A7dC7dafFf015Cdf03896Fd276eab60"
  const txHash = "0x0"
  const receipt = {}
  const from = "0x407C3329eA8f6BEFB984D97AE4Fa71945E43170b"
  const value = "1000000000000000000"
  const mockedTx = {
    wait: jest.fn().mockResolvedValue(receipt),
    hash: txHash,
  }
  const MockedContract = jest.fn().mockImplementation(() => {
    return {
      connect: jest.fn(),
      [methodName]: jest.fn(),
    }
  })
  const mockedContract = new MockedContract()

  const mockedOpenModalFn = jest.fn()

  const mockedSigner = {}
  const userRejectedErrMsg =
    "MetaMask Tx Signature: User denied transaction signature."

  const mockedOnSuccessCallback = jest.fn()
  const mockedOnErroCallback = jest.fn()

  beforeEach(() => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
      library: mockedLibrary,
      account,
    })
    ;(getSigner as jest.Mock).mockReturnValue(mockedSigner)
    ;(useModal as jest.Mock).mockReturnValue({ openModal: mockedOpenModalFn })
  })

  test("should proceed the transaction correctly", async () => {
    mockedContract[methodName].mockResolvedValue(mockedTx)

    const { result, waitForNextUpdate } = renderHook(() =>
      useSendTransaction(mockedContract, methodName)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)
    await waitForNextUpdate()

    expect(mockedContract[methodName]).toHaveBeenCalledWith(from, value)
    expect(mockedTx.wait).toHaveBeenCalled()
    expect(result.current.status).toEqual(TransactionStatus.Succeeded)
    expect(mockedOpenModalFn).toHaveBeenNthCalledWith(
      1,
      ModalType.TransactionIsWaitingForConfirmation
    )
    expect(mockedOpenModalFn).toHaveBeenNthCalledWith(
      2,
      ModalType.TransactionIsPending,
      { transactionHash: txHash }
    )
  })

  test("should proceed the transaction correctly and call custom on success callback", async () => {
    mockedContract[methodName].mockResolvedValue(mockedTx)

    const { result, waitForNextUpdate } = renderHook(() =>
      useSendTransaction(mockedContract, methodName, mockedOnSuccessCallback)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)
    await waitForNextUpdate()

    expect(mockedOnSuccessCallback).toHaveBeenCalledWith(mockedTx)
  })

  test("should do nothing if there is no signer", async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
      library: mockedLibrary,
      account: null,
    })

    const { result } = renderHook(() =>
      useSendTransaction(mockedContract, methodName)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)

    expect(getSigner).not.toHaveBeenCalledWith(mockedLibrary, account)
    expect(mockedContract.connect).not.toHaveBeenCalledWith(mockedSigner)
    expect(mockedContract[methodName]).not.toHaveBeenCalledWith(from, value)
    expect(mockedTx.wait).not.toHaveBeenCalled()
    expect(result.current.status).toEqual(TransactionStatus.Idle)
    expect(mockedOpenModalFn).not.toHaveBeenCalled()
  })

  test("should do nothing if there is no method name", async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
      library: mockedLibrary,
      account: null,
    })
    const nonExistentMethodName = "asd"

    const { result } = renderHook(() =>
      useSendTransaction(mockedContract, nonExistentMethodName)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)

    expect(getSigner).not.toHaveBeenCalledWith(mockedLibrary, account)
    expect(mockedContract.connect).not.toHaveBeenCalledWith(mockedSigner)
    expect(mockedTx.wait).not.toHaveBeenCalled()
    expect(result.current.status).toEqual(TransactionStatus.Idle)
    expect(mockedOpenModalFn).not.toHaveBeenCalled()
  })

  test("should call a custom error callback", async () => {
    const error = new Error()
    mockedContract[methodName].mockRejectedValue(error)

    const { result, waitForNextUpdate } = renderHook(() =>
      useSendTransaction(
        mockedContract,
        methodName,
        mockedOnSuccessCallback,
        mockedOnErroCallback
      )
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)
    await waitForNextUpdate()
    expect(mockedOnSuccessCallback).not.toHaveBeenCalled()
    expect(mockedOnErroCallback).toHaveBeenCalledWith(error)
    expect(mockedOpenModalFn).not.toHaveBeenCalledWith(
      ModalType.TransactionFailed
    )
  })

  test.each`
    errorMsg              | expectedStatus
    ${"Unexpected error"} | ${TransactionStatus.Failed}
    ${userRejectedErrMsg} | ${TransactionStatus.Rejected}
  `(
    "should set $expectedStatus transaction status based on the error",
    async ({ errorMsg, expectedStatus }) => {
      const error = new Error(errorMsg)
      mockedContract[methodName].mockRejectedValue(error)

      const { result, waitForNextUpdate } = renderHook(() =>
        useSendTransaction(mockedContract, methodName)
      )

      expect(result.current.status).toEqual(TransactionStatus.Idle)

      result.current.sendTransaction(from, value)
      await waitForNextUpdate()

      expect(mockedContract[methodName]).toHaveBeenCalledWith(from, value)
      expect(mockedTx.wait).not.toHaveBeenCalled()
      expect(result.current.status).toEqual(expectedStatus)
      expect(mockedOpenModalFn).toHaveBeenCalledWith(
        ModalType.TransactionFailed,
        { error, transactionHash: undefined, isExpandableError: true }
      )
    }
  )
})
