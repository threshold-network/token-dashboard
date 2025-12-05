import React from "react"
import { render, screen, waitFor, act } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { ResumeDepositPage } from "../ResumeDeposit"

let mockReceipt: any
let mockAccount = ""

const aliasReceipt = {
  depositor: {
    identifierHex: "deadbeefdeadbeefdeadbeefdeadbeefdeadbeef",
  },
  networkInfo: {
    chainId: "1",
    chainName: "Ethereum Mainnet",
  },
  refundLocktime: "123",
  refundPublicKeyHash: "abc123",
  blindingFactor: "def456",
  userWalletAddress: "0x1111111111111111111111111111111111111111",
  walletPublicKeyHash: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
  btcRecoveryAddress: "btc-recovery-address",
  extraData: "",
}

const mismatchIdReceipt = {
  ...aliasReceipt,
  networkInfo: { chainId: "11155111", chainName: "Ethereum Mainnet" },
}

const mockInitiateDepositFromDepositScriptParameters = jest.fn()
const mockCalculateDepositAddress = jest
  .fn()
  .mockResolvedValue("btc-deposit-address")
const mockCheckDepositExpiration = jest.fn(async () => ({
  isExpired: false,
  expirationTimestamp: 0,
  refundLockTimestamp: 0,
}))
const mockSetDepositDataInLocalStorage = jest.fn()
const mockUpdateState = jest.fn()
const mockNavigate = jest.fn()
let mockChainId = 1

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom")
  return { ...actual, useNavigate: () => mockNavigate }
})

jest.mock("@threshold-network/components", () => {
  const React = require("react")
  return {
    BodyLg: ({ children }: any) => <div>{children}</div>,
    BodyMd: ({ children }: any) => <div>{children}</div>,
    Box: ({ children }: any) => <div>{children}</div>,
    Card: ({ children }: any) => <div>{children}</div>,
    FormControl: ({ children }: any) => <div>{children}</div>,
    FileUploader: ({ onFileUpload }: any) => (
      <button type="button" onClick={() => onFileUpload({} as File)}>
        upload
      </button>
    ),
  }
})

jest.mock("../../../../utils/forms", () => {
  const actual = jest.requireActual("../../../../utils/forms")
  return { ...actual, validateBTCAddress: () => "" }
})

jest.mock("../../../../web3/utils", () => {
  const actual = jest.requireActual("../../../../web3/utils")
  return {
    ...actual,
    parseJSONFile: () => Promise.resolve(mockReceipt),
  }
})

jest.mock("../../../../contexts/ThresholdContext", () => ({
  useThreshold: () => {
    const { BitcoinNetwork } = require("@keep-network/tbtc-v2.ts")
    return {
      tbtc: {
        initiateDepositFromDepositScriptParameters:
          mockInitiateDepositFromDepositScriptParameters,
        initiateCrossChainDepositFromScriptParameters: jest.fn(),
        calculateDepositAddress: mockCalculateDepositAddress,
        bridgeContract: {},
        bitcoinNetwork: BitcoinNetwork.Mainnet,
      },
    }
  },
}))

jest.mock("../../../../hooks/useIsActive", () => ({
  useIsActive: () => ({
    account: mockAccount,
    chainId: mockChainId,
    isActive: true,
  }),
}))

jest.mock("../../../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: () => ({
    isNonEVMActive: false,
    nonEVMChainName: undefined,
    nonEVMPublicKey: undefined,
  }),
}))

jest.mock("../../../../hooks/tbtc/useCheckDepositExpirationTime", () => ({
  useCheckDepositExpirationTime: () => mockCheckDepositExpiration,
}))

jest.mock("../../../../hooks/tbtc", () => ({
  useTBTCDepositDataFromLocalStorage: () => ({
    setDepositDataInLocalStorage: mockSetDepositDataInLocalStorage,
  }),
}))

jest.mock("../../../../hooks/useTbtcState", () => ({
  useTbtcState: () => ({ updateState: mockUpdateState }),
}))

