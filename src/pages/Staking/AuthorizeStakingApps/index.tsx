import {
  AlertBox,
  AlertDescription,
  Badge,
  Button,
  Card,
  FilterTabs,
  H5,
  HStack,
  LineDivider,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { RootState } from "../../../store"
import { PageComponent } from "../../../types"
import { isSameETHAddress } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import AuthorizeApplicationsCardCheckbox, {
  AppAuthDataProps,
} from "./AuthorizeApplicationsCardCheckbox"
import { useState } from "react"

const AuthorizeStakingAppsPage: PageComponent = (props) => {
  const { authorizerAddress } = useParams()
  const stakes = useSelector((state: RootState) => state.staking.stakes)
  const stake = stakes.find((stake) => {
    if (authorizerAddress) {
      return isSameETHAddress(stake.authorizer, authorizerAddress)
    }
  })

  const isInActiveStake = stake
    ? BigNumber.from(stake?.totalInTStake).isZero()
    : false

  // TODO: This will probably be fetched from contracts
  const appsAuthData = {
    tbtc: {
      label: "tBTC",
      isAuthorized: true,
      percentage: 40,
      isAuthRequired: true,
    },
    randomBeacon: {
      label: "Random Beacon",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: true,
    },
    pre: {
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      isAuthRequired: false,
    },
  }

  const onAuthorizeApps = () => {
    console.log("Authorize Apps!!", selectedApps)
  }

  const [selectedApps, setSelectedApps] = useState<AppAuthDataProps[]>([])

  const onCheckboxClick = (app: AppAuthDataProps, isChecked: boolean) => {
    if (isChecked) {
      setSelectedApps([...selectedApps, app])
    } else {
      setSelectedApps(selectedApps.filter(({ label }) => label !== app.label))
    }
  }

  return stake ? (
    <>
      <FilterTabs
        tabs={[
          { title: "Stake Overview", tabId: "1" },
          { title: "Authorize Application", tabId: "2" },
        ]}
        selectedTabId="2"
        mb="5"
        size="lg"
      />
      <Card>
        <HStack justify={"space-between"}>
          <H5>Authorize Applications</H5>
          <HStack>
            <Badge
              colorScheme={isInActiveStake ? "gray" : "green"}
              variant="subtle"
              size="small"
              mr="2"
            >
              {isInActiveStake ? "inactive" : "active"}
            </Badge>
            <StakeCardHeaderTitle stake={stake} />
          </HStack>
        </HStack>
        <LineDivider />
        <AlertBox status="magic" alignItems="flex-start">
          <AlertDescription color={"gray.700"}>
            In order to earn rewards, please authorize Threshold apps to use
            your stake. Note that you can authorize 100% of your stake for all
            of the apps. You can change this amount at any time.
          </AlertDescription>
        </AlertBox>
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.tbtc}
          onCheckboxClick={onCheckboxClick}
          isSelected={selectedApps.map((app) => app.label).includes("tBTC")}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.randomBeacon}
          onCheckboxClick={onCheckboxClick}
          isSelected={selectedApps
            .map((app) => app.label)
            .includes("Random Beacon")}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.pre}
          onCheckboxClick={onCheckboxClick}
          isSelected={selectedApps.map((app) => app.label).includes("PRE")}
        />
        <Button
          disabled={selectedApps.length === 0}
          variant="outline"
          width="100%"
          mt={5}
          onClick={onAuthorizeApps}
        >
          Authorize selected apps
        </Button>
      </Card>
    </>
  ) : (
    <H5>Please connect your wallet</H5>
  )
}

AuthorizeStakingAppsPage.route = {
  path: "authorize/:authorizerAddress",
  index: false,
  title: "Authorize",
  hideFromMenu: true,
  isPageEnabled: true,
}

export default AuthorizeStakingAppsPage
