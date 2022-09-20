import { ComponentProps, FC } from "react"
import { BodyMd, BoxLabel, Card, LabelSm } from "@threshold-network/components"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"
import { LegacyStakesDepositSteps } from "../../../../components/StakingTimeline"

export const LegacyStakesCard: FC<
  ComponentProps<typeof Card> & {
    tStakingContractAddress: string
  }
> = ({ tStakingContractAddress, ...props }) => {
  return (
    <Card {...props}>
      <LabelSm>legacy stakes</LabelSm>
      <BodyMd mt="5" mb="5">
        If you have an active stake on NuCypher or on Keep Network you can
        authorize the{" "}
        <ViewInBlockExplorer
          id={tStakingContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract"
        />{" "}
        on the legacy dashboards.
      </BodyMd>
      <BoxLabel status="secondary" mb={6}>
        Staking Timeline
      </BoxLabel>
      <LegacyStakesDepositSteps />
    </Card>
  )
}
