import { FC, ComponentProps } from "react"
import { UnorderedList, ListItem } from "@chakra-ui/react"
import Card from "../../../components/Card"
import { Body2, Label3 } from "../../../components/Typography"
import ViewInBlockExplorer from "../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"

export const ThresholdStakesCard: FC<
  ComponentProps<typeof Card> & { tStakingContractAddress: string }
> = ({ tStakingContractAddress, ...props }) => {
  return (
    <Card {...props}>
      <Label3>threshold stakes</Label3>
      <Body2 mt="5">
        Either you are a new staker, a legacy NU staker or a legacy KEEP staker
        we have a role and a place for everyone.
      </Body2>
      <Body2 mt="5">
        The{" "}
        <ViewInBlockExplorer
          id={tStakingContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract"
        />
        supports two types of stakes:
      </Body2>
      <UnorderedList mt="5">
        <ListItem>Legacy Stakes (NuCypher and KeepNetwork stakes)</ListItem>
        <ListItem>New T Stakes</ListItem>
      </UnorderedList>
    </Card>
  )
}
