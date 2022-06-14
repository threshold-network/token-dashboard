import SelectWalletModal from "../components/Modal/SelectWalletModal"

export enum TbtcMintAction {
  mint = "MINT",
  unmint = "UNMINT",
}

export interface SetMintAction {
  payload: { mintAction: TbtcMintAction }
}

export interface UseTbtcState {
  (): {
    mintAction: TbtcMintAction
    setMintAction: (action: TbtcMintAction) => SetMintAction
  }
}
