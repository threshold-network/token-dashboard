import { FC, ComponentProps } from "react"
import { Card } from "@threshold-network/components"
import backroundImage from "../../../../static/images/minting-completed-card-bg.png"

type BridgeProcessDetailsCardProps = ComponentProps<typeof Card> & {
  isProcessCompleted: boolean
}

const processCompletedStyles = {
  backgroundImage: backroundImage,
  backgroundPosition: "bottom -10px right",
  backgroundRepeat: "no-repeat",
}

export const BridgeProcessDetailsCard: FC<BridgeProcessDetailsCardProps> = ({
  isProcessCompleted,
  children,
  ...restPros
}) => {
  return (
    <Card {...(isProcessCompleted ? processCompletedStyles : {})} {...restPros}>
      {children}
    </Card>
  )
}
