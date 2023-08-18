import {
  BoxLabel,
  Divider,
  Grid,
  Card,
  BodyMd,
  H5,
} from "@threshold-network/components"
import { PageComponent } from "../../../../types"
import { featureFlags } from "../../../../constants"
import {
  AllAppsProvidersList,
  PreOnlyProvidersList,
} from "../../../../components/StakingProvidersList"

const StakingProviders: PageComponent = () => {
  return (
    <Card>
      <H5 my={8}>Staking Providers</H5>
      <Divider mb={6} />
      <BodyMd mb={10}>
        You can delegate running an application node to one of the
        node-as-a-service Staking Providers listed below. Please note that these
        staking providers are not vetted or endorsed by Threshold. Use your
        judgement when selecting a provider.
      </BodyMd>
      <Grid
        gridAutoColumns="minmax(0, 1fr)"
        gridAutoFlow="column"
        gridTemplate={{
          base: `
            "providers"
            "pre-providers"
          `,
          xl: `"providers   pre-providers"`,
        }}
        gridGap="4"
      >
        <Card gridArea="providers" h="fit-content">
          <BoxLabel status="secondary">All Applications</BoxLabel>
          <AllAppsProvidersList />
        </Card>

        <Card gridArea="pre-providers" h="fit-content">
          <BoxLabel status="secondary">Pre only</BoxLabel>
          <PreOnlyProvidersList />
        </Card>
      </Grid>
    </Card>
  )
}

StakingProviders.route = {
  path: "providers",
  index: false,
  isPageEnabled: featureFlags.MULTI_APP_STAKING,
}

export default StakingProviders
