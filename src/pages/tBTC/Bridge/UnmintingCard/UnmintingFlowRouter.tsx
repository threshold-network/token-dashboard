import { FC } from "react"
import { useTbtcState } from "../../../../hooks/useTbtcState"
import { UnmintingStep } from "../../../../types/tbtc"
import { ProvideData } from "./ProvideData"
import { UnmintingSuccess } from "./UnmintingSuccess"

export const UnmintingFlowRouter: FC = () => {
  const { unmintingStep } = useTbtcState()

  switch (unmintingStep) {
    case UnmintingStep.ProvideData: {
      return <ProvideData />
    }
    case UnmintingStep.Success: {
      return <UnmintingSuccess />
    }
    default:
      return null
  }
}
