import { describe, it, expect } from "@jest/globals"

describe("Starknet Dependencies", () => {
  it("should import starknetkit without errors", async () => {
    const starknetkit = await import("starknetkit")
    expect(starknetkit).toBeDefined()
    expect(starknetkit.connect).toBeDefined()
  })

  it("should import starknet without errors", async () => {
    const starknet = await import("starknet")
    expect(starknet).toBeDefined()
    expect(starknet.Account).toBeDefined()
    expect(starknet.Provider).toBeDefined()
  })

  it("should import @starknet-react/chains without errors", async () => {
    const chains = await import("@starknet-react/chains")
    expect(chains).toBeDefined()
    expect(chains.mainnet).toBeDefined()
    expect(chains.goerli).toBeDefined()
  })

  it("should import @starknet-react/core without errors", async () => {
    const core = await import("@starknet-react/core")
    expect(core).toBeDefined()
    expect(core.StarknetConfig).toBeDefined()
    expect(core.useAccount).toBeDefined()
  })

  it("should have TypeScript types available", () => {
    // This test verifies at compile time that types are available
    // If types are missing, TypeScript compilation will fail
    type TestStarknetKit = typeof import("starknetkit")
    type TestStarknet = typeof import("starknet")
    type TestChains = typeof import("@starknet-react/chains")
    type TestCore = typeof import("@starknet-react/core")

    // Type assertions to ensure types exist
    const typeCheck: {
      kit: TestStarknetKit
      starknet: TestStarknet
      chains: TestChains
      core: TestCore
    } = {} as any

    expect(typeCheck).toBeDefined()
  })
})
