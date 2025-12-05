import React from "react"
import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
// Triage reproductions for user-provided resume-deposit receipts.
import receipt from "./__fixtures__/673.json"
import matchingReceipt from "./__fixtures__/680.json"
import { utils as ethersUtils } from "ethers"

const mockNavigate = jest.fn()
const mockUpdateState = jest.fn()
const mockSetDepositDataInLocalStorage = jest.fn()
const mockInitiateDepositFromDepositScriptParameters = jest.fn()
const mockInitiateCrossChainDepositFromScriptParameters = jest.fn()
const mockCalculateDepositAddress = jest
  .fn()
  .mockResolvedValue("btc-deposit-address")
const mockCheckDepositExpiration = jest.fn().mockResolvedValue({
  isExpired: false,
  expirationTimestamp: 0,
  refundLockTimestamp: 0,
})
let mockAccount = `0x${receipt.depositor.identifierHex}`
let mockChainId = 1

jest.mock("../../networks/utils/getEthereumNetworkNameFromChainId", () => ({
  getEthereumNetworkNameFromChainId: () => "Ethereum",
}))

jest.mock("../../utils/forms", () => {
  const actual = jest.requireActual("../../utils/forms")
  return {
    ...actual,
    validateBTCAddress: () => "",
  }
})

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom")
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

jest.mock("@threshold-network/components", () => {
  const React = require("react")
  return {
    BodyLg: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    BodyMd: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    Box: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    Card: ({ children, ...rest }: any) => <div {...rest}>{children}</div>,
    FormControl: ({ children, ...rest }: any) => (
      <div {...rest}>{children}</div>
    ),
    FormErrorMessage: ({ children }: any) => <div role="alert">{children}</div>,
    FormHelperText: ({ children }: any) => <div>{children}</div>,
    FileUploader: ({ onFileUpload, ...rest }: any) => (
      <input
        data-testid="file-input"
        type="file"
        onChange={(event) =>
          onFileUpload(event.target.files ? event.target.files[0] : null)
        }
        {...rest}
      />
    ),
  }
})

jest.mock("../../pages/tBTC/Bridge/components/BridgeProcessCardTitle", () => ({
  BridgeProcessCardTitle: () => <div>bridge-process-card-title</div>,
}))

jest.mock("../../pages/tBTC/Bridge/components/BridgeProcessEmptyState", () => ({
  BridgeProcessEmptyState: ({ title }: { title?: string }) => (
    <div>{title || "bridge-process-empty"}</div>
  ),
}))

jest.mock("../../components/tBTC", () => ({
  BridgeContractLink: () => <div>bridge-contract-link</div>,
}))

jest.mock("../../components/Forms/HelperErrorText", () => ({
  __esModule: true,
  default: ({ hasError, errorMsgText }: any) =>
    hasError ? <div>{errorMsgText}</div> : null,
}))

jest.mock("../../components/SubmitTxButton", () => ({
  __esModule: true,
  default: ({
    children,
    isDisabled,
    ...rest
  }: {
    children: React.ReactNode
    isDisabled?: boolean
  }) => (
    <button type="submit" disabled={isDisabled} {...rest}>
      {children}
    </button>
  ),
}))

jest.mock("../../hooks/useTbtcState", () => ({
  useTbtcState: () => ({
    updateState: mockUpdateState,
  }),
}))

jest.mock("../../hooks/tbtc", () => ({
  useTBTCDepositDataFromLocalStorage: () => ({
    setDepositDataInLocalStorage: mockSetDepositDataInLocalStorage,
  }),
}))

jest.mock("../../contexts/ThresholdContext", () => ({
  useThreshold: () => {
    const { BitcoinNetwork } = require("@keep-network/tbtc-v2.ts")
    return {
      tbtc: {
        initiateDepositFromDepositScriptParameters:
          mockInitiateDepositFromDepositScriptParameters,
        initiateCrossChainDepositFromScriptParameters:
          mockInitiateCrossChainDepositFromScriptParameters,
        calculateDepositAddress: mockCalculateDepositAddress,
        bridgeContract: {},
        bitcoinNetwork: BitcoinNetwork.Mainnet,
      },
    }
  },
}))

jest.mock("../../hooks/useIsActive", () => ({
  useIsActive: () => ({
    account: mockAccount,
    chainId: mockChainId,
    isActive: true,
  }),
}))

jest.mock("../../hooks/useNonEVMConnection", () => ({
  useNonEVMConnection: () => ({
    isNonEVMActive: false,
    nonEVMChainName: undefined,
    nonEVMPublicKey: undefined,
  }),
}))

jest.mock("../../hooks/tbtc/useCheckDepositExpirationTime", () => ({
  useCheckDepositExpirationTime: () => mockCheckDepositExpiration,
}))

import { ResumeDepositPage } from "../../pages/tBTC/Bridge/ResumeDeposit"

describe("Triage: ResumeDepositPage", () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.REACT_APP_DEFAULT_PROVIDER_CHAIN_ID = "1"
    mockCheckDepositExpiration.mockResolvedValue({
      isExpired: false,
      expirationTimestamp: 0,
      refundLockTimestamp: 0,
    })
  })

  it("surfaces a chain name mismatch when uploaded receipt network differs from connected network", async () => {
    expect(ethersUtils.isAddress(`0x${receipt.depositor.identifierHex}`)).toBe(
      true
    )
    mockAccount = `0x${receipt.depositor.identifierHex}`
    mockChainId = 1

    render(<ResumeDepositPage />)

    const fileInput = screen.getByTestId("file-input")
    const submitButton = screen.getByRole("button", {
      name: /upload and resume/i,
    })

    // Should be disabled until the receipt is parsed.
    expect(submitButton).toBeDisabled()

    const file = new File([JSON.stringify(receipt)], "673.json", {
      type: "application/json",
    })
    await userEvent.upload(fileInput, file)

    await waitFor(() => expect(submitButton).not.toBeDisabled())

    await userEvent.click(submitButton)

    expect(await screen.findByText("Chain name mismatch.")).toBeInTheDocument()
  })

  it("accepts when depositor matches and chain matches", async () => {
    expect(
      ethersUtils.isAddress(`0x${matchingReceipt.depositor.identifierHex}`)
    ).toBe(true)
    mockAccount = `0x${matchingReceipt.depositor.identifierHex}`
    mockChainId = 1

    render(<ResumeDepositPage />)

    const fileInput = screen.getByTestId("file-input")
    const submitButton = screen.getByRole("button", {
      name: /upload and resume/i,
    })

    const file = new File([JSON.stringify(matchingReceipt)], "680.json", {
      type: "application/json",
    })
    await userEvent.upload(fileInput, file)

    await waitFor(() => expect(submitButton).not.toBeDisabled())
    await userEvent.click(submitButton)

    await waitFor(() =>
      expect(mockInitiateDepositFromDepositScriptParameters).toHaveBeenCalled()
    )
    expect(screen.queryByText("Chain name mismatch.")).not.toBeInTheDocument()
  })
})
