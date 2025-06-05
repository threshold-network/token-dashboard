# Test Failure Analysis

## Summary
- **Total Test Suites**: 46 (24 failed, 22 passed)
- **Total Tests**: 274 (48 failed, 226 passed)

## Root Causes of Failures

### 1. **Jest ESM/CJS Module Resolution Issues** (Most Common)
These errors occur when Jest can't properly handle ES modules from dependencies:

#### Affected Dependencies:
- `@starknet-react/chains` - SyntaxError: Unexpected token 'export'
- `@starknet-react/core` - SyntaxError: Cannot use import statement outside a module
- `axios` (from tbtc-v2 typescript package) - Cannot use import statement outside a module
- `@walletconnect/ethereum-provider` - Cannot read properties of undefined (reading 'base16')

#### Affected Test Files:
- `src/__tests__/setup/dependencies.test.ts`
- `src/threshold-ts/__tests__/starknet-integration.test.ts`
- `src/threshold-ts/tbtc/__test__/tbtc.test.ts`
- Multiple tests importing walletConnect

### 2. **Mock Provider Issues**
- `MockStarknetProvider` is undefined in several tests
- Missing or improperly configured mock providers

#### Affected Test Files:
- `src/components/Navbar/__tests__/NavbarComponent.test.tsx`
- `src/hooks/__tests__/useNonEVMConnection.test.ts`

### 3. **Theme Configuration Issues**
- `defaultTheme.components.Badge.variants` is undefined
- Theme object structure mismatch

#### Affected Test Files:
- `src/components/Modal/SelectWalletModal/__tests__/ConnectStarknet.test.tsx`

### 4. **Import Path Issues**
- Cannot find module `@keep-network/tbtc-v2.ts/dist/src/bitcoin`
- Changed import paths due to yarn link

#### Affected Test Files:
- `src/threshold-ts/tbtc/__test__/tbtc.test.ts`

### 5. **Network Configuration Issues**
- Chain ID mapping failures in test environment
- Mainnet/testnet detection issues

#### Affected Test Files:
- `src/__tests__/compatibility/backwards-compatibility.test.tsx` (partially)

## Solutions

### 1. Fix Jest Configuration for ESM Modules
Update `craco.config.js` or Jest config to handle ES modules properly:

```javascript
// Add to Jest configuration
transformIgnorePatterns: [
  "node_modules/(?!(@starknet-react|axios|@walletconnect|uint8arrays)/)"
]
```

### 2. Fix Mock Providers
Ensure all mock providers are properly exported and imported:

```typescript
// Check src/test/starknet.tsx for proper exports
export { MockStarknetProvider }
```

### 3. Fix Theme Imports
Update theme imports to handle undefined values:

```typescript
const variants = {
  ...(defaultTheme.components?.Badge?.variants || {}),
  // ... custom variants
}
```

### 4. Fix Import Paths
Update imports to use the correct paths after yarn link:

```typescript
// Instead of: @keep-network/tbtc-v2.ts/dist/src/bitcoin
// Use: @keep-network/tbtc-v2.ts
```

### 5. Fix Test Environment Setup
Ensure proper environment variables and network configurations are set for tests.