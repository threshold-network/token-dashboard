import web3Utils from "web3-utils"
import { assert } from "@0x/assert"
import {
  LedgerEthereumClient,
  LedgerEthereumClientFactoryAsync,
  LedgerSubproviderConfigs,
  LedgerSubproviderErrors,
  PartialTxParams,
  WalletSubproviderErrors,
} from "@0x/subproviders/lib/src/types"
import { addressUtils } from "@0x/utils"
import { Transaction } from "ethereumjs-tx"
import { stripHexPrefix } from "ethjs-util"
import { Lock } from "semaphore-async-await"
import { Dictionary } from "ts-essentials"
import { BaseWalletSubprovider } from "@0x/subproviders/lib/src/subproviders/base_wallet_subprovider"

export const LEDGER_DERIVATION_PATHS = {
  LEDGER_LIVE: `m/44'/60'/x'/0/0`,
  LEDGER_LEGACY: `m/44'/60'/0'/x`,
}

const DEFAULT_BASE_DERIVATION_PATH = LEDGER_DERIVATION_PATHS.LEDGER_LIVE

const ASK_FOR_ON_DEVICE_CONFIRMATION = false

export type OnDisconnectCallback = () => void

export class LedgerSubprovider extends BaseWalletSubprovider {
  private readonly _connectionLock = new Lock()
  private readonly _networkId: number
  private _derivationPath: string
  private readonly _ledgerEthereumClientFactoryAsync: LedgerEthereumClientFactoryAsync
  private _ledgerClientIfExists?: LedgerEthereumClient
  private readonly _shouldAlwaysAskForConfirmation: boolean
  private chosenAddress?: string
  private addressToPathMap: Dictionary<string> = {}
  private _onDisconnect: OnDisconnectCallback

  constructor(
    config: LedgerSubproviderConfigs & { onDisconnect: OnDisconnectCallback }
  ) {
    super()
    this._onDisconnect = config.onDisconnect
    this._networkId = config.networkId
    this._ledgerEthereumClientFactoryAsync =
      config.ledgerEthereumClientFactoryAsync
    this._derivationPath =
      config.baseDerivationPath || DEFAULT_BASE_DERIVATION_PATH
    this._shouldAlwaysAskForConfirmation =
      config.accountFetchingConfigs !== undefined &&
      config.accountFetchingConfigs.shouldAskForOnDeviceConfirmation !==
        undefined
        ? config.accountFetchingConfigs.shouldAskForOnDeviceConfirmation
        : ASK_FOR_ON_DEVICE_CONFIRMATION
  }

  async getAddress(index: number) {
    const path = this._derivationPath.replace("x", index.toString())
    let ledgerResponse
    try {
      // @ts-ignore
      this._ledgerClientIfExists = await this._createLedgerClientAsync()
      // @ts-ignore
      ledgerResponse = await this._ledgerClientIfExists.getAddress(
        path,
        // @ts-ignore
        this._shouldAlwaysAskForConfirmation,
        true
      )
    } finally {
      // @ts-ignore
      await this._destroyLedgerClientAsync()
    }

    const address = web3Utils.toChecksumAddress(ledgerResponse.address)

    this.addressToPathMap[address] = path

    return address
  }

  // @ts-ignore
  async getAccountsAsync(numberOfAccounts: number, accountsOffSet = 0) {
    const addresses = [] as Array<string>
    for (
      let index = accountsOffSet;
      index < numberOfAccounts + accountsOffSet;
      index++
    ) {
      const address = await this.getAddress(index)
      addresses.push(address)
    }

    return addresses
  }

