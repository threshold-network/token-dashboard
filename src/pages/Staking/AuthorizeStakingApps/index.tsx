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
import { AddressZero, isSameETHAddress, isAddress } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import AuthorizeApplicationsCardCheckbox, {
  AppAuthDataProps,
} from "./AuthorizeApplicationsCardCheckbox"
import { useEffect, useRef, useState, RefObject } from "react"
import { featureFlags } from "../../../constants"
import { selectStakeByStakingProvider } from "../../../store/staking"
import { useWeb3React } from "@web3-react/core"
import {
  useStakingAppDataByStakingProvider,
  useStakingAppMinAuthorizationAmount,
} from "../../../hooks/staking-applications"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { FormikProps } from "formik"
import { FormValues } from "../../../components/Forms"

const AuthorizeStakingAppsPage: PageComponent = (props) => {
  const { stakingProviderAddress } = useParams()
  const { account } = useWeb3React()
  const navigate = useNavigate()
  const { openModal } = useModal()
  const tbtcAppFormRef = useRef<FormikProps<FormValues>>(null)
  const randomBeaconAppFormRef = useRef<FormikProps<FormValues>>(null)
  const preAppFormRef = useRef<FormikProps<FormValues>>(null)
  const appLabelToFormRef: Record<
    AppAuthDataProps["stakingAppId"],
    RefObject<FormikProps<FormValues>>
  > = {
    tbtc: tbtcAppFormRef,
    randomBeacon: randomBeaconAppFormRef,
    pre: preAppFormRef,
  }

  useEffect(() => {
    if (!isAddress(stakingProviderAddress!)) navigate(`/staking`)
  }, [stakingProviderAddress, navigate])

  const tbtcMinAuthAmount = useStakingAppMinAuthorizationAmount("tbtc")
  const randomBeaconMinAuthAmount =
    useStakingAppMinAuthorizationAmount("randomBeacon")

  const tbtcApp = useStakingAppDataByStakingProvider(
    "tbtc",
    stakingProviderAddress || AddressZero
  )
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProviderAddress || AddressZero
  )

  const stake = useSelector((state: RootState) =>
    selectStakeByStakingProvider(state, stakingProviderAddress!)
  ) as StakeData

  const isLoggedInAsAuthorizer =
    stake && account ? isSameETHAddress(stake.authorizer, account) : false

  const isInactiveStake = stake
    ? BigNumber.from(stake?.totalInTStake).isZero()
    : false

  const appsAuthData: {
    [appName: string]: AppAuthDataProps
  } = {
    tbtc: {
      stakingAppId: "tbtc",
      label: "tBTC",
      isAuthorized: tbtcApp.isAuthorized,
      percentage: tbtcApp.percentage,
      authorizedStake: tbtcApp.authorizedStake,
      isAuthRequired: true,
    },
    randomBeacon: {
      stakingAppId: "randomBeacon",
      label: "Random Beacon",
      isAuthorized: randomBeaconApp.isAuthorized,
      percentage: randomBeaconApp.percentage,
      authorizedStake: randomBeaconApp.authorizedStake,
      isAuthRequired: true,
    },
    pre: {
      stakingAppId: "pre",
      label: "PRE",
      isAuthorized: false,
      percentage: 0,
      authorizedStake: stake.totalInTStake,
      isAuthRequired: false,
    },
  }

  const isAppSelected = (stakingAppName: AppAuthDataProps["stakingAppId"]) => {
    return selectedApps.map((app) => app.stakingAppId).includes(stakingAppName)
  }

  const onAuthorizeApps = async () => {
    const isTbtcSelected = isAppSelected("tbtc")
    const isRandomBeaconSelected = isAppSelected("randomBeacon")

    if (isTbtcSelected) {
      await tbtcAppFormRef.current?.validateForm()
      tbtcAppFormRef.current?.setTouched({ tokenAmount: true }, false)
    } else if (isRandomBeaconSelected) {
      await randomBeaconAppFormRef.current?.validateForm()
      randomBeaconAppFormRef.current?.setTouched({ tokenAmount: true }, false)
    }
    if (
      (isTbtcSelected && tbtcAppFormRef.current?.isValid) ||
      (isRandomBeaconSelected && randomBeaconAppFormRef.current?.isValid) ||
      (isRandomBeaconSelected &&
        isTbtcSelected &&
        tbtcAppFormRef.current?.isValid &&
        randomBeaconAppFormRef.current?.isValid)
    ) {
      openModal(ModalType.AuthorizeStakingApps, {
        stakingProvider: stakingProviderAddress!,
        totalInTStake: stake.totalInTStake,
        applications: selectedApps.map((_) => ({
          appName: _.label,
          authorizationAmount:
            appLabelToFormRef[_.stakingAppId].current?.values.tokenAmount,
        })),
      })
    }
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
          formRef={tbtcAppFormRef}
          mt={5}
          appAuthData={appsAuthData.tbtc}
          totalInTStake={stake.totalInTStake}
          onCheckboxClick={onCheckboxClick}
          isSelected={isAppSelected("tbtc")}
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={tbtcMinAuthAmount}
          stakingProvider={stakingProviderAddress!}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          formRef={randomBeaconAppFormRef}
          appAuthData={appsAuthData.randomBeacon}
          totalInTStake={stake.totalInTStake}
          onCheckboxClick={onCheckboxClick}
          isSelected={isAppSelected("randomBeacon")}
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={randomBeaconMinAuthAmount}
          stakingProvider={stakingProviderAddress!}
        />
        <AuthorizeApplicationsCardCheckbox
          mt={5}
          appAuthData={appsAuthData.pre}
          totalInTStake={stake.totalInTStake}
          onCheckboxClick={onCheckboxClick}
          isSelected={isAppSelected("pre")}
          maxAuthAmount={stake.totalInTStake}
          minAuthAmount={"0"}
          stakingProvider={stakingProviderAddress!}
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
