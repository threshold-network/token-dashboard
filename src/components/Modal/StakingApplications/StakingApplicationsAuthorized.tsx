import { FC, Fragment } from "react"
import { useNavigate } from "react-router-dom"
import {
  HStack,
  BodyLg,
  Button,
  H5,
  ModalBody,
  ModalFooter,
  ModalHeader,
  List,
  ListItem,
  Alert,
  AlertIcon,
  BodySm,
  Divider,
  FlowStepStatus,
  ButtonProps,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import Link from "../../Link"
import ViewInBlockExplorer from "../../ViewInBlockExplorer"
import withBaseModal from "../withBaseModal"
import { useAppSelector } from "../../../hooks/store"
import { selectStakeByStakingProvider } from "../../../store/staking"
import {
  calculatePercenteage,
  formatPercentage,
} from "../../../utils/percentage"
import shortenAddress from "../../../utils/shortenAddress"
import { formatTokenAmount } from "../../../utils/formatAmount"
import { ExplorerDataType } from "../../../utils/createEtherscanLink"
import { ExternalHref } from "../../../enums"
import { BaseModalProps } from "../../../types"
import { getStakingAppNameFromAppAddress } from "../../../utils/getStakingAppLabel"
import StakingTimeline from "../../StakingTimeline"
import ButtonLink from "../../ButtonLink"
import ModalCloseButton from "../ModalCloseButton"

export type StakingApplicationsAuthorizeProps = BaseModalProps & {
  stakingProvider: string
  authorizedStakingApplications: {
    address: string
    amount: string
    txHash: string
  }[]
}

const StakingApplicationsAuthorizedBase: FC<
  StakingApplicationsAuthorizeProps
> = ({ stakingProvider, authorizedStakingApplications, closeModal }) => {
  const stake = useAppSelector((state) =>
    selectStakeByStakingProvider(state, stakingProvider)
  )
  const navigate = useNavigate()
  const onAuthorizeOtherApps = () => {
    closeModal()
    navigate(`/staking/${stakingProvider}/authorize`)
  }

  const numberOfAuthorizedApps = authorizedStakingApplications.length

  return (
    <>
      <ModalHeader>Step 2 Completed</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Alert status="success" mb={4}>
          <AlertIcon />
          Your authorization was successful!
        </Alert>
        <List spacing="2" mb="6">
          <ListItem>
            <HStack justifyContent="space-between">
              <BodySm>Provider Address</BodySm>
              <BodySm>{shortenAddress(stakingProvider)}</BodySm>
            </HStack>
          </ListItem>
          {authorizedStakingApplications.map((_) => (
            <ListItem key={_.address}>
              <HStack justifyContent="space-between">
                <BodySm>{`${getStakingAppNameFromAppAddress(
                  _.address
                )} Authorization Amount`}</BodySm>
                <BodySm>{`${formatTokenAmount(_.amount)} T (${formatPercentage(
                  calculatePercenteage(_.amount, stake?.totalInTStake)
                )})`}</BodySm>
              </HStack>
            </ListItem>
          ))}
        </List>
        <InfoBox variant="modal">
          <H5>
            {numberOfAuthorizedApps === 2
              ? "Continue to Step 3 to set up nodes."
              : "You can authorize more apps, or continue to Step 3 to set up nodes."}
          </H5>
          <BodyLg mt="4">
            You can adjust the authorization amount at any time from the{" "}
            <Link to="/staking">Staking page</Link>.
          </BodyLg>
        </InfoBox>
        <StakingTimeline
          mt="9"
          statuses={[
            FlowStepStatus.complete,
            FlowStepStatus.complete,
            FlowStepStatus.active,
          ]}
        />
        <BodySm align="center" mt="12">
          {numberOfAuthorizedApps === 1 ? (
            <>
              <ViewInBlockExplorer
                text="View"
                id={authorizedStakingApplications[0].txHash}
                type={ExplorerDataType.TRANSACTION}
              />{" "}
              transaction on Etherscan
            </>
          ) : (
            <>
              View{" "}
              {authorizedStakingApplications.map((_, index) => (
                <Fragment key={_.address}>
                  <ViewInBlockExplorer
                    text={`transaction ${index + 1}`}
                    id={_.txHash}
                    type={ExplorerDataType.TRANSACTION}
                  />
                  {index + 1 === numberOfAuthorizedApps ? " " : " and "}
                </Fragment>
              ))}
              on Etherscan
            </>
          )}
        </BodySm>
        <Divider mt="4" />
      </ModalBody>
      <ModalFooter>
        {numberOfAuthorizedApps === 2 ? (
          <>
            <Button variant={"outline"} onClick={closeModal} mr="2">
              Dismiss
            </Button>
            <SetupNodesButton />
          </>
        ) : (
          <>
            <SetupNodesButton variant={"outline"} />
            <Button onClick={onAuthorizeOtherApps} ml={2}>
              Authorize Other Apps
            </Button>
          </>
        )}
      </ModalFooter>
    </>
  )
}

const SetupNodesButton: FC<{ variant?: ButtonProps["variant"] }> = ({
  variant,
}) => {
  return (
    <ButtonLink variant={variant} href={ExternalHref.setupNodes} isExternal>
      Node Setup Doc
    </ButtonLink>
  )
}

export const StakingApplicationsAuthorized = withBaseModal(
  StakingApplicationsAuthorizedBase
)
