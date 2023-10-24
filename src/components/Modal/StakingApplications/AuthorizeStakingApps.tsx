import { FC } from "react"
import {
  BodyLg,
  Button,
  Card,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  LabelSm,
  BodyMd,
  List,
  ListItem,
} from "@threshold-network/components"
import { CheckCircleIcon } from "@chakra-ui/icons"
import InfoBox from "../../InfoBox"
import TokenBalance from "../../TokenBalance"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import BundledRewardsAlert from "../../BundledRewardsAlert"
import withBaseModal from "../withBaseModal"
import {
  calculatePercenteage,
  formatPercentage,
} from "../../../utils/percentage"
import { BaseModalProps } from "../../../types"
import { useAuthorizeMultipleAppsTransaction } from "../../../hooks/staking-applications"
import { useAppSelector } from "../../../hooks/store"
import {
  selectStakingAppByStakingProvider,
  StakingAppName,
} from "../../../store/staking-applications"
import { getStakingAppLabelFromAppName } from "../../../utils/getStakingAppLabel"
import ModalCloseButton from "../ModalCloseButton"

export type AuthorizeAppsProps = BaseModalProps & {
  stakingProvider: string
  totalInTStake: string
  applications: {
    appName: StakingAppName
    address: string
    authorizationAmount: string
  }[]
}

const AuthorizeStakingAppsBase: FC<AuthorizeAppsProps> = ({
  stakingProvider,
  totalInTStake,
  applications,
  closeModal,
}) => {
  const tbtcAppAuthData = useAppSelector((state) =>
    selectStakingAppByStakingProvider(state, "tbtc", stakingProvider)
  )
  const randomBeaconAuthData = useAppSelector((state) =>
    selectStakingAppByStakingProvider(state, "randomBeacon", stakingProvider)
  )
  const { authorizeMultipleApps } = useAuthorizeMultipleAppsTransaction()
  const onAuthorize = async () => {
    await authorizeMultipleApps(
      applications.map((_) => ({
        address: _.address,
        amount: _.authorizationAmount,
      })),
      stakingProvider
    )
  }
  const numberOfApps = applications.length

  return (
    <>
      <ModalHeader>Authorize Apps</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal" mb="6" mt="0">
          <H5>
            You are authorizing your stake for Threshold application
            {numberOfApps > 1 ? "s" : ""}.
          </H5>
          <BodyLg mt="4">
            This will require {numberOfApps} transaction
            {numberOfApps > 1 ? "s" : ""}. You can adjust the authorization
            amount at any time.
          </BodyLg>
        </InfoBox>
        <List spacing="2.5">
          {applications.map((app) => (
            <ListItem key={app.appName}>
              <StakingApplicationToAuth
                {...app}
                stakingProvider={stakingProvider}
                totalInTStake={totalInTStake}
              />
            </ListItem>
          ))}
        </List>
        {numberOfApps === 1 &&
          !tbtcAppAuthData.isAuthorized &&
          !randomBeaconAuthData.isAuthorized && <BundledRewardsAlert />}
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button mr={2} onClick={onAuthorize}>
          Authorize
        </Button>
      </ModalFooter>
    </>
  )
}

const StakingApplicationToAuth: FC<{
  appName: StakingAppName
  authorizationAmount: string
  stakingProvider: string
  totalInTStake: string
}> = ({ appName, authorizationAmount, stakingProvider, totalInTStake }) => {
  const percentage = formatPercentage(
    calculatePercenteage(authorizationAmount, totalInTStake),
    undefined,
    true
  )

  return (
    <Card>
      <LabelSm mb="4">
        <CheckCircleIcon color="green.500" verticalAlign="top" mr="2" />
        {getStakingAppLabelFromAppName(appName)} app - {percentage}
      </LabelSm>
      <BodyMd mb="3">Authorization Amount</BodyMd>
      <TokenBalance
        tokenAmount={authorizationAmount}
        isLarge
        withSymbol
        tokenSymbol="T"
      />
      <StakeAddressInfo stakingProvider={stakingProvider} mb="0" />
    </Card>
  )
}

export const AuthorizeStakingApps = withBaseModal(AuthorizeStakingAppsBase)
