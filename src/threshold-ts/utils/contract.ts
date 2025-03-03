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
import { LedgerLiveSigner } from "../../utils/ledger"
import { SupportedChainIds } from "../../networks/enums/networks"

import ArbitrumL1BitcoinDepositorArtifactMainnet from "../tbtc/mainnet-artifacts/ArbitrumL1BitcoinDepositor.json"
import BridgeArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/Bridge.json"
import NuCypherStakingEscrowMainnet from "../staking/mainnet-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenMainnet from "../tokens/mainnet-artifacts/NuCypherToken.json"
import TbtcTokenArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTC.json"
import TbtcVaultArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/TBTCVault.json"
import VendingMachineKeepMainnet from "../vending-machine/mainnet-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherMainnet from "../vending-machine/mainnet-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactMainnet from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/mainnet/WalletRegistry.json"
import StakingArtifactMainnet from "../staking/mainnet-artifacts/TokenStaking.json"
import RandomBeaconArtifactMainnet from "../tbtc/mainnet-artifacts/RandomBeacon.json"
import LegacyKeepStakingArtifactMainnet from "../staking/mainnet-artifacts/LegacyKeepStaking.json"
import TacoArtifactMainnet from "@nucypher/nucypher-contracts/deployment/artifacts/mainnet.json"

import ArbitrumL1BitcoinDepositorArtifactSepolia from "../tbtc/sepolia-artifacts/ArbitrumL1BitcoinDepositor.json"
import BaseL1BitcoinDepositorArtifactSepolia from "../tbtc/sepolia-artifacts/BaseL1BitcoinDepositor.json"
import BridgeArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/Bridge.json"
import NuCypherStakingEscrowSepolia from "../staking/sepolia-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenSepolia from "../tokens/sepolia-artifacts/NuCypherToken.json"
import TbtcTokenArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/TBTC.json"
import TbtcVaultArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/TBTCVault.json"
import VendingMachineKeepSepolia from "../vending-machine/sepolia-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherSepolia from "../vending-machine/sepolia-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactSepolia from "@keep-network/tbtc-v2.ts/src/lib/ethereum/artifacts/sepolia/WalletRegistry.json"
import StakingArtifactSepolia from "../staking/sepolia-artifacts/TokenStaking.json"
import RandomBeaconArtifactSepolia from "../tbtc/sepolia-artifacts/RandomBeacon.json"
import LegacyKeepStakingArtifactSepolia from "../staking/sepolia-artifacts/LegacyKeepStaking.json"
import TacoArtifactSepolia from "@nucypher/nucypher-contracts/deployment/artifacts/tapir.json"

import BridgeArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/Bridge.json"
import NuCypherStakingEscrowDappDevelopmentSepolia from "../staking/dapp-development-sepolia-artifacts/NuCypherStakingEscrow.json"
import NuCypherTokenDappDevelopmentSepolia from "../tokens/dapp-development-sepolia-artifacts/NuCypherToken.json"
import TbtcTokenArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/TBTC.json"
import TbtcVaultArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/TBTCVault.json"
import VendingMachineKeepDappDevelopmentSepolia from "../vending-machine/dapp-development-sepolia-artifacts/VendingMachineKeep.json"
import VendingMachineNuCypherDappDevelopmentSepolia from "../vending-machine/dapp-development-sepolia-artifacts/VendingMachineNuCypher.json"
import WalletRegistryArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/WalletRegistry.json"
import StakingArtifactDappDevelopmentSepolia from "../staking/dapp-development-sepolia-artifacts/TokenStaking.json"
import RandomBeaconArtifactDappDevelopmentSepolia from "../tbtc/dapp-development-sepolia-artifacts/RandomBeacon.json"
import LegacyKeepStakingArtifactDappDevelopmentSepolia from "../staking/dapp-development-sepolia-artifacts/LegacyKeepStaking.json"
import TacoArtifactDappDevelopmentSepolia from "@nucypher/nucypher-contracts/deployment/artifacts/dashboard.json"

export type ArtifactNameType =
  | "TacoRegistry"
  | "LegacyKeepStaking"
  | "RandomBeacon"
  | "TokenStaking"
  | "Bridge"
  | "NuCypherStakingEscrow"
  | "NuCypherToken"
  | "TBTCVault"
  | "TBTC"
  | "VendingMachineKeep"
  | "VendingMachineNuCypher"
  | "WalletRegistry"
  | "ArbitrumL1BitcoinDepositor"
  | "BaseL1BitcoinDepositor"
type ArtifactType = {
  address: string
  abi: ContractInterface
  [key: string]: any
}
type ContractArtifacts = {
  [chainId in SupportedChainIds]?: {
    [artifactName in ArtifactNameType]?: ArtifactType
  }
}

