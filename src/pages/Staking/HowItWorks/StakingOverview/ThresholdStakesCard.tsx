import { FC, ComponentProps } from "react"
import { UnorderedList, ListItem, useColorModeValue } from "@chakra-ui/react"
import { BodyMd, LabelSm, Card } from "@threshold-network/components"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

export const ThresholdStakesCard: FC<
  ComponentProps<typeof Card> & { tStakingContractAddress: string }
> = ({ tStakingContractAddress, ...props }) => {
  const bulletColor = useColorModeValue("gray.700", "gray.300")
  const bulletColorStyle = { "::marker": { color: bulletColor } }

  return (
    <Card {...props}>
      <LabelSm>threshold stakes</LabelSm>
      <BodyMd mt="5">
        Either you are a new staker, a legacy NU staker or a legacy KEEP staker
        we have a role and a place for everyone.
      </BodyMd>
      <BodyMd mt="5">
        The{" "}
        <ViewInBlockExplorer
          id={tStakingContractAddress}
          type={ExplorerDataType.ADDRESS}
          text="Threshold Staking Contract"
        />{" "}
        supports two types of stakes:
      </BodyMd>
      <UnorderedList mt="5" pl="2.5">
        <ListItem sx={bulletColorStyle}>
          <BodyMd>Legacy Stakes (NuCypher and Keep Network stakes)</BodyMd>
        </ListItem>
        <ListItem sx={bulletColorStyle}>
          <BodyMd>New T Stakes</BodyMd>
        </ListItem>
      </UnorderedList>
    </Card>
  )
}
