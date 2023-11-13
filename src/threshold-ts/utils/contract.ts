import { JsonRpcSigner, Web3Provider, BlockTag } from "@ethersproject/providers"
import { Contract, ContractInterface, providers, Signer, Event } from "ethers"
import { AddressZero, getAddress, isAddressZero } from "./address"
import {
  EthereumBridge,
  EthereumTBTCToken,
  EthereumTBTCVault,
  EthereumWalletRegistry,
  TBTCContracts,
} from "tbtc-sdk-v2"

import BridgeArtifactMainnet from "tbtc-sdk-v2/src/lib/ethereum/artifacts/mainnet/Bridge.json"
import BridgeArtifactGoerli from "tbtc-sdk-v2/src/lib/ethereum/artifacts/goerli/Bridge.json"
import BridgeArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/Bridge.json"
import TbtcVaultArtifactMainnet from "tbtc-sdk-v2/src/lib/ethereum/artifacts/mainnet/TBTCVault.json"
import TbtcVaultArtifactGoerli from "tbtc-sdk-v2/src/lib/ethereum/artifacts/goerli/TBTCVault.json"
import TbtcVaultArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTCVault.json"
import TbtcTokenArtifactMainnet from "tbtc-sdk-v2/src/lib/ethereum/artifacts/mainnet/TBTC.json"
import TbtcTokenArtifactGoerli from "tbtc-sdk-v2/src/lib/ethereum/artifacts/goerli/TBTC.json"
import TbtcTokenArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTC.json"

// account is not optional
export function getSigner(
  library: Web3Provider,
  account: string
): JsonRpcSigner {
  return library.getSigner(account).connectUnchecked()
}

// account is optional
export function getProviderOrSigner(
  library: Web3Provider,
  account?: string
): Web3Provider | JsonRpcSigner {
  return account ? getSigner(library, account) : library
}

export const getContract = (
  address: string,
  abi: ContractInterface,
  providerOrSigner: providers.Provider | Signer | undefined,
  account?: string
) => {
  if (!getAddress(address) || isAddressZero(address)) {
    throw Error(`Invalid 'address' parameter '${address}'.`)
  }
  return new Contract(
    address,
    abi,
    getProviderOrSigner(providerOrSigner as any, account) as any
  )
}

interface EventFilterOptions {
  fromBlock?: BlockTag
  toBlock?: BlockTag
  filterParams: any[]
  eventName: string
}

export const getContractPastEvents = async (
  contract: Contract,
  options: EventFilterOptions
): Promise<Array<Event>> => {
  const filter = contract.filters[options.eventName](...options.filterParams)

  return await contract.queryFilter(filter, options.fromBlock, options.toBlock)
}

export function getContractAddressFromTruffleArtifact(
  truffleArtifact: { networks: { [chainID: string]: { address: string } } },
  chainID: string | undefined = undefined
) {
  const networks = Object.keys(truffleArtifact.networks) as Array<
    keyof typeof truffleArtifact.networks
  >

  return networks && networks.length > 0
    ? (
        truffleArtifact.networks[chainID ? chainID : networks[0]] as {
          address: string
        }
      ).address
    : AddressZero
}

export const getTbtcV2Artifact = (
  artifactName: "Bridge" | "TBTCVault" | "TBTC",
  chainId: string | number,
  shouldUseGoerliDevelopmentContracts = false
) => {
  switch (artifactName) {
    case "Bridge":
      if (shouldUseGoerliDevelopmentContracts)
        return BridgeArtifactDappDevelopmentGoerli
      return chainId.toString() === "1"
        ? BridgeArtifactMainnet
        : BridgeArtifactGoerli
    case "TBTCVault":
      if (shouldUseGoerliDevelopmentContracts)
        return TbtcVaultArtifactDappDevelopmentGoerli
      return chainId.toString() === "1"
        ? TbtcVaultArtifactMainnet
        : TbtcVaultArtifactGoerli
    case "TBTC":
      if (shouldUseGoerliDevelopmentContracts)
        return TbtcTokenArtifactDappDevelopmentGoerli
      return chainId.toString() === "1"
        ? TbtcTokenArtifactMainnet
        : TbtcTokenArtifactGoerli
    default:
      throw new Error("Can't get tbtc-v2 artifacts!")
  }
}

export const getGoerliDevelopmentContracts = (
  signerOrProvider: Signer | providers.Provider
): TBTCContracts => {
  return {
    bridge: new EthereumBridge({
      address: "0xB07051CE2A47b58C22bdfD1425BCEad27F6072Db",
      signerOrProvider,
    }),
    tbtcToken: new EthereumTBTCToken({
      address: "0xd33b90D2c792F00d3746eF29cBE9aa0aAef915E1",
      signerOrProvider,
    }),
    tbtcVault: new EthereumTBTCVault({
      address: "0x0099960098f5A5343Bef3185e7E365d3a558D36a",
      signerOrProvider,
    }),
    walletRegistry: new EthereumWalletRegistry({
      address: "0x18930D71C7aE52beCB474A39173Def1A09b861a0",
      signerOrProvider,
    }),
  }
}
