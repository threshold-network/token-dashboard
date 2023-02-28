import TBTCVault from "@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import Bridge from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import TBTCToken from "@keep-network/tbtc-v2/artifacts/TBTC.json"
import { BigNumber, Contract, providers } from "ethers"
import {
  Client,
  computeHash160,
  decodeBitcoinAddress,
  TransactionHash,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import { IMulticall } from "../../multicall"
import { AddressZero } from "@ethersproject/constants"
import {
  getChainIdentifier,
  getContract,
  getProviderOrSigner,
  isPublicKeyHashTypeAddress,
  isValidBtcAddress,
} from "../../utils"
import { ITBTC, TBTC } from ".."
import { BitcoinConfig, BitcoinNetwork, EthereumConfig } from "../../types"
import { Bridge as ChainBridge } from "@keep-network/tbtc-v2.ts/dist/src/chain"
import {
  MockBitcoinClient,
  testnetUTXO,
} from "../../../tbtc/mock-bitcoin-client"
import { ElectrumClient, EthereumBridge } from "@keep-network/tbtc-v2.ts"
import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  getRevealedDeposit,
  revealDeposit,
  RevealedDeposit,
} from "@keep-network/tbtc-v2.ts/dist/src/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import { Address } from "@keep-network/tbtc-v2.ts/dist/src/ethereum"

jest.mock("@keep-network/tbtc-v2/artifacts/TBTCVault.json", () => ({
  address: "0x1e742E11389e5590a1a0c8e59a119Be5F73BFdf6",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2/artifacts/Bridge.json", () => ({
  address: "0xF0d5D8312d8B3fd5b580DC46A8154c45aAaF47D2",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2/artifacts/TBTC.json", () => ({
  address: "0x5db5A1382234E2447E66CEB2Ee366a3e7a313Acf",
  abi: [],
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src/deposit", () => ({
  calculateDepositAddress: jest.fn(),
  calculateDepositRefundLocktime: jest.fn(),
  DepositScriptParameters: jest.fn(),
  revealDeposit: jest.fn(),
  getRevealedDeposit: jest.fn(),
}))

jest.mock("../../utils", () => ({
  ...(jest.requireActual("../../utils") as {}),
  getContract: jest.fn(),
  getContractPastEvents: jest.fn(),
  getChainIdentifier: jest.fn(),
  getProviderOrSigner: jest.fn(),
  isValidBtcAddress: jest.fn(),
  isPublicKeyHashTypeAddress: jest.fn(),
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src/bitcoin", () => ({
  decodeBitcoinAddress: jest.fn(),
  TransactionHash: {
    from: jest.fn(),
  },
  computeHash160: jest.fn(),
}))

jest.mock("@keep-network/tbtc-v2.ts/dist/src", () => ({
  EthereumBridge: jest.fn(),
  ElectrumClient: jest.fn(),
}))

jest.mock("crypto-js")

