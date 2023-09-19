import {
  AlertBox,
  AlertDescription,
  Badge,
  BodyLg,
  Button,
  Card,
  H5,
  HStack,
  LineDivider,
  useColorModeValue,
} from "@threshold-network/components"
import { BigNumber } from "ethers"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { RootState } from "../../../store"
import { StakeData } from "../../../types"
import { AddressZero, isSameETHAddress, isAddress } from "../../../web3/utils"
import { StakeCardHeaderTitle } from "../StakeCard/Header/HeaderTitle"
import AuthorizeApplicationsCardCheckbox, {
  AppAuthDataProps,
} from "./AuthorizeApplicationsCardCheckbox"
import { FC, useEffect, useRef, useState, RefObject } from "react"
import {
  requestStakeByStakingProvider,
  selectStakeByStakingProvider,
} from "../../../store/staking"
import { useWeb3React } from "@web3-react/core"
import {
  useStakingAppDataByStakingProvider,
  useStakingApplicationAddress,
  useStakingAppMinAuthorizationAmount,
} from "../../../hooks/staking-applications"
import { useModal } from "../../../hooks/useModal"
import { ModalType } from "../../../enums"
import { FormikProps } from "formik"
import { FormValues } from "../../../components/Forms"
import { useAppDispatch } from "../../../hooks/store"
import { stakingApplicationsSlice } from "../../../store/staking-applications"
import BundledRewardsAlert from "../../../components/BundledRewardsAlert"

