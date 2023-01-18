import {
  calculateDepositAddress,
  calculateDepositRefundLocktime,
  DepositScriptParameters,
  revealDeposit as tBTCRevealDeposit,
  getRevealedDeposit as tBTCgetRevealedDeposit,
  RevealedDeposit,
} from "@keep-network/tbtc-v2.ts/dist/deposit"
//@ts-ignore
import * as CryptoJS from "crypto-js"
import {
  getContract,
  getProviderOrSigner,
  isValidBtcAddress,
  unprefixedAndUncheckedAddress,
} from "../utils"
import {
  Client,
  computeHash160,
  decodeBitcoinAddress,
  UnspentTransactionOutput,
} from "@keep-network/tbtc-v2.ts/dist/bitcoin"
import { ElectrumClient, EthereumBridge } from "@keep-network/tbtc-v2.ts"
import BridgeArtifact from "@keep-network/tbtc-v2/artifacts/Bridge.json"
import { BitcoinConfig, BitcoinNetwork, EthereumConfig } from "../types"
import TBTCVault from "../../../node_modules/@keep-network/tbtc-v2/artifacts/TBTCVault.json"
import { BigNumber, Contract } from "ethers"
import { ContractCall, IMulticall } from "../multicall"
import { Interface } from "ethers/lib/utils"

export interface ITBTC {
  /**
   * Bitcoin network specified in the bitcoin config that we pass to the
   * threshold lib
   * @returns {BitcoinNetwork}
   */
  readonly bitcoinNetwork: BitcoinNetwork

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
   * Gets estimated fees that will be payed during a reveal
   * @param depositAmount - summed amount of all utxos that will be revealed
   * @returns treasury fee and optitimistic mint fee
   */
  getEstimatedFees(depositAmount: string): Promise<{
    treasuryFee: string
    optimisticMintFee: string
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
}

export class TBTC implements ITBTC {
  private _bridge: EthereumBridge
  private _tbtcVault: Contract
  private _bitcoinClient: Client
  private _multicall: IMulticall
  /**
   * Deposit refund locktime duration in seconds.
   * This is 9 month in seconds assuming 1 month = 30 days
   */
  private _depositRefundLocktimDuration = 23328000
  private _bitcoinConfig: BitcoinConfig

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
    this._bitcoinClient =
      bitcoinConfig.client ?? new ElectrumClient(bitcoinConfig.credentials!)
    this._multicall = multicall
    this._bitcoinConfig = bitcoinConfig
  }

  get bitcoinNetwork(): BitcoinNetwork {
    return this._bitcoinConfig.network
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
    const identifierHex = unprefixedAndUncheckedAddress(ethAddress)

    const depositScriptParameters: DepositScriptParameters = {
      depositor: {
        identifierHex,
      },
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

    const depositTreasuryFeeDivisor = depositParams.depositTreasuryFeeDivisor
    const optimisticMintingFeeDivisor = _optimisticMintingFeeDivisor[0]

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/bridge/Deposit.sol#L258-L260
    const treasuryFee = BigNumber.from(depositTreasuryFeeDivisor).gt(0)
      ? BigNumber.from(depositAmount).div(depositTreasuryFeeDivisor).toString()
      : "0"

    const amountToMint = BigNumber.from(depositAmount)
      .sub(treasuryFee)
      .toString()

    // https://github.com/keep-network/tbtc-v2/blob/main/solidity/contracts/vault/TBTCOptimisticMinting.sol#L328-L336
    const optimisticMintFee = BigNumber.from(optimisticMintingFeeDivisor).gt(0)
      ? BigNumber.from(amountToMint)
          .div(optimisticMintingFeeDivisor[0])
          .toString()
      : "0"

    return {
      treasuryFee,
      optimisticMintFee,
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
      {
        identifierHex: unprefixedAndUncheckedAddress(this._tbtcVault.address),
      }
    )
  }

  getRevealedDeposit = async (
    utxo: UnspentTransactionOutput
  ): Promise<RevealedDeposit> => {
    return await tBTCgetRevealedDeposit(utxo, this._bridge)
  }
}