describe("TBTC test", () => {
  const activeWalletPublicKey =
    "03989d253b17a6a0f41838b84ff0d20e8898f9d7b1a98f2564da4cc29dcf8581d9"

  const ethAddress = "0x6c05E249D167a42dfFdC54Ff00c7832292889dff"
  const bitcoinAddressTestnet = "tb1q0tpdjdu2r3r7tzwlhqy4e2276g2q6fexsz4j0m"

  let tBTC: ITBTC
  let tBTCMainnet: ITBTC

  let bridge: ChainBridge
  let tbtcVault: Contract
  let bitcoinClient: Client
  let multicall: IMulticall
  let bridgeContract: Contract
  let token: Contract

  const mockTBTCVaultContract = {
    interface: {},
    address: TBTCVault.address,
  }

  const mockBridgeContract = {
    interface: {},
    address: Bridge.address,
  }

  const mockTokenContract = {
    interface: {},
    address: TBTCToken.address,
  }

  const mockEthereumProvider = {} as providers.Provider
  const ethConfig: EthereumConfig = {
    providerOrSigner: mockEthereumProvider,
    chainId: 1,
    account: AddressZero,
  }

  const mockBitcoinClient = new MockBitcoinClient()

  const btcConfig: BitcoinConfig = {
    network: BitcoinNetwork.Testnet,
    client: mockBitcoinClient,
  }

  const mockDepositScriptParameters: DepositScriptParameters = {
    depositor: Address.from("934b98637ca318a4d6e7ca6ffd1690b8e77df637"),
    walletPublicKeyHash: "8db50eb52063ea9d98b3eac91489a90f738986f6",
    refundPublicKeyHash: "28e081f285138ccbe389c1eb8985716230129f89",
    blindingFactor: "f9f0c90d00039523",
    refundLocktime: "30ecaa62",
  }

  beforeEach(() => {
    multicall = {
      aggregate: jest.fn(),
      getCurrentBlockTimestampCallObj: jest.fn(),
    }
    bridge = {
      getDepositRevealedEvents: jest.fn(),
      submitDepositSweepProof: jest.fn(),
      revealDeposit: jest.fn(),
      deposits: jest.fn(),
      requestRedemption: jest.fn(),
      submitRedemptionProof: jest.fn(),
      txProofDifficultyFactor: jest.fn(),
      pendingRedemptions: jest.fn(),
      timedOutRedemptions: jest.fn(),
      activeWalletPublicKey: jest.fn().mockResolvedValue(activeWalletPublicKey),
      getNewWalletRegisteredEvents: jest.fn(),
    } as ChainBridge
    ;(getContract as jest.Mock)
      .mockImplementationOnce(() => mockTBTCVaultContract)
      .mockImplementationOnce(() => mockBridgeContract)
      .mockImplementationOnce(() => mockTokenContract)
    ;(EthereumBridge as unknown as jest.Mock).mockImplementationOnce(
      () => bridge
    )
    tBTC = new TBTC(ethConfig, btcConfig, multicall)
  })

  describe("Create TBTC object", () => {
    const expectTBTCInstanceToBeCreatedCorrectly = () => {
      expect(getContract).toHaveBeenCalledWith(
        TBTCVault.address,
        TBTCVault.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(getContract).toHaveBeenCalledWith(
        Bridge.address,
        Bridge.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(getContract).toHaveBeenCalledWith(
        TBTCToken.address,
        TBTCToken.abi,
        ethConfig.providerOrSigner,
        ethConfig.account
      )
      expect(EthereumBridge).toHaveBeenCalledWith({
        address: Bridge.address,
        signerOrProvider: getProviderOrSigner(
          ethConfig.providerOrSigner as any,
          ethConfig.account
        ),
      })

      expect(tBTC.vaultContract).toBe(mockTBTCVaultContract)
      expect(tBTC.bridgeContract).toBe(mockBridgeContract)
      expect(tBTC.tokenContract).toBe(mockTokenContract)
      expect(tBTC.bitcoinNetwork).toBe(BitcoinNetwork.Testnet)
    }
    describe("with mocked bitcoin clinet", () => {
      test("should create TBTC instance correctly", () => {
        expectTBTCInstanceToBeCreatedCorrectly()
      })

      test("should not create the real electrum client instance", () => {
        expect(ElectrumClient).not.toBeCalled()
      })
    })

    describe("with real electrum client", () => {
      const btcConfigWithRealElectrumClient: BitcoinConfig = {
        network: BitcoinNetwork.Testnet,
        credentials: [
          {
            host: "testhost",
            port: 1,
            protocol: "wss",
          },
        ],
      }
      beforeEach(() => {
        ;(getContract as jest.Mock)
          .mockImplementationOnce(() => mockTBTCVaultContract)
          .mockImplementationOnce(() => mockBridgeContract)
          .mockImplementationOnce(() => mockTokenContract)
        ;(EthereumBridge as unknown as jest.Mock).mockImplementationOnce(
          () => bridge
        )
        tBTC = new TBTC(ethConfig, btcConfigWithRealElectrumClient, multicall)
      })

      test("should create TBTC instance correctly", () => {
        expectTBTCInstanceToBeCreatedCorrectly()
      })

      test("should create the real electrum client instance", () => {
        expect(ElectrumClient).toBeCalled()
      })
    })

    describe("with client not specified in the bitcoin config", () => {
      const btcConfigWithNoClientSpecified: BitcoinConfig = {
        network: BitcoinNetwork.Testnet,
      }
      beforeEach(() => {
        ;(getContract as jest.Mock)
          .mockImplementationOnce(() => mockTBTCVaultContract)
          .mockImplementationOnce(() => mockBridgeContract)
          .mockImplementationOnce(() => mockTokenContract)
        ;(EthereumBridge as unknown as jest.Mock).mockImplementationOnce(
          () => bridge
        )
      })

      test("should throw an error", () => {
        expect(() => {
          new TBTC(ethConfig, btcConfigWithNoClientSpecified, multicall)
        }).toThrowError(
          "Neither bitcoin client nor bitcoin credentials are specified"
        )
      })
    })
  })

  describe("suggestDepositWallet", () => {
    let expectedDepositWallet: string | undefined
    beforeEach(async () => {
      expectedDepositWallet = await tBTC.suggestDepositWallet()
    })
    test("should call a proper function with proper parameters", async () => {
      expect(bridge.activeWalletPublicKey).toBeCalledWith()
    })
    test("should suggest a desposit wallet correctly", async () => {
      expect(expectedDepositWallet).toBe(activeWalletPublicKey)
    })
  })

  describe("createDepositScriptParameters", () => {
    let depositScriptParameters: DepositScriptParameters

    const mockDecodeBitcoinAddressResult =
      "3a38d44d6a0c8d0bb84e0232cc632b7e48c72e0e"
    const mockCalculateDepositRefundLocktimeResult = "30ecaa62"
    const mockWalletPublicKeyHash = "0x8db50eb52063ea9d98b3eac91489a90f738986f6"
    const mockBlindingFactor = "f9f0c90d00039523"
    const mockCurrentTime = 1466424490000
    const mockDate = new Date(mockCurrentTime)

    const setUpdeposiScriptParameters = () => {
      ;(decodeBitcoinAddress as jest.Mock).mockImplementationOnce(
        () => mockDecodeBitcoinAddressResult
      )
      ;(calculateDepositRefundLocktime as jest.Mock).mockImplementationOnce(
        () => mockCalculateDepositRefundLocktimeResult
      )
      ;(calculateDepositRefundLocktime as jest.Mock).mockImplementationOnce(
        () => mockCalculateDepositRefundLocktimeResult
      )
      ;(computeHash160 as jest.Mock).mockImplementationOnce(
        () => mockWalletPublicKeyHash
      )
      CryptoJS.lib.WordArray.random.mockImplementation(() => ({
        toString: jest.fn().mockImplementation(() => mockBlindingFactor),
      }))
      jest
        .spyOn(global, "Date")
        .mockImplementation(() => mockDate as unknown as string)
    }

    const setUpValidBTCAddress = (isValid: boolean) => {
      ;(isValidBtcAddress as jest.Mock).mockImplementation(() => isValid)
    }

    const setUpIsPublicKeyHashTypeAddress = (isPKHType: boolean) => {
      ;(isPublicKeyHashTypeAddress as jest.Mock).mockImplementation(
        () => isPKHType
      )
    }

    describe("when proper arguments are passed to the method", () => {
      beforeEach(async () => {
        setUpdeposiScriptParameters()
        setUpValidBTCAddress(true)
        setUpIsPublicKeyHashTypeAddress(true)
        depositScriptParameters = await tBTC.createDepositScriptParameters(
          ethAddress,
          bitcoinAddressTestnet
        )
      })
      test("should call proper functions with proper arguments", async () => {
        expect(bridge.activeWalletPublicKey).toHaveBeenCalled()

        expect(isValidBtcAddress).toHaveBeenCalledWith(
          bitcoinAddressTestnet,
          btcConfig.network
        )
        expect(isPublicKeyHashTypeAddress).toHaveBeenCalledWith(
          bitcoinAddressTestnet
        )
        expect(calculateDepositRefundLocktime).toHaveBeenCalledWith(
          Math.floor(mockCurrentTime / 1000),
          23328000
        )
        expect(getChainIdentifier).toBeCalledWith(ethAddress)
      })
      test("should create proper deposit script parameters", async () => {
        expect(depositScriptParameters.depositor).toBe(
          getChainIdentifier(ethAddress)
        )
        expect(depositScriptParameters.blindingFactor).toBe(mockBlindingFactor)
        expect(depositScriptParameters.refundPublicKeyHash).toBe(
          mockDecodeBitcoinAddressResult
        )
        expect(depositScriptParameters.refundLocktime).toBe(
          mockCalculateDepositRefundLocktimeResult
        )
        expect(depositScriptParameters.walletPublicKeyHash).toBe(
          mockWalletPublicKeyHash
        )
      })
    })

    describe("when wrong btc address is provided", () => {
      beforeEach(async () => {
        setUpdeposiScriptParameters()
        setUpValidBTCAddress(false)
        setUpIsPublicKeyHashTypeAddress(false)
      })
      test("should throw", async () => {
        await expect(
          tBTC.createDepositScriptParameters(ethAddress, bitcoinAddressTestnet)
        ).rejects.toThrow(
          "Wrong bitcoin address passed to createDepositScriptParameters function"
        )

        expect(isValidBtcAddress).toHaveBeenCalledWith(
          bitcoinAddressTestnet,
          btcConfig.network
        )
      })
    })

    describe("when provided btc address is not a PKH type address", () => {
      beforeEach(async () => {
        setUpdeposiScriptParameters()
        setUpValidBTCAddress(true)
        setUpIsPublicKeyHashTypeAddress(false)
      })
      test("should throw", async () => {
        await expect(
          tBTC.createDepositScriptParameters(ethAddress, bitcoinAddressTestnet)
        ).rejects.toThrow("Bitcoin recovery address must be a P2PKH or P2WPKH")

        expect(isValidBtcAddress).toHaveBeenCalledWith(
          bitcoinAddressTestnet,
          btcConfig.network
        )
        expect(isPublicKeyHashTypeAddress).toHaveBeenCalledWith(
          bitcoinAddressTestnet
        )
      })
    })
  })

  describe("calculateDepositAddress", () => {
    const mockDepositAddress = "123"
    let expectedDepositAddress: string
    beforeEach(async () => {
      ;(calculateDepositAddress as jest.Mock).mockImplementation(
        () => mockDepositAddress
      )
      expectedDepositAddress = await tBTC.calculateDepositAddress(
        mockDepositScriptParameters
      )
    })
    test("should call proper function with proper parameters", () => {
      expect(calculateDepositAddress).toHaveBeenCalledWith(
        mockDepositScriptParameters,
        btcConfig.network,
        true
      )
    })
    test("should calculate deposit address correctly", () => {
      expect(expectedDepositAddress).toBe(mockDepositAddress)
    })
  })

  describe("findAllUnspentTransactionOutputs", () => {
    let expectedUTXOs: UnspentTransactionOutput[]
    const mockDepositAddress = "123"
    beforeEach(async () => {
      jest
        .spyOn(mockBitcoinClient, "findAllUnspentTransactionOutputs")
        .mockImplementation(async () => [testnetUTXO])
      expectedUTXOs = await tBTC.findAllUnspentTransactionOutputs(
        mockDepositAddress
      )
    })
    test("should call a proper function with proper parameters", async () => {
      expect(mockBitcoinClient.findAllUnspentTransactionOutputs).toBeCalledWith(
        mockDepositAddress
      )
    })
    test("should return utxos correctly", async () => {
      expect(expectedUTXOs).toEqual([testnetUTXO])
    })
  })

  //TODO (private methods mock)
  // describe("getEstimatedFees", () => {
  //   let test2: {
  //     treasuryFee: string
  //     optimisticMintFee: string
  //     amountToMint: string
  //   }
  //   beforeEach(async () => {
  //     jest
  //       .spyOn(TBTC.prototype as any, "_getDepositFees")
  //       .mockImplementation(async () => ({
  //         depositTreasuryFeeDivisor: "5000",
  //         optimisticMintingFeeDivisor: "300",
  //       }))
  //     test2 = await tBTC.getEstimatedFees("10000000")
  //   })
  //   test("should estimate fees", () => {
  //     expect(test2).toBeCalled()
  //   })
  // })

  describe("revealDeposit", () => {
    let expectedRevealedDepositTxHash: string
    const mockRevealedDepositTxHash = "0x1"

    beforeEach(async () => {
      ;(revealDeposit as jest.Mock).mockImplementationOnce(
        () => mockRevealedDepositTxHash
      )
      expectedRevealedDepositTxHash = await tBTC.revealDeposit(
        testnetUTXO,
        mockDepositScriptParameters
      )
    })
    test("should reveal deposit properly", () => {
      expect(revealDeposit).toHaveBeenCalledWith(
        testnetUTXO,
        mockDepositScriptParameters,
        mockBitcoinClient,
        bridge,
        getChainIdentifier(mockTBTCVaultContract.address)
      )
      expect(expectedRevealedDepositTxHash).toBe(mockRevealedDepositTxHash)
    })
  })

  describe("getRevealedDeposit", () => {
    let expectedRevealedDeposit: RevealedDeposit
    const mockRevealedDeposit = {
      revealedAt: 5645,
      sweptAt: 4352,
      treasuryFee: BigNumber.from(5000),
    }

    beforeEach(async () => {
      ;(getRevealedDeposit as jest.Mock).mockImplementationOnce(
        () => mockRevealedDeposit
      )
      expectedRevealedDeposit = await tBTC.getRevealedDeposit(testnetUTXO)
    })
    test("should get revealed deposit", () => {
      expect(getRevealedDeposit).toHaveBeenCalledWith(testnetUTXO, bridge)
      expect(expectedRevealedDeposit).toBe(mockRevealedDeposit)
    })
  })

  describe("getTransactionConfirmations", () => {
    let expectedTransactionConfirmations: number
    const mockTransactionConfirmations = 3
    const mockTransactionHash = TransactionHash.from(
      "9eb901fc68f0d9bcaf575f23783b7d30ac5dd8d95f3c83dceaa13dce17de816a"
    )

    beforeEach(async () => {
      jest
        .spyOn(mockBitcoinClient, "getTransactionConfirmations")
        .mockImplementation(async () => mockTransactionConfirmations)
      expectedTransactionConfirmations = await tBTC.getTransactionConfirmations(
        mockTransactionHash
      )
    })
    test("should get revealed deposit", () => {
      expect(
        mockBitcoinClient.getTransactionConfirmations
      ).toHaveBeenCalledWith(mockTransactionHash)
      expect(expectedTransactionConfirmations).toBe(
        mockTransactionConfirmations
      )
    })
  })
})