jest.mock("../../../../components/Forms/HelperErrorText", () => ({
  __esModule: true,
  default: ({ hasError, errorMsgText }: any) =>
    hasError ? <div>{errorMsgText}</div> : null,
}))

jest.mock("../../../../components/tBTC", () => ({
  BridgeContractLink: () => <div>bridge-contract-link</div>,
}))

jest.mock("../components/BridgeProcessCardTitle", () => ({
  BridgeProcessCardTitle: () => <div>bridge-process-card-title</div>,
}))

jest.mock("../components/BridgeProcessEmptyState", () => ({
  BridgeProcessEmptyState: ({ title }: { title?: string }) => (
    <div>{title || "bridge-process-empty"}</div>
  ),
}))

jest.mock("../../../../components/SubmitTxButton", () => ({
  __esModule: true,
  default: ({ children, isDisabled, ...rest }: any) => {
    const { type = "submit" } = rest
    return (
      <button type={type} disabled={isDisabled}>
        {children}
      </button>
    )
  },
}))

jest.mock(
  "../../../../networks/utils/getEthereumNetworkNameFromChainId",
  () => ({
    getEthereumNetworkNameFromChainId: () => "Ethereum",
  })
)

describe("ResumeDeposit chain-name aliasing", () => {
  let consoleWarnSpy: jest.SpyInstance

  beforeEach(() => {
    jest.clearAllMocks()
    consoleWarnSpy = jest.spyOn(console, "warn").mockImplementation()
    mockChainId = 1
    mockReceipt = aliasReceipt
    mockAccount = `0x${aliasReceipt.depositor.identifierHex}`
    mockCheckDepositExpiration.mockResolvedValue({
      isExpired: false,
      expirationTimestamp: 0,
      refundLockTimestamp: 0,
    })
  })

  afterEach(() => {
    consoleWarnSpy.mockRestore()
  })

  it("accepts legacy 'Ethereum Mainnet' when chainId matches and warns", async () => {
    render(<ResumeDepositPage />)

    const [uploadBtn] = screen.getAllByRole("button", { name: /upload/i })
    const submitBtn = screen.getByRole("button", {
      name: /upload and resume/i,
    })
    await act(async () => {
      await userEvent.click(uploadBtn)
    })
    await waitFor(() => expect(submitBtn).not.toBeDisabled())
    await act(async () => {
      await userEvent.click(submitBtn)
    })
    await waitFor(() =>
      expect(mockInitiateDepositFromDepositScriptParameters).toHaveBeenCalled()
    )
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining("legacy chain name 'Ethereum Mainnet'")
    )
  })

  it("rejects legacy chain name when chainId mismatches", async () => {
    mockChainId = 1
    mockReceipt = mismatchIdReceipt

    render(<ResumeDepositPage />)

    const [uploadBtn] = screen.getAllByRole("button", { name: /upload/i })
    await act(async () => {
      await userEvent.click(uploadBtn)
    })

    expect(await screen.findByText("Chain id mismatch.")).toBeInTheDocument()
    expect(
      mockInitiateDepositFromDepositScriptParameters
    ).not.toHaveBeenCalled()
  })

  it("shows depositor mismatch details when connected account differs", async () => {
    mockReceipt = aliasReceipt
    mockAccount = "0x2222222222222222222222222222222222222222"
    render(<ResumeDepositPage />)

    const [uploadBtn] = screen.getAllByRole("button", { name: /upload/i })
    await act(async () => {
      await userEvent.click(uploadBtn)
    })

    expect(
      await screen.findByText(/You are not a depositor/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Expected: deadbeefdeadbeefdeadbeefdeadbeefdeadbeef/i)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/connected: 0x2222222222222222222222222222222222222222/i)
    ).toBeInTheDocument()
    expect(
      mockInitiateDepositFromDepositScriptParameters
    ).not.toHaveBeenCalled()
  })
})
