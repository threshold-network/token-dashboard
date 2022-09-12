import { FC, ComponentProps } from "react"
import { Box } from "@chakra-ui/react"
import {
  PreSetupSteps,
  LegacyStakesDepositSteps,
} from "../../../components/StakingTimeline"
import { BodyMd, LabelSm, Card } from "@threshold-network/components"
import ViewInBlockExplorer from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"

export const LegacyStakesCard: FC<
  ComponentProps<typeof Card> & { tStakingContractAddress: string }
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
        on the legacy dashboard.
      </BodyMd>
      <LegacyStakesDepositSteps />
      <Box mt="6">
        <PreSetupSteps />
      </Box>
    </Card>
  )
}
