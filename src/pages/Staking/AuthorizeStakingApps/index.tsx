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
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../../store"
import { PageComponent, StakeData } from "../../../types"
import { isSameETHAddress } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import AuthorizeApplicationsCardCheckbox, {
  AppAuthDataProps,
} from "./AuthorizeApplicationsCardCheckbox"
import { useEffect, useState } from "react"
import { featureFlags } from "../../../constants"
import { selectStakeByStakingProvider } from "../../../store/staking"
import { useWeb3React } from "@web3-react/core"
import { isAddress } from "web3-utils"

const AuthorizeStakingAppsPage: PageComponent = (props) => {
  const { stakingProviderAddress } = useParams()
  const { account } = useWeb3React()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAddress(stakingProviderAddress!)) navigate(`/staking`)
  }, [stakingProviderAddress, navigate])

  //TODO: This should be fetched from contract for each app
  const minAuthAmount = "1000000000000000000000"

  const stake = useSelector((state: RootState) =>
    selectStakeByStakingProvider(state, stakingProviderAddress!)
  ) as StakeData

  const isLoggedInAsAuthorizer =
    stake && account ? isSameETHAddress(stake.authorizer, account) : false

  const isInactiveStake = stake
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

  return isLoggedInAsAuthorizer ? (
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
              colorScheme={isInactiveStake ? "gray" : "green"}
              variant="subtle"
              size="small"
              mr="2"
            >
              {isInactiveStake ? "inactive" : "active"}
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
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={minAuthAmount}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.randomBeacon}
          onCheckboxClick={onCheckboxClick}
          isSelected={selectedApps
            .map((app) => app.label)
            .includes("Random Beacon")}
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={minAuthAmount}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.pre}
          onCheckboxClick={onCheckboxClick}
          isSelected={selectedApps.map((app) => app.label).includes("PRE")}
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={minAuthAmount}
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
    <H5>{`Please connect your wallet as an authorizer of this stake`}</H5>
  )
}

AuthorizeStakingAppsPage.route = {
  path: "authorize/:stakingProviderAddress",
  index: false,
  title: "Authorize",
  hideFromMenu: true,
  isPageEnabled: featureFlags.MULTI_APP_STAKING,
}

export default AuthorizeStakingAppsPage
