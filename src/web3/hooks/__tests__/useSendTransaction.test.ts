import { act, renderHook } from "@testing-library/react-hooks"
import { useWeb3React } from "@web3-react/core"
import { Contract } from "@ethersproject/contracts"
import { getSigner } from "../../../utils/getContract"
import { useSendTransaction } from "../useSendTransaction"
import { TransactionStatus } from "../../../enums"

jest.mock("@web3-react/core", () => ({
  ...(jest.requireActual("@web3-react/core") as {}),
  useWeb3React: jest.fn(),
}))

jest.mock("../../../utils/getContract", () => ({
  ...(jest.requireActual("../../../utils/getContract") as {}),
  getSigner: jest.fn(),
}))

describe("Test `useSendTransaction` hook", () => {
  const methodName = "Transfer"
  const mockedLibrary = {}
  const account = "0x086813525A7dC7dafFf015Cdf03896Fd276eab60"
  const txHash = "0x0"
  const from = "0x407C3329eA8f6BEFB984D97AE4Fa71945E43170b"
  const value = "1000000000000000000"
  const mockedTx = {
    wait: jest.fn().mockResolvedValue({ txHash }),
  }
  const mockedContract = {
    connect: jest.fn(),
    [methodName]: jest.fn(),
  }

  const mockedSigner = {}
  const userRejectedErrMsg =
    "MetaMask Tx Signature: User denied transaction signature."

  beforeEach(() => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
      library: mockedLibrary,
      account,
    })
    ;(getSigner as jest.Mock).mockReturnValue(mockedSigner)
  })

  test("should proceed the transaciton correctly", async () => {
    mockedContract[methodName].mockResolvedValue(mockedTx)

    const { result, waitForNextUpdate } = renderHook(() =>
      // @ts-ignore
      useSendTransaction(mockedContract, methodName)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)
    await waitForNextUpdate()

    expect(getSigner).toHaveBeenCalledWith(mockedLibrary, account)
    expect(mockedContract.connect).toHaveBeenCalledWith(mockedSigner)
    expect(mockedContract[methodName]).toHaveBeenCalledWith(from, value)
    expect(mockedTx.wait).toHaveBeenCalled()
    expect(result.current.status).toEqual(TransactionStatus.Succeeded)
  })

  test("should do nothing if there is no signer", async () => {
    ;(useWeb3React as jest.Mock).mockReturnValue({
      chainId: 1,
      library: mockedLibrary,
      account: null,
    })

    const { result } = renderHook(() =>
      // @ts-ignore
      useSendTransaction(mockedContract, methodName)
    )

    expect(result.current.status).toEqual(TransactionStatus.Idle)

    result.current.sendTransaction(from, value)

    expect(getSigner).not.toHaveBeenCalledWith(mockedLibrary, account)
    expect(mockedContract.connect).not.toHaveBeenCalledWith(mockedSigner)
    expect(mockedContract[methodName]).not.toHaveBeenCalledWith(from, value)
    expect(mockedTx.wait).not.toHaveBeenCalled()
    expect(result.current.status).toEqual(TransactionStatus.Idle)
  })

  test.each`
    errorMsg              | expectedStatus
    ${"Unexpected error"} | ${TransactionStatus.Failed}
    ${userRejectedErrMsg} | ${TransactionStatus.Rejected}
  `(
    "should set $expectedStatus transaction status based on the error",
    async ({ errorMsg, expectedStatus }) => {
      mockedContract[methodName].mockRejectedValue(new Error(errorMsg))

      const { result, waitForNextUpdate } = renderHook(() =>
        // @ts-ignore
        useSendTransaction(mockedContract, methodName)
      )

      expect(result.current.status).toEqual(TransactionStatus.Idle)

      result.current.sendTransaction(from, value)
      await waitForNextUpdate()

      expect(getSigner).toHaveBeenCalledWith(mockedLibrary, account)
      expect(mockedContract.connect).toHaveBeenCalledWith(mockedSigner)
      expect(mockedContract[methodName]).toHaveBeenCalledWith(from, value)
      expect(mockedTx.wait).not.toHaveBeenCalled()
      expect(result.current.status).toEqual(expectedStatus)
    }
  )
})
