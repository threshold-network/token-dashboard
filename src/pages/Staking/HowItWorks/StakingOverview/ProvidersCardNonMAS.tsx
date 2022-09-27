import { FC, ComponentProps } from "react"
import { LabelSm, BoxLabel, Card } from "@threshold-network/components"
import {
  AllAppsProvidersList,
  PreOnlyProvidersList,
} from "../../../../components/StakingProvidersList"

export const ProvidersCardNonMAS: FC<ComponentProps<typeof Card>> = (props) => {
  return (
    <Card {...props}>
      <LabelSm>threshold and pre staking providers</LabelSm>
      <AllAppsProvidersList />
      <BoxLabel my="5" w="fit-content">
        PRE Only
      </BoxLabel>
      <PreOnlyProvidersList />
    </Card>
  )
}
