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
