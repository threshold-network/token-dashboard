import { LedgerSubprovider as LedgerSubprovider0x } from "@0x/subproviders/lib/src/subproviders/ledger" // https://github.com/0xProject/0x-monorepo/issues/1400
import web3Utils from "web3-utils"
import { LedgerSubproviderConfigs } from "@0x/subproviders"

export const LEDGER_DERIVATION_PATHS = {
  LEDGER_LIVE: `m/44'/60'/x'/0/0`,
  LEDGER_LEGACY: `m/44'/60'/0'/x`,
}

/**
 * A custom Ledger subprovider, inheriting from the 0x Subprovider.
 *
 * Supports chains with a chainId > 255, and mitigates some issues with the
 * LedgerJS library.
 */
class LedgerSubprovider extends LedgerSubprovider0x {
  chainId: string
  addressToPathMap: { [key: string]: string } = {}
  pathToAddressMap: { [key: string]: string } = {}

  constructor(public config: { chainId: string } & LedgerSubproviderConfigs) {
    super(config)
    this.chainId = config.chainId
  }

  async getAccountsAsync(numberOfAccounts: number, accountsOffSet = 0) {
    console.log("fetching accounts")
    const addresses = []
    for (
      let index = accountsOffSet;
      index < numberOfAccounts + accountsOffSet;
      index++
    ) {
      console.log("getting a specific account")
      const address = await this.getAddress(index)

      addresses.push(address)
    }

    return addresses
  }

  async getAddress(index: number) {
    // @ts-ignore
    const path = this._baseDerivationPath.replace("x", index)
    console.log("using path: ", path)
    let ledgerResponse
    try {
      // @ts-ignore
      this._ledgerClientIfExists = await this._createLedgerClientAsync()

      console.log("creatied a ledger clients")
      // @ts-ignore
      ledgerResponse = await this._ledgerClientIfExists.getAddress(
        path,
        // @ts-ignorex
        this._shouldAlwaysAskForConfirmation,
        true
      )
      console.log(" the leder response")
    } catch (error) {
      console.log(error)
    } finally {
      console.log("finally....")
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
