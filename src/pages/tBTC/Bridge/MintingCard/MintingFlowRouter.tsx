import { FC } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { MintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { InitiateMinting } from "./InitiateMinting"
import { MintingSuccess } from "./MintingSuccess"
import { MakeDeposit } from "./MakeDeposit"

export const MintingFlowRouter: FC = () => {
  const { mintingStep } = useTbtcState()

  switch (mintingStep) {
    case MintingStep.ProvideData: {
      return <ProvideData />
    }
    case MintingStep.Deposit: {
      return <MakeDeposit />
    }
    case MintingStep.InitiateMinting: {
      return <InitiateMinting />
    }
    case MintingStep.MintingSuccess: {
      return <MintingSuccess />
    }
    default:
      return null
  }
}
