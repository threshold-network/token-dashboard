import { LedgerSubprovider as LedgerSubprovider0x } from "@0x/subproviders/lib/src/subproviders/ledger" // https://github.com/0xProject/0x-monorepo/issues/1400
import web3Utils from "web3-utils"
import { ChainID } from "../../types"
import { LedgerSubproviderConfigs } from "@0x/subproviders"

export const LEDGER_DERIVATION_PATHS = {
  LEDGER_LIVE: `m/44'/60'/0'/0/0`,
  LEDGER_LEGACY: `m/44'/60'/0'/0`,
}

/**
 * A custom Ledger subprovider, inheriting from the 0x Subprovider.
 *
 * Supports chains with a chainId > 255, and mitigates some issues with the
 * LedgerJS library.
 */
class LedgerSubprovider extends LedgerSubprovider0x {
  chainId: ChainID
  addressToPathMap: { [key: string]: string } = {}
  pathToAddressMap: { [key: string]: string } = {}

  constructor(public config: { chainId: ChainID } & LedgerSubproviderConfigs) {
    super(config)
    this.chainId = config.chainId
  }

  async getAccountsAsync(numberOfAccounts: number, accountsOffSet = 0) {
    console.log("async getching accxounts")
    const addresses = []
    for (
      let index = accountsOffSet;
      index < numberOfAccounts + accountsOffSet;
      index++
    ) {
      console.log("---- getting the address ----")
      console.log(this)
      const address = await this.getAddress(index)
      console.log(address)
      addresses.push(address)
    }

    return addresses
  }

  async getAddress(index: number) {
    console.log("--- getAddress ---")
    // @ts-ignore
    const path = this._baseDerivationPath.replace("x", index)

    console.log("path to look for: ", path)

    let ledgerResponse
    try {
      console.log("going into the config...")
      // @ts-ignore
      this._ledgerClientIfExists = await this._createLedgerClientAsync()

      console.log(
        "checking if client is available",
        // @ts-ignore
        this._ledgerClientIfExists
      )

      try {
        // @ts-ignore
        ledgerResponse = await this._ledgerClientIfExists.getAddress(
          path,
          // @ts-ignore
          this._shouldAlwaysAskForConfirmation,
          true
        )
        console.log("ledgerResponse: ", ledgerResponse)
      } catch (error) {
        console.log(error)
      }
    } catch (e) {
      console.log("error in the fetch: ", e)
    } finally {
      console.log("destroying ledger client")
      // @ts-ignore
      await this._destroyLedgerClientAsync()
    }

    const address = web3Utils.toChecksumAddress(ledgerResponse.address)

    this.addressToPathMap[address] = path
    this.pathToAddressMap[path] = address

    return address
  }
}

export { LedgerSubprovider }
