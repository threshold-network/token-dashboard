import { FC, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Alert,
  AlertDescription,
  AlertIcon,
  BodyLg,
  Box,
  Button,
  Card,
  H5,
  LabelSm,
  Link,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Stack,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import StakeAddressInfo from "../../../pages/Staking/StakeCard/StakeAddressInfo"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import { useStakingState } from "../../../hooks/useStakingState"
import { getStakeTitle } from "../../../utils/getStakeTitle"
import { isAddress, isSameETHAddress } from "../../../web3/utils"
import ButtonLink from "../../ButtonLink"
import ModalCloseButton from "../ModalCloseButton"

const NewAppsToAuthorizeModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { stakes } = useStakingState()

  const [selectedProviderAddress, setSelectedProviderAddress] = useState("")

  return (
    <>
      <ModalHeader>New Apps Available</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <InfoBox variant="modal">
          <H5>
            There are new apps available for you to authorize and earn rewards!
          </H5>
          <BodyLg mt="4">
            This will allow an app to use a portion of your stake. You can
            authorize 100% of your stake to all apps and change this amount at
            any time.
          </BodyLg>
        </InfoBox>
        {stakes.length > 0 ? (
          <>
            <BodyLg my={6}>Choose a stake to continue:</BodyLg>
            <RadioGroup
              onChange={setSelectedProviderAddress}
              value={selectedProviderAddress}
            >
              <Stack>
                {stakes.map((stake, i) => (
                  <Card
                    p={4}
                    key={stake.stakingProvider}
                    boxShadow="none"
                    borderColor={
                      isAddress(selectedProviderAddress) &&
                      isSameETHAddress(
                        stake.stakingProvider,
                        selectedProviderAddress
                      )
                        ? "brand.500"
                        : undefined
                    }
                  >
                    <Radio value={stake.stakingProvider} size="lg" w="100%">
                      <LabelSm as="span" mb={2} ml="4">
                        {getStakeTitle(stake.stakeType, i + 1)}
                      </LabelSm>
                      <StakeAddressInfo
                        as="span"
                        stakingProvider={stake.stakingProvider}
                        ml="4"
                        my="0"
                      />
                    </Radio>
                  </Card>
                ))}
              </Stack>
            </RadioGroup>
          </>
        ) : (
          <Alert status="warning">
            <AlertIcon />
            <AlertDescription>
              You have no stakes. You can start staking on the{" "}
              <Link
                color="brand.500"
                as={RouterLink}
                to="/staking"
                onClick={closeModal}
              >
                staking page
              </Link>
              .
            </AlertDescription>
          </Alert>
        )}
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <ButtonLink
          mr={2}
          to={`/staking/${selectedProviderAddress}/authorize`}
          onClick={closeModal}
          disabled={!selectedProviderAddress}
          style={{ pointerEvents: selectedProviderAddress ? "auto" : "none" }}
        >
          Continue
        </ButtonLink>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(NewAppsToAuthorizeModal)
