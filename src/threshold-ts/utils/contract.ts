import { BlockTag, JsonRpcSigner, Web3Provider } from "@ethersproject/providers"
import {
  EthereumBridge,
  EthereumTBTCToken,
  EthereumTBTCVault,
  EthereumWalletRegistry,
  TBTCContracts,
} from "@keep-network/tbtc-v2.ts"
import { Contract, ContractInterface, Event, providers, Signer } from "ethers"
import { AddressZero, getAddress, isAddressZero } from "./address"

import BridgeArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/Bridge.json"
import TbtcTokenArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTC.json"
import TbtcVaultArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTCVault.json"
import WalletRegistryArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/WalletRegistry.json"
import VendingMachineKeepMainnet from "../vending-machine/mainnet-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherMainnet from "../vending-machine/mainnet-artifacts/VendingMachineNuCypher.json"

import BridgeArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/Bridge.json"
import TbtcTokenArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/TBTC.json"
import TbtcVaultArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/TBTCVault.json"
import WalletRegistryArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/WalletRegistry.json"
import VendingMachineKeepGoerli from "../vending-machine/goerli-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypheGoerli from "../vending-machine/goerli-artifacts/VendingMachineNuCypher.json"

import BridgeArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/Bridge.json"
import TbtcTokenArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTC.json"
import TbtcVaultArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTCVault.json"
import WalletRegistryArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/WalletRegistry.json"
import VendingMachineKeepDappDevelopmentGoerli from "../vending-machine/dapp-development-goerli-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypheDappDevelopmentGoerli from "../vending-machine/dapp-development-goerli-artifacts/VendingMachineNuCypher.json"

type ArtifactNameType = TbtcArtifactNameType | VendingMachineArtifactType
type ArtifactType = {
  address: string
  abi: ContractInterface
  [key: string]: any
}

type TbtcArtifactNameType = "Bridge" | "TBTCVault" | "TBTC" | "WalletRegistry"
type VendingMachineArtifactType =
  | "VendingMachineKeep"
  | "VendingMachineNuCypher"

const mainnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactMainnet],
  ["TBTCVault", TbtcVaultArtifactMainnet],
  ["TBTC", TbtcTokenArtifactMainnet],
  ["WalletRegistry", WalletRegistryArtifactMainnet],
  ["VendingMachineKeep", VendingMachineKeepMainnet],
  ["VendingMachineNuCypher", VendingMachineNuCypherMainnet],
])
const testnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactGoerli],
  ["TBTCVault", TbtcVaultArtifactGoerli],
  ["TBTC", TbtcTokenArtifactGoerli],
  ["WalletRegistry", WalletRegistryArtifactGoerli],
  ["VendingMachineKeep", VendingMachineKeepGoerli],
  ["VendingMachineNuCypher", VendingMachineNuCypheGoerli],
])
const testnetDevelopmentArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactDappDevelopmentGoerli],
  ["TBTCVault", TbtcVaultArtifactDappDevelopmentGoerli],
  ["TBTC", TbtcTokenArtifactDappDevelopmentGoerli],
  ["WalletRegistry", WalletRegistryArtifactDappDevelopmentGoerli],
  ["VendingMachineKeep", VendingMachineKeepDappDevelopmentGoerli],
  ["VendingMachineNuCypher", VendingMachineNuCypheDappDevelopmentGoerli],
])

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
  artifactName: ArtifactNameType,
  chainId: string | number,
  shouldUseTestnetDevelopmentContracts = false
): ArtifactType => {
  switch (chainId.toString()) {
    case "1":
      return mainnetArtifacts.get(artifactName)!
    case "5":
      const artifacts = shouldUseTestnetDevelopmentContracts
        ? testnetDevelopmentArtifacts
        : testnetArtifacts
      return artifacts.get(artifactName)!
    default:
      throw new Error("Can't get tbtc-v2 artifacts!")
  }
}

export const getVendingMachineArtifact = (
  type: "Keep" | "NuCypher",
  chainId: string | number,
  shouldUseTestnetDevelopmentContracts = false
): ArtifactType => {
  const artifactName = `VendingMachine${type}` as ArtifactNameType
  switch (chainId.toString()) {
    case "1":
      return mainnetArtifacts.get(artifactName)!
    case "5":
      const artifacts = shouldUseTestnetDevelopmentContracts
        ? testnetDevelopmentArtifacts
        : testnetArtifacts
      return artifacts.get(artifactName)!
    default:
      throw new Error("Can't get vending machine artifacts!")
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
