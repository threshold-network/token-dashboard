import { FC, ComponentProps } from "react"
import { Box } from "@chakra-ui/react"
import Card from "../../../components/Card"
import {
  PreSetupSteps,
  LegacyStakesDepositSteps,
} from "../../../components/StakingChecklist"
import { Body2, Label3 } from "../../../components/Typography"
import ViewInBlockExplorer from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"

export const LegacyStakesCard: FC<
  ComponentProps<typeof Card> & { tStakingContractAddress: string }
> = ({ tStakingContractAddress, ...props }) => {
  return (
    <Card {...props}>
      <Label3>legacy stakes</Label3>
      <Body2 mt="5" mb="5">
        If you have an active stake on NuCypher or on Keep Network you can
        authorize the{" "}
        <ViewInBlockExplorer
          id={tStakingContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract"
        />{" "}
        on the legacy dashboard.
      </Body2>
      <LegacyStakesDepositSteps />
      <Box mt="6">
        <PreSetupSteps />
      </Box>
    </Card>
  )
}
