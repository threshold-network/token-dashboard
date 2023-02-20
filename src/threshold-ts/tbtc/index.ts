import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
  getRevealedDeposit as tBTCgetRevealedDeposit,
  RevealedDeposit,
} from "@keep-network/tbtc-v2.ts/dist/src/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  getContract,
  getProviderOrSigner,
  isValidBtcAddress,
  getContractPastEvents,
  getChainIdentifier,
  ZERO,
  isPublicKeyHashTypeAddress,
  isSameETHAddress,
} from "../utils"
import {
  Client,
  computeHash160,
  decodeBitcoinAddress,
  TransactionHash,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/src/bitcoin"
import {
  ElectrumClient,
  EthereumBridge,
} from "@keep-network/tbtc-v2.ts/dist/src"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { BitcoinConfig, BitcoinNetwork, EthereumConfig } from "../types"
import TBTCVault from "@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import Bridge from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import TBTCToken from "@keep-network/tbtc-v2/artifacts/TBTC.json"
import { BigNumber, BigNumberish, Contract } from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { Interface } from "ethers/lib/utils"

export enum BridgeHistoryStatus {
  PENDING = "PENDING",
  MINTED = "MINTED",
  ERROR = "ERROR",
}

export interface BridgeTxHistory {
  status: BridgeHistoryStatus
  txHash: string
  amount: string
  depositKey: string
}

interface RevealedDepositEvent {
  amount: string
  walletPublicKeyHash: string
  fundingTxHash: string
  fundingOutputIndex: string
  depositKey: string
  txHash: string
}

type BitcoinTransactionHashByteOrder = "little-endian" | "big-endian"

export interface ITBTC {
  /**
   * Bitcoin network specified in the bitcoin config that we pass to the
   * threshold lib
   * @returns {BitcoinNetwork}
   */
  readonly bitcoinNetwork: BitcoinNetwork

  readonly bridgeContract: Contract

  readonly vaultContract: Contract

  readonly tokenContract: Contract

  /**
   * Suggests a wallet that should be used as the deposit target at the given
   * moment.
   * @returns Compressed (33 bytes long with 02 or 03 prefix) public key of
   * the wallet.
   */
  suggestDepositWallet(): Promise<string | undefined>

  /**
   * Creates parameters needed to construct a deposit address from the data that
   * we gather from the user, which are eth address and btc recovery address.
   * @param ethAddress Eth address in which the user will receive tBTC (it
   * should be the address that the user is connected to).
   * @param btcRecoveryAddress The bitcoin address in which the user will
   * receive the bitcoin back in case something goes wrong.
   * @returns All deposit script parameters needed to create a deposit address.
   */
  createDepositScriptParameters(
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters>

  /**
   * Calculates the deposit address from the deposit script parameters
   * @param depositScriptParameters Deposit script parameters. You can get them
   * from @see{createDepositScriptParameters} method
   * @returns Deposit address
   */
  calculateDepositAddress(
    depositScriptParameters: DepositScriptParameters
  ): Promise<string>

  /**
   * Finds all unspent transaction outputs (UTXOs) for a given Bitcoin address.
   * @param address - Bitcoin address UTXOs should be determined for.
   * @returns List of UTXOs.
   */
  findAllUnspentTransactionOutputs(
    address: string
  ): Promise<UnspentTransactionOutput[]>

  /**
   * Gets estimated fees that will be payed during a reveal and estimated amount
   * of tBTC token that will be minted.
   * @param depositAmount Amount that will be revealed in Satoshi.
   * @returns Treasury fee, optitimistic mint fee and estimated amount of tBTC
   * token that will be minted in ERC20 standart.
   */
  getEstimatedFees(depositAmount: string): Promise<{
    treasuryFee: string
    optimisticMintFee: string
    amountToMint: string
  }>

  /**
   * Reveals the given deposit to the on-chain Bridge contract.
   * @param utxo Deposit UTXO of the revealed deposit
   * @param depositScriptParameters Deposit script parameters. You can get them
   * from @see{createDepositScriptParameters} method
   */
  revealDeposit(
    utxo: UnspentTransactionOutput,
    depositScriptParameters: DepositScriptParameters
  ): Promise<string>

  /**
   * Gets a revealed deposit from the bridge.
   * @param utxo Deposit UTXO of the revealed deposit
   * @returns Revealed deposit data.
   */
  getRevealedDeposit(utxo: UnspentTransactionOutput): Promise<RevealedDeposit>

  /**
   * Gets the number of confirmations that a given transaction has accumulated
   * so far.
   * @param transactionHash Hash of the transaction.
   * @returns The number of confirmations.
   */
  getTransactionConfirmations(transactionHash: TransactionHash): Promise<number>

  /**
   * Gets the minimum number of confirmations needed for the minter to start the
   * minting process. The minimum number of confirmations is based on the amount
   * that was sent to the deposit address.
   * The rules are:
   * - If the amount is less than 0.1 BTC, it should have at least 1
   * confirmation.
   * - If the tx is less than 1 BTC, it should have at least 3 confirmations.
   * - Otherwise, we need to wait for 6 confirmations.
   * @param amount Amount that was sent to the deposit address (in satoshi)
   */
  minimumNumberOfConfirmationsNeeded(amount: BigNumberish): number

  /**
   * Returns the bridge transaction history by depositor in order from the
   * newest revealed deposit to the oldest.
   * @param depositor Depositor Ethereum address.
   * @returns Bridge transaction history @see {@link BridgeTxHistory}.
   */
  bridgeTxHistory(depositor: string): Promise<BridgeTxHistory[]>

  /**
   * Builds the deposit key required to refer a revealed deposit.
   * @param depositTxHash The revealed deposit transaction's hash.
   * @param depositOutputIndex Index of the deposit transaction output that
   * funds the revealed deposit.
   * @param txHashByteOrder Determines the transaction hash byte order. Use
   * `little-endian` to build the deposit key from transaction hash in native
   * Bitcoin little-endian format- for example when using the `fundingTxHash`
   * parameter from the `DepositRevealed` event. Use `big-endian` to build the
   * deposit key from transaction hash in the same byte order as used by the
   * Bitcoin block explorers. The `little-endian` is used as default.
   * @returns Deposit key.
   */
  buildDepositKey(
    depositTxHash: string,
    depositOutputIndex: number,
    txHashByteOrder?: BitcoinTransactionHashByteOrder
  ): string
}

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _tbtcVault: Contract
  private _bitcoinClient: Client
  private _multicall: IMulticall
  private _bridgeContract: Contract
  private _token: Contract
  /**
   * Deposit refund locktime duration in seconds.
   * This is 9 month in seconds assuming 1 month = 30 days
   */
  private _depositRefundLocktimDuration = 23328000
  private _bitcoinConfig: BitcoinConfig
  private readonly _satoshiMultiplier = BigNumber.from(10).pow(10)

  /**
   * Maps the network that is currently used for bitcoin, so that it use "main"
   * instead of "mainnet". This is specific to the tbtc-v2.ts lib.
   */
  private tbtcLibNetworkMap: Record<BitcoinNetwork, "main" | "testnet"> = {
    testnet: "testnet",
    mainnet: "main",
  }

  constructor(
    ethereumConfig: EthereumConfig,
    bitcoinConfig: BitcoinConfig,
    multicall: IMulticall
  ) {
    if (!bitcoinConfig.client && !bitcoinConfig.credentials) {
      throw new Error(
        "Neither bitcoin client nor bitcoin credentials are specified"
      )
    }
    this._bridge = new EthereumBridge({
      address: BridgeArtifact.address,
      signerOrProvider: getProviderOrSigner(
        ethereumConfig.providerOrSigner as any,
        ethereumConfig.account
      ),
    })
    this._tbtcVault = getContract(
      TBTCVault.address,
      TBTCVault.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
    this._bridgeContract = getContract(
      Bridge.address,
      Bridge.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
    this._bitcoinClient =
      bitcoinConfig.client ??
      new ElectrumClient(
        bitcoinConfig.credentials!,
        bitcoinConfig.clientOptions
      )
    this._multicall = multicall
    this._bitcoinConfig = bitcoinConfig
    this._token = getContract(
      TBTCToken.address,
      TBTCToken.abi,
      ethereumConfig.providerOrSigner,
      ethereumConfig.account
    )
  }

  get bitcoinNetwork(): BitcoinNetwork {
    return this._bitcoinConfig.network
  }

  get bridgeContract() {
    return this._bridgeContract
  }

  get vaultContract() {
    return this._tbtcVault
  }

  get tokenContract() {
    return this._token
  }

  suggestDepositWallet = async (): Promise<string | undefined> => {
    return await this._bridge.activeWalletPublicKey()
  }

  createDepositScriptParameters = async (
    ethAddress: string,
    btcRecoveryAddress: string
  ): Promise<DepositScriptParameters> => {
    const { network } = this._bitcoinConfig
    if (!isValidBtcAddress(btcRecoveryAddress, network as any)) {
      throw new Error(
        "Wrong bitcoin address passed to createDepositScriptParameters function"
      )
    }

    if (!isPublicKeyHashTypeAddress(btcRecoveryAddress)) {
      throw new Error("Bitcoin recovery address must be a P2PKH or P2WPKH")
    }

    const currentTimestamp = Math.floor(new Date().getTime() / 1000)
    const blindingFactor = CryptoJS.lib.WordArray.random(8).toString(
      CryptoJS.enc.Hex
    )
    const walletPublicKey = await this.suggestDepositWallet()

    if (!walletPublicKey) {
      throw new Error("Couldn't get active wallet public key!")
    }

    const walletPublicKeyHash = computeHash160(walletPublicKey)

    const refundPublicKeyHash = decodeBitcoinAddress(btcRecoveryAddress)

    const refundLocktime = calculateDepositRefundLocktime(
      currentTimestamp,
      this._depositRefundLocktimDuration
    )

    const depositScriptParameters: DepositScriptParameters = {
      depositor: getChainIdentifier(ethAddress),
      blindingFactor,
      walletPublicKeyHash,
      refundPublicKeyHash,
      refundLocktime,
    }

    return depositScriptParameters
  }

  calculateDepositAddress = async (
    depositScriptParameters: DepositScriptParameters
  ): Promise<string> => {
    const network = this.tbtcLibNetworkMap[this.bitcoinNetwork]
    return await calculateDepositAddress(depositScriptParameters, network, true)
  }

  findAllUnspentTransactionOutputs = async (
    address: string
  ): Promise<UnspentTransactionOutput[]> => {
    return await this._bitcoinClient.findAllUnspentTransactionOutputs(address)
  }

  getEstimatedFees = async (depositAmount: string) => {
    const { depositTreasuryFeeDivisor, optimisticMintingFeeDivisor } =
      await this._getDepositFees()

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/bridge/Deposit.sol#L258-L260
    const treasuryFee = BigNumber.from(depositTreasuryFeeDivisor).gt(0)
      ? BigNumber.from(depositAmount).div(depositTreasuryFeeDivisor)
      : ZERO

    const { amountToMint, optimisticMintFee } =
      this._calculateOptimisticMintingAmountAndFee(
        BigNumber.from(depositAmount),
        treasuryFee,
        optimisticMintingFeeDivisor
      )

    return {
      treasuryFee: treasuryFee.mul(this._satoshiMultiplier).toString(),
      optimisticMintFee: optimisticMintFee.toString(),
      amountToMint: amountToMint.toString(),
    }
  }

  private _getDepositFees = async (): Promise<{
    depositTreasuryFeeDivisor: BigNumber
    optimisticMintingFeeDivisor: BigNumber
  }> => {
    const calls: ContractCall[] = [
      {
        interface: new Interface(BridgeArtifact.abi),
        address: BridgeArtifact.address,
        method: "depositParameters",
        args: [],
      },
      {
        interface: this._tbtcVault.interface,
        address: this._tbtcVault.address,
        method: "optimisticMintingFeeDivisor",
        args: [],
      },
    ]

    const [depositParams, _optimisticMintingFeeDivisor] =
      await this._multicall.aggregate(calls)

    const depositTreasuryFeeDivisor = BigNumber.from(
      depositParams.depositTreasuryFeeDivisor
    )
    const optimisticMintingFeeDivisor = BigNumber.from(
      _optimisticMintingFeeDivisor[0]
    )

    return {
      depositTreasuryFeeDivisor,
      optimisticMintingFeeDivisor,
    }
  }

  private _calculateOptimisticMintingAmountAndFee = (
    depositAmount: BigNumber,
    treasuryFee: BigNumber,
    optimisticMintingFeeDivisor: BigNumber
  ) => {
    const amountToMint = depositAmount
      .sub(treasuryFee)
      .mul(this._satoshiMultiplier)

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/vault/TBTCOptimisticMinting.sol#L328-L336
    const optimisticMintFee = BigNumber.from(optimisticMintingFeeDivisor).gt(0)
      ? amountToMint.div(optimisticMintingFeeDivisor)
      : ZERO

    return {
      optimisticMintFee: optimisticMintFee,
      amountToMint: amountToMint.sub(optimisticMintFee),
    }
  }

  revealDeposit = async (
    utxo: UnspentTransactionOutput,
    depositScriptParameters: DepositScriptParameters
  ): Promise<string> => {
    return await tBTCRevealDeposit(
      utxo,
      depositScriptParameters,
      this._bitcoinClient,
      this._bridge,
      getChainIdentifier(this._tbtcVault.address)
    )
  }

  getRevealedDeposit = async (
    utxo: UnspentTransactionOutput
  ): Promise<RevealedDeposit> => {
    return await tBTCgetRevealedDeposit(utxo, this._bridge)
  }

  getTransactionConfirmations = async (
    transactionHash: TransactionHash
  ): Promise<number> => {
    return await this._bitcoinClient.getTransactionConfirmations(
      transactionHash
    )
  }

  minimumNumberOfConfirmationsNeeded = (amount: BigNumberish): number => {
    const amountInBN = BigNumber.from(amount)
    if (amountInBN.lt(10000000) /* 0.1 BTC */) {
      return 1
    } else if (amountInBN.lt(100000000) /* 1 BTC */) {
      return 3
    }
    return 6
  }

  bridgeTxHistory = async (depositor: string): Promise<BridgeTxHistory[]> => {
    // We can assume that all revealed deposits have `PENDING` status.
    const revealedDeposits = await this._findAllRevealedDeposits(depositor)
    const depositKeys = revealedDeposits.map((_) => _.depositKey)

    const mintedDepositEvents = await this._findAllMintedDeposits(
      depositor,
      depositKeys
    )

    const estimatedAmountToMintByDepositKey =
      await this._calculateEstimatedAmountToMintForRevealedDeposits(depositKeys)

    const mintedDeposits = new Map(
      mintedDepositEvents.map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )

    const cancelledDeposits = new Map(
      (await this._findAllCancelledDeposits(depositKeys)).map((event) => [
        (event.args?.depositKey as BigNumber).toHexString(),
        event.transactionHash,
      ])
    )
    const mintedAmountByTxHash = new Map(
      await Promise.all(
        Array.from(mintedDeposits.values()).map((txHash) =>
          this._getMintedAmountFromTxHash(txHash, depositor)
        )
      )
    )

    return revealedDeposits.map((deposit) => {
      const { depositKey, txHash: depositTxHash } = deposit
      let status = BridgeHistoryStatus.PENDING
      let txHash = depositTxHash
      let amount = estimatedAmountToMintByDepositKey.get(depositKey) ?? ZERO

      if (mintedDeposits.has(depositKey)) {
        status = BridgeHistoryStatus.MINTED
        txHash = mintedDeposits.get(depositKey)!
        amount = mintedAmountByTxHash.get(txHash)!
      } else if (cancelledDeposits.has(depositKey)) {
        status = BridgeHistoryStatus.ERROR
        txHash = cancelledDeposits.get(depositKey)!
      }

      return { amount: amount.toString(), txHash, status, depositKey }
    })
  }

  private _findAllRevealedDeposits = async (
    depositor: string
  ): Promise<RevealedDepositEvent[]> => {
    const deposits = await getContractPastEvents(this._bridgeContract, {
      fromBlock: Bridge.receipt.blockNumber,
      filterParams: [null, null, depositor],
      eventName: "DepositRevealed",
    })

    return deposits
      .map((deposit) => {
        const fundingTxHash = deposit.args?.fundingTxHash
        const fundingOutputIndex = deposit.args?.fundingOutputIndex

        const depositKey = this.buildDepositKey(
          fundingTxHash,
          fundingOutputIndex
        )

        return {
          amount: deposit.args?.amount.toString(),
          walletPublicKeyHash: deposit.args?.walletPubKeyHash,
          fundingTxHash,
          fundingOutputIndex,
          depositKey,
          txHash: deposit.transactionHash,
        }
      })
      .reverse()
  }

  private _calculateEstimatedAmountToMintForRevealedDeposits = async (
    depositKeys: string[]
  ): Promise<Map<string, BigNumber>> => {
    const { optimisticMintingFeeDivisor } = await this._getDepositFees()

    const deposits = (
      await this._multicall.aggregate(
        depositKeys.map((depositKey) => ({
          interface: this.bridgeContract.interface,
          address: this.bridgeContract.address,
          method: "deposits",
          args: [depositKey],
        }))
      )
    ).map((deposit) => deposit[0]) as {
      amount: BigNumber
      treasuryFee: BigNumber
    }[]

    return new Map(
      depositKeys.map((depositKey, index) => {
        const deposit = deposits[index]
        return [
          depositKey,
          this._calculateOptimisticMintingAmountAndFee(
            deposit.amount,
            deposit.treasuryFee,
            optimisticMintingFeeDivisor
          ).amountToMint,
        ]
      })
    )
  }

  private _getMintedAmountFromTxHash = async (
    optimisticMintingFinalizedTxHash: string,
    depositor: string
  ): Promise<[string, BigNumber]> => {
    const receipt = await this.tokenContract.provider.getTransactionReceipt(
      optimisticMintingFinalizedTxHash
    )

    // There is only one transfer to depositor account.
    const transferEvent = receipt.logs
      .filter((log) => isSameETHAddress(log.address, this._token.address))
      .map((log) => this._token.interface.parseLog(log))
      .filter((log) => log.name === "Transfer")
      .find((log) => isSameETHAddress(log.args.to, depositor))

    return [
      optimisticMintingFinalizedTxHash,
      BigNumber.from(transferEvent?.args?.value ?? ZERO),
    ]
  }

  private _findAllMintedDeposits = async (
    depositor: string,
    depositKeys: string[] = []
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    return await getContractPastEvents(this._tbtcVault, {
      fromBlock: TBTCVault.receipt.blockNumber,
      filterParams: [null, depositKeys, depositor],
      eventName: "OptimisticMintingFinalized",
    })
  }

  private _findAllCancelledDeposits = async (
    depositKeys: string[]
  ): Promise<ReturnType<typeof getContractPastEvents>> => {
    return getContractPastEvents(this._tbtcVault, {
      fromBlock: TBTCVault.receipt.blockNumber,
      filterParams: [null, depositKeys],
      eventName: "OptimisticMintingCancelled",
    })
  }

  buildDepositKey = (
    depositTxHash: string,
    depositOutputIndex: number,
    txHashByteOrder: BitcoinTransactionHashByteOrder = "little-endian"
  ): string => {
    const _txHash = TransactionHash.from(depositTxHash)

    return EthereumBridge.buildDepositKey(
      txHashByteOrder === "little-endian" ? _txHash.reverse() : _txHash,
      depositOutputIndex
    )
  }
}
