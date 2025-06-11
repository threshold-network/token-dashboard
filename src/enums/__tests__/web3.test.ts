import { WalletType } from "../web3"

describe("WalletType enum", () => {
  it("should have STARKNET value", () => {
    expect(WalletType.Starknet).toBe("STARKNET")
  })

  it("should maintain existing wallet types", () => {
    expect(WalletType.TAHO).toBe("TAHO")
    expect(WalletType.Metamask).toBe("METAMASK")
    expect(WalletType.WalletConnect).toBe("WALLET_CONNECT")
    expect(WalletType.Coinbase).toBe("COINBASE")
    expect(WalletType.LedgerLive).toBe("LEDGER_LIVE")
  })

  it("should have exactly 6 wallet types", () => {
    const walletTypes = Object.keys(WalletType)
    expect(walletTypes).toHaveLength(6)
  })

  it("should maintain backward compatibility", () => {
    // Ensure that adding Starknet doesn't break existing usage
    const walletType: WalletType = WalletType.Metamask
    expect(walletType).toBe("METAMASK")
  })
})
