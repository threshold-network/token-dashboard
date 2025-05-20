# System Patterns

## Architectural Patterns

### Frontend Architecture

- **Component-Based**: The application uses React components for UI representation
- **State Management**: Centralized Redux store for application state
- **Routing**: React Router for navigation between different views
- **Theme System**: Chakra UI theming for consistent styling
- **API Integration**: Axios for HTTP requests, Ethers.js for blockchain interaction

### Blockchain Integration

- **Web3 Provider Pattern**: Uses web3-react for wallet connection management
- **Contract Interaction**: Ethers.js providers and contract instances
- **Cross-Chain Communication**: Wormhole protocol for bridging between Ethereum and SUI networks
- **Wallet Adapters**: Multiple wallet connection methods (Injected, WalletConnect, Ledger Live)

### Data Flow

- **Redux Actions/Reducers**: Standard Redux pattern for state updates
- **Async Operations**: Redux Thunks for asynchronous operations
- **Form Handling**: Formik for form state management
- **Local Storage**: Browser storage for persisting user preferences

## Code Organization

### Directory Structure

- `src/`: Main source code directory
  - `components/`: Reusable UI components
  - `pages/`: Page components corresponding to routes
  - `store/`: Redux store, actions, and reducers
  - `hooks/`: Custom React hooks
  - `utils/`: Utility functions
  - `services/`: API and blockchain service integrations
  - `config/`: Application configuration

### Integration Points

- **tbtc-v2.ts SDK**: Main integration point for tBTC protocol interaction
- **SUI Network**: Integration for SUI blockchain communication via:
  - `@mysten/sui` package for core SUI functionality
  - `@suiet/wallet-kit` for wallet connections
  - Wormhole bridge contract for cross-chain deposits

## Key Workflows

### Linking Workflow

- Local tbtc-v2 SDK is built and linked using yarn link
- token-dashboard links to the local SDK using yarn link
- Changes in the local SDK immediately reflect in the dashboard

### tBTC v2 Deposit Flow

1. User connects wallet (Ethereum and potentially SUI)
2. User initiates a deposit from the UI
3. tBTC contract interactions are handled through the linked SDK
4. For SUI integration, deposits go through the Wormhole bridge
5. Deposit status and confirmations are tracked in the UI

### Cross-Chain Integration

- Wormhole message passing between Ethereum and SUI
- BTCDepositorWormhole contract on Ethereum side
- SUI Wormhole Gateway on SUI network side
- Chain-specific wallet adapters for both networks

## System Design & Architecture Patterns

### Map/Dictionary Key Consistency

**Pattern**: Ensure strict consistency (including case-sensitivity for string keys) when using keys to set and get values from Maps, Dictionaries, or similar associative arrays.

**Context**: Encountered an issue where `Map.get(key)` returned `undefined` despite the map appearing to contain the key. The root cause was a case mismatch between the key used for `Map.set("Sui", ...)` and the key used for `Map.get("SUI", ...)`.

**Solution/Prevention**:

- Define canonical key formats (e.g., enums, constants, or clear string casing rules) for map keys, especially if keys originate from different parts of the system or external configurations.
- When debugging such issues, log the exact key string and its `typeof` for both `set` and `get` operations.
- Consider normalization (e.g., `.toLowerCase()`, `.toUpperCase()`, or a specific mapping) at the point of access if canonical keys cannot be strictly enforced at the source, but prefer fixing the source of inconsistency.

### Handling Pre-conditions for SDK Operations (Cross-Chain Example)

**Pattern**: For SDK operations that have implicit pre-conditions on external state (e.g., a connected wallet, user input), the consuming application UI/UX must ensure these pre-conditions are met before invoking the SDK function.

**Context**: The `tbtc-v2` SDK's `initiateCrossChainDeposit` for SUI requires the destination SUI address to be known for `extraData` generation. If a SUI wallet is not yet connected, the SDK (using mock interfaces) cannot provide this address, leading to an error ("Cannot resolve destination chain deposit owner").

**Solution/Prevention**:

- Clearly document SDK pre-conditions for such operations.
- The application UI should check for these pre-conditions (e.g., SUI wallet connected and its address available) _before_ calling the relevant SDK method.
- If pre-conditions are not met, prompt the user to fulfill them (e.g., "Please connect your SUI wallet to proceed.").
- Utilize phased SDK initialization if available (e.g., initialize with read-only capabilities, then update with a signer/wallet context) and ensure the application logic respects the capabilities available at each phase.