const contractArtifacts: ContractArtifacts = {
  [SupportedChainIds.Ethereum]: {
    ArbitrumL1BitcoinDepositor: ArbitrumL1BitcoinDepositorArtifactMainnet,
    TacoRegistry:
      TacoArtifactMainnet[SupportedChainIds.Ethereum].TACoApplication,
    LegacyKeepStaking: LegacyKeepStakingArtifactMainnet,
    RandomBeacon: RandomBeaconArtifactMainnet,
    TokenStaking: StakingArtifactMainnet,
    Bridge: BridgeArtifactMainnet,
    NuCypherStakingEscrow: NuCypherStakingEscrowMainnet,
    NuCypherToken: NuCypherTokenMainnet,
    TBTCVault: TbtcVaultArtifactMainnet,
    TBTC: TbtcTokenArtifactMainnet,
    WalletRegistry: WalletRegistryArtifactMainnet,
    VendingMachineKeep: VendingMachineKeepMainnet,
    VendingMachineNuCypher: VendingMachineNuCypherMainnet,
  },
  [SupportedChainIds.Sepolia]: {
    ArbitrumL1BitcoinDepositor: ArbitrumL1BitcoinDepositorArtifactSepolia,
    BaseL1BitcoinDepositor: BaseL1BitcoinDepositorArtifactSepolia,
    TacoRegistry:
      TacoArtifactSepolia[SupportedChainIds.Sepolia].TACoApplication,
    RandomBeacon: RandomBeaconArtifactSepolia,
    TokenStaking: StakingArtifactSepolia,
    Bridge: BridgeArtifactSepolia,
    NuCypherStakingEscrow: NuCypherStakingEscrowSepolia,
    NuCypherToken: NuCypherTokenSepolia,
    TBTCVault: TbtcVaultArtifactSepolia,
    TBTC: TbtcTokenArtifactSepolia,
    WalletRegistry: WalletRegistryArtifactSepolia,
    VendingMachineKeep: VendingMachineKeepSepolia,
    VendingMachineNuCypher: VendingMachineNuCypherSepolia,
  },
  [SupportedChainIds.Localhost]: {
    TacoRegistry:
      TacoArtifactSepolia[SupportedChainIds.Sepolia].TACoApplication,
    LegacyKeepStaking: LegacyKeepStakingArtifactDappDevelopmentSepolia,
    RandomBeacon: RandomBeaconArtifactDappDevelopmentSepolia,
    TokenStaking: StakingArtifactDappDevelopmentSepolia,
    Bridge: BridgeArtifactDappDevelopmentSepolia,
    NuCypherStakingEscrow: NuCypherStakingEscrowDappDevelopmentSepolia,
    NuCypherToken: NuCypherTokenDappDevelopmentSepolia,
    TBTCVault: TbtcVaultArtifactDappDevelopmentSepolia,
    TBTC: TbtcTokenArtifactDappDevelopmentSepolia,
    WalletRegistry: WalletRegistryArtifactDappDevelopmentSepolia,
    VendingMachineKeep: VendingMachineKeepDappDevelopmentSepolia,
    VendingMachineNuCypher: VendingMachineNuCypherDappDevelopmentSepolia,
  },
}

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
  // Sets the correct provider for ledger live app if the instance of
  // LedgerLiveEthereumSigner is passed as providerOrSigner.
  const _providerOrSigner =
    providerOrSigner instanceof LedgerLiveSigner
      ? providerOrSigner
      : (getProviderOrSigner(providerOrSigner as any, account) as any)
  return new Contract(address, abi, _providerOrSigner)
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
  chainId: number | string,
  shouldUseTestnetDevelopmentContracts?: boolean
): ArtifactType | null => {
  if (shouldUseTestnetDevelopmentContracts) {
    return (
      contractArtifacts[SupportedChainIds.Localhost]?.[artifactName] ?? null
    )
  }
  return (
    contractArtifacts[Number(chainId) as SupportedChainIds]?.[artifactName] ??
    null
  )
}

export const getSepoliaDevelopmentContracts = (
  signerOrProvider: Signer | providers.Provider
): TBTCContracts => {
  return {
    bridge: new EthereumBridge({
      address: BridgeArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    tbtcToken: new EthereumTBTCToken({
      address: TbtcTokenArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    tbtcVault: new EthereumTBTCVault({
      address: TbtcVaultArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
    walletRegistry: new EthereumWalletRegistry({
      address: WalletRegistryArtifactDappDevelopmentSepolia.address,
      signerOrProvider,
    }),
  }
}
