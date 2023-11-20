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
import NuCypherStakingEscrowMainnet from "../staking/mainnet-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenMainnet from "../tokens/mainnet-artifacts/NuCypherToken.json"
import TbtcTokenArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTC.json"
import TbtcVaultArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTCVault.json"
import VendingMachineKeepMainnet from "../vending-machine/mainnet-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherMainnet from "../vending-machine/mainnet-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/WalletRegistry.json"

import BridgeArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/Bridge.json"
import NuCypherStakingEscrowGoerli from "../staking/goerli-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenGoerli from "../tokens/goerli-artifacts/NuCypherToken.json"
import TbtcTokenArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/TBTC.json"
import TbtcVaultArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/TBTCVault.json"
import VendingMachineKeepGoerli from "../vending-machine/goerli-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherGoerli from "../vending-machine/goerli-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactGoerli from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/goerli/WalletRegistry.json"

import BridgeArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/Bridge.json"
import NuCypherStakingEscrowDappDevelopmentGoerli from "../staking/dapp-development-goerli-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenDappDevelopmentGoerli from "../tokens/dapp-development-goerli-artifacts/NuCypherToken.json"
import TbtcTokenArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTC.json"
import TbtcVaultArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/TBTCVault.json"
import VendingMachineKeepDappDevelopmentGoerli from "../vending-machine/dapp-development-goerli-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherDappDevelopmentGoerli from "../vending-machine/dapp-development-goerli-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactDappDevelopmentGoerli from "../tbtc/dapp-development-goerli-artifacts/WalletRegistry.json"

type ArtifactNameType =
  | "Bridge"
  | "NuCypherStakingEscrow"
  | "NuCypherToken"
  | "TBTCVault"
  | "TBTC"
  | "VendingMachineKeep"
  | "VendingMachineNuCypher"
  | "WalletRegistry"
type ArtifactType = {
  address: string
  abi: ContractInterface
  [key: string]: any
}

const mainnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactMainnet],
  ["NuCypherStakingEscrow", NuCypherStakingEscrowMainnet],
  ["NuCypherToken", NuCypherTokenMainnet],
  ["TBTCVault", TbtcVaultArtifactMainnet],
  ["TBTC", TbtcTokenArtifactMainnet],
  ["WalletRegistry", WalletRegistryArtifactMainnet],
  ["VendingMachineKeep", VendingMachineKeepMainnet],
  ["VendingMachineNuCypher", VendingMachineNuCypherMainnet],
])
const testnetArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactGoerli],
  ["NuCypherStakingEscrow", NuCypherStakingEscrowGoerli],
  ["NuCypherToken", NuCypherTokenGoerli],
  ["TBTCVault", TbtcVaultArtifactGoerli],
  ["TBTC", TbtcTokenArtifactGoerli],
  ["WalletRegistry", WalletRegistryArtifactGoerli],
  ["VendingMachineKeep", VendingMachineKeepGoerli],
  ["VendingMachineNuCypher", VendingMachineNuCypherGoerli],
])
const testnetDevelopmentArtifacts = new Map<ArtifactNameType, ArtifactType>([
  ["Bridge", BridgeArtifactDappDevelopmentGoerli],
  ["NuCypherStakingEscrow", NuCypherStakingEscrowDappDevelopmentGoerli],
  ["NuCypherToken", NuCypherTokenDappDevelopmentGoerli],
  ["TBTCVault", TbtcVaultArtifactDappDevelopmentGoerli],
  ["TBTC", TbtcTokenArtifactDappDevelopmentGoerli],
  ["WalletRegistry", WalletRegistryArtifactDappDevelopmentGoerli],
  ["VendingMachineKeep", VendingMachineKeepDappDevelopmentGoerli],
  ["VendingMachineNuCypher", VendingMachineNuCypherDappDevelopmentGoerli],
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

export const getArtifact = (
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