const AuthorizeStakingAppsPage: FC = () => {
  const { stakingProviderAddress } = useParams()
  const { account, active } = useWeb3React()
  const navigate = useNavigate()
  const { openModal } = useModal()
  const tbtcAppFormRef = useRef<FormikProps<FormValues>>(null)
  const randomBeaconAppFormRef = useRef<FormikProps<FormValues>>(null)
  const tacoAppFormRef = useRef<FormikProps<FormValues>>(null)
  const stakinAppNameToFormRef: Record<
    AppAuthDataProps["stakingAppId"],
    RefObject<FormikProps<FormValues>>
  > = {
    tbtc: tbtcAppFormRef,
    randomBeacon: randomBeaconAppFormRef,
    taco: tacoAppFormRef,
  }

  const dispatch = useAppDispatch()

  const tbtcAppAddress = useStakingApplicationAddress("tbtc")
  const randomBeaconAddress = useStakingApplicationAddress("randomBeacon")
  const TACoAddress = useStakingApplicationAddress("taco")
  const stakinAppNameToAddress: Record<
    AppAuthDataProps["stakingAppId"],
    string
  > = {
    tbtc: tbtcAppAddress,
    randomBeacon: randomBeaconAddress,
    taco: TACoAddress,
  }

  useEffect(() => {
    if (!isAddress(stakingProviderAddress!)) navigate(`/staking`)
  }, [stakingProviderAddress, navigate])

  useEffect(() => {
    dispatch(
      requestStakeByStakingProvider({ stakingProvider: stakingProviderAddress })
    )
  }, [stakingProviderAddress, account, dispatch])

  useEffect(() => {
    dispatch(stakingApplicationsSlice.actions.getSupportedApps({}))
  }, [dispatch, account])

  const tbtcApp = useStakingAppDataByStakingProvider(
    "tbtc",
    stakingProviderAddress || AddressZero
  )
  const randomBeaconApp = useStakingAppDataByStakingProvider(
    "randomBeacon",
    stakingProviderAddress || AddressZero
  )
  const tacoApp = useStakingAppDataByStakingProvider(
    "taco",
    stakingProviderAddress || AddressZero
  )

  const appsAuthData: {
    [appName: string]: AppAuthDataProps & { address?: string }
  } = {
    tbtc: {
      ...tbtcApp,
      stakingAppId: "tbtc",
      address: tbtcAppAddress,
      label: "tBTC",
    },
    randomBeacon: {
      ...randomBeaconApp,
      stakingAppId: "randomBeacon",
      address: randomBeaconAddress,
      label: "Random Beacon",
    },
    taco: {
      ...tacoApp,
      stakingAppId: "taco",
      label: "TACo",
      address: TACoAddress,
    },
  }

  const isFullyAuthorized = Object.values(appsAuthData).every(
    ({ status, percentage }) =>
      (status === "authorized" && percentage === 100) ||
      status === "authorization-not-required"
  )

  useEffect(() => {
    if (tbtcApp.isAuthorized) {
      setSelectedApps((selectedApps) =>
        selectedApps.filter(({ stakingAppId }) => stakingAppId !== "tbtc")
      )
    }

    if (randomBeaconApp.isAuthorized) {
      setSelectedApps((selectedApps) =>
        selectedApps.filter(
          ({ stakingAppId }) => stakingAppId !== "randomBeacon"
        )
      )
    }

    if (tacoApp.isAuthorized) {
      setSelectedApps((selectedApps) =>
        selectedApps.filter(({ stakingAppId }) => stakingAppId !== "taco")
      )
    }
  }, [tbtcApp.isAuthorized, randomBeaconApp.isAuthorized, tacoApp.isAuthorized])

  const tbtcMinAuthAmount = useStakingAppMinAuthorizationAmount("tbtc")
  const randomBeaconMinAuthAmount =
    useStakingAppMinAuthorizationAmount("randomBeacon")
  const tacoMinAuthAmount = useStakingAppMinAuthorizationAmount("taco")

  const stake = useSelector((state: RootState) =>
    selectStakeByStakingProvider(state, stakingProviderAddress!)
  ) as StakeData

  const isLoggedInAsAuthorizer =
    stake && account ? isSameETHAddress(stake.authorizer, account) : false

  const isInactiveStake = stake
    ? BigNumber.from(stake?.totalInTStake).isZero()
    : false

  const isAppSelected = (stakingAppName: AppAuthDataProps["stakingAppId"]) => {
    return selectedApps.map((app) => app.stakingAppId).includes(stakingAppName)
  }

  const onAuthorizeApps = async () => {
    const isTbtcSelected = isAppSelected("tbtc")
    const isRandomBeaconSelected = isAppSelected("randomBeacon")
    const isTacoSelected = isAppSelected("taco")

    if (isTbtcSelected) {
      await tbtcAppFormRef.current?.validateForm()
      tbtcAppFormRef.current?.setTouched({ tokenAmount: true }, false)
    }
    if (isRandomBeaconSelected) {
      await randomBeaconAppFormRef.current?.validateForm()
      randomBeaconAppFormRef.current?.setTouched({ tokenAmount: true }, false)
    }
    if (isTacoSelected) {
      await tacoAppFormRef.current?.validateForm()
      tacoAppFormRef.current?.setTouched({ tokenAmount: true }, false)
    }
    if (
      (isRandomBeaconSelected &&
        isTbtcSelected &&
        tbtcAppFormRef.current?.isValid &&
        randomBeaconAppFormRef.current?.isValid) ||
      (isTbtcSelected &&
        !isRandomBeaconSelected &&
        tbtcAppFormRef.current?.isValid) ||
      (isRandomBeaconSelected &&
        !isTbtcSelected &&
        randomBeaconAppFormRef.current?.isValid)
    ) {
      openModal(ModalType.AuthorizeStakingApps, {
        stakingProvider: stakingProviderAddress!,
        totalInTStake: stake.totalInTStake,
        applications: selectedApps.map((_) => ({
          appName: _.stakingAppId,
          address: stakinAppNameToAddress[_.stakingAppId],
          authorizationAmount:
            stakinAppNameToFormRef[_.stakingAppId].current?.values.tokenAmount,
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

  const shouldRenderBundledRewardsAlert = () => {
    const isTbtcSelected = isAppSelected("tbtc")
    const isRandomBeaconSelected = isAppSelected("randomBeacon")

    // If one of the app is selected and the other one is either selected or
    // authorized.
    return Boolean(
      (!tbtcApp.isAuthorized &&
        !isTbtcSelected &&
        (isRandomBeaconSelected || randomBeaconApp.isAuthorized)) ||
        (!randomBeaconApp.isAuthorized &&
          !isRandomBeaconSelected &&
          (isTbtcSelected || tbtcApp.isAuthorized))
    )
  }

  const alertTextColor = useColorModeValue("gray.900", "white")

  if (active && !stake)
    return (
      <BodyLg>No stake found for address: {stakingProviderAddress} </BodyLg>
    )

  return active ? (
    <>
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
            <StakeCardHeaderTitle stakeType={stake?.stakeType} />
          </HStack>
        </HStack>
        <LineDivider />
        {stake && !isLoggedInAsAuthorizer && (
          <AlertBox status="warning" mb="4">
            <AlertDescription>
              Only the authorizer can authorize staking applications. Please
              connect your wallet as an authorizer of this stake.
            </AlertDescription>
          </AlertBox>
        )}

        {!isFullyAuthorized && (
          <AlertBox status="magic" alignItems="flex-start">
            <AlertDescription color={alertTextColor}>
              In order to earn rewards, please authorize Threshold apps to use
              your stake. Note that you can authorize 100% of your stake for all
              of the apps. You can change this amount at any time.
            </AlertDescription>
          </AlertBox>
        )}

        {stake === undefined ? (
          <BodyLg textAlign="center" mt="4">
            Loading stake data...
          </BodyLg>
        ) : (
          <>
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
              canSubmitForm={isLoggedInAsAuthorizer}
            />
            {shouldRenderBundledRewardsAlert() && <BundledRewardsAlert />}
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
              canSubmitForm={isLoggedInAsAuthorizer}
            />
            <AuthorizeApplicationsCardCheckbox
              mt={5}
              appAuthData={appsAuthData.taco}
              totalInTStake={stake.totalInTStake}
              onCheckboxClick={onCheckboxClick}
              isSelected={isAppSelected("taco")}
              maxAuthAmount={stake.totalInTStake}
              minAuthAmount={"0"}
              stakingProvider={stakingProviderAddress!}
            />
          </>
        )}
        {(!tbtcApp.isAuthorized ||
          !randomBeaconApp.isAuthorized ||
          !tacoApp.isAuthorized) && (
          <Button
            disabled={selectedApps.length === 0 || !isLoggedInAsAuthorizer}
            variant="outline"
            width="100%"
            mt={5}
            onClick={onAuthorizeApps}
          >
            Authorize Selected Apps
          </Button>
        )}
      </Card>
    </>
  ) : (
    <H5>{`Please connect your wallet.`}</H5>
  )
}

export default AuthorizeStakingAppsPage
