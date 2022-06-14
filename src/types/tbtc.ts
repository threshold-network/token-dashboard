export enum TbtcMintAction {
  mint = "MINT",
  unmint = "UNMINT",
}

export enum MintingStep {
  ProvideData = "PROVIDE_DATA",
  Deposit = "Deposit",
  InitiateMinting = "INITIATE_MINTING",
  MintingSuccess = "MINTING_SUCCESS",
}

export const MintingSteps: MintingStep[] = [
  MintingStep.ProvideData,
  MintingStep.Deposit,
  MintingStep.InitiateMinting,
  MintingStep.MintingSuccess,
]

export interface SetMintAction {
  payload: { mintAction: TbtcMintAction }
}

export interface UseTbtcState {
  (): {
    advanceMintingStep: () => void
    rewindMintingStep: () => void
    mintingStep: MintingStep
    mintAction: TbtcMintAction
    setMintAction: (action: TbtcMintAction) => SetMintAction
  }
}
