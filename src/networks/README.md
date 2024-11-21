Networks Configuration
This folder contains utilities, enumerations, and types that define and manage network configurations used throughout the application. The primary purpose of this module is to expand or remove supported networks within the dApp. Changes to the network setup are managed through the enums and networks.ts files.

Files Overview

- enums/networks.ts: Contains the enumerations (enums) to categorize and label the supported networks.
- utils/networks.ts: Defines and exports the list of supported networks with their properties.
- types/networks.ts: Contains type definitions for network configurations.

Network Enumeration Details

TrmNetworksChainId: Represents key chain IDs for selected networks.

```
export enum TrmNetworksChainId {
  ethereum = 1,
  arbitrum = 42161,
  base = 8453,
}
```

SupportedChainIds: Enumerates the chain IDs of supported networks, including mainnets, testnets, and localhost.

```
export enum SupportedChainIds {
  Ethereum = 1,
  Sepolia = 11155111,
  Localhost = 1337,
  Arbitrum = 42161,
  ArbitrumSepolia = 421614,
  Base = 8453,
  BaseSepolia = 84532,
}
```

AlchemyName: Identifies the API identifiers (Alchemy) associated with each network.

```
export enum AlchemyName {
  Ethereum = "eth",
  Arbitrum = "arb",
  Base = "base",
}
```

NetworkType: Classifies networks based on whether they are Mainnet or Testnet.

```
export enum NetworkType {
  Mainnet = "mainnet",
  Testnet = "sepolia",
}
```

Layer: Indicates whether the network operates at Layer 1 (L1) or Layer 2 (L2).

```
export enum Layer {
  L1 = "L1",
  L2 = "L2",
}
```

Network List Definition

The networks.ts file in utils defines an array of Network objects, where each network is described by its chain ID, name, layer, network type, and Alchemy identifier. This array serves as the central configuration point for supported networks.

Example Network Configuration

Below is an example network configuration, which includes key properties for each supported network:

```
export const networks: Network[] = [
  {
    chainId: SupportedChainIds.Ethereum,
    name: "Ethereum",
    layer: Layer.L1,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Ethereum,
  },
  {
    chainId: SupportedChainIds.Sepolia,
    name: "Sepolia",
    layer: Layer.L1,
    networkType: NetworkType.Testnet,
    alchemyName: AlchemyName.Ethereum,
  },
  {
    chainId: SupportedChainIds.Localhost,
    name: "Localhost",
    layer: Layer.L1,
    networkType: NetworkType.Testnet,
    alchemyName: "",
  },
  {
    chainId: SupportedChainIds.Arbitrum,
    name: "Arbitrum",
    layer: Layer.L2,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Arbitrum,
  },
  {
    chainId: SupportedChainIds.ArbitrumSepolia,
    name: "ArbitrumSepolia",
    layer: Layer.L2,
    networkType: NetworkType.Testnet,
    alchemyName: AlchemyName.Arbitrum,
  },
  {
    chainId: SupportedChainIds.Base,
    name: "Base",
    layer: Layer.L2,
    networkType: NetworkType.Mainnet,
    alchemyName: AlchemyName.Base,
  },
  {
    chainId: SupportedChainIds.BaseSepolia,
    name: "BaseSepolia",
    layer: Layer.L2,
    networkType: NetworkType.Testnet,
    alchemyName: AlchemyName.Base,
  },
]
```

Adding a New Network

- Update the SupportedChainIds enum: Add the new chain ID with a unique identifier.
- Add a corresponding entry in networks.ts: Create a new network object with the required properties such as name, layer, networkType, and alchemyName (if applicable).
- Define the Alchemy name (if needed): If the new network is supported by Alchemy, add its API identifier to the AlchemyName enum.

Removing a Network

- Remove the chain ID from SupportedChainIds.
- Delete the network entry from networks.ts.
- Remove its corresponding entry from the AlchemyName enum if no longer needed.

Conclusion

The networks folder acts as the central configuration point for network management in the application. By modifying the enumerations and networks.ts, you can easily add, update, or remove supported networks within the app. Always verify your changes through appropriate testing to ensure the app's functionality remains consistent.