  public async signTransactionAsync(
    txParams: PartialTxParams
  ): Promise<string> {
    LedgerSubprovider._validateTxParams(txParams)

    if (txParams.from === undefined || !addressUtils.isAddress(txParams.from)) {
      throw new Error(WalletSubproviderErrors.FromAddressMissingOrInvalid)
    }

    if (this.chosenAddress) {
      txParams.from = this.chosenAddress
    }
    const path =
      this.addressToPathMap[web3Utils.toChecksumAddress(txParams.from)]
    if (!path) throw new Error(`address unknown '${txParams.from}'`)

    this._ledgerClientIfExists = await this._createLedgerClientAsync()

    const tx = new Transaction(txParams, { chain: this._networkId })

    // Set the EIP155 bits
    const vIndex = 6
    tx.raw[vIndex] = Buffer.from([this._networkId]) // v
    const rIndex = 7
    tx.raw[rIndex] = Buffer.from([]) // r
    const sIndex = 8
    tx.raw[sIndex] = Buffer.from([]) // s

    const txHex = tx.serialize().toString("hex")
    try {
      const result = await this._ledgerClientIfExists.signTransaction(
        path,
        txHex
      )
      // Store signature in transaction
      tx.r = Buffer.from(result.r, "hex")
      tx.s = Buffer.from(result.s, "hex")
      tx.v = Buffer.from(result.v, "hex")

      // EIP155: v should be chain_id * 2 + {35, 36}
      const eip55Constant = 35
      const signedChainId = Math.floor((tx.v[0] - eip55Constant) / 2)
      if (signedChainId !== this._networkId) {
        await this._destroyLedgerClientAsync()
        const err = new Error(LedgerSubproviderErrors.TooOldLedgerFirmware)
        throw err
      }
      const signedTxHex = `0x${tx.serialize().toString("hex")}`
      await this._destroyLedgerClientAsync()
      return signedTxHex
    } catch (err) {
      console.log("error signing txn ", err)
      await this._destroyLedgerClientAsync()
      throw err
    }
  }

  public async signPersonalMessageAsync(
    data: string,
    address: string
  ): Promise<string> {
    if (data === undefined) {
      throw new Error(WalletSubproviderErrors.DataMissingForSignPersonalMessage)
    }
    assert.isHexString("data", data)
    assert.isETHAddressHex("address", address)

    const path = this.addressToPathMap[web3Utils.toChecksumAddress(address)]
    if (!path) throw new Error(`address unknown '${address}'`)

    this._ledgerClientIfExists = await this._createLedgerClientAsync()
    try {
      const result = await this._ledgerClientIfExists.signPersonalMessage(
        path,
        stripHexPrefix(data)
      )
      const lowestValidV = 27
      const v = result.v - lowestValidV
      const hexBase = 16
      let vHex = v.toString(hexBase)
      if (vHex.length < 2) {
        vHex = `0${v}`
      }
      const signature = `0x${result.r}${result.s}${vHex}`
      await this._destroyLedgerClientAsync()
      return signature
    } catch (err) {
      await this._destroyLedgerClientAsync()
      throw err
    }
  }

  // tslint:disable-next-line:prefer-function-over-method
  public async signTypedDataAsync(
    _address: string,
    _typedData: never
  ): Promise<string> {
    throw new Error(WalletSubproviderErrors.MethodNotSupported)
  }
  private async _createLedgerClientAsync(): Promise<LedgerEthereumClient> {
    await this._connectionLock.acquire()
    if (this._ledgerClientIfExists !== undefined) {
      this._connectionLock.release()
      throw new Error(LedgerSubproviderErrors.MultipleOpenConnectionsDisallowed)
    }
    const ledgerEthereumClient = await this._ledgerEthereumClientFactoryAsync()

    ;(ledgerEthereumClient.transport as any).on(
      "disconnect",
      this._onDisconnect?.bind(this)
    )
    this._connectionLock.release()
    return ledgerEthereumClient
  }

  private async _destroyLedgerClientAsync(): Promise<void> {
    await this._connectionLock.acquire()
    if (this._ledgerClientIfExists === undefined) {
      this._connectionLock.release()
      return
    }
    await this._ledgerClientIfExists.transport.close()
    this._ledgerClientIfExists = undefined
    this._connectionLock.release()
  }
}
