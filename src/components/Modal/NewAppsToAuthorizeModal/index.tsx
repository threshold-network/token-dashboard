import { FC, useState } from "react"
import { Link as RouterLink } from "react-router-dom"
import InfoBox from "../../InfoBox"
import {
  BodyLg,
  Button,
  Card,
  H5,
  LabelMd,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Stack,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import { useStakingState } from "../../../hooks/useStakingState"
import { getStakeType } from "../../../utils/getStakeType"
import { isSameETHAddress } from "../../../web3/utils"
import { Alert, AlertDescription, AlertIcon, Link } from "@chakra-ui/react"
import { isAddress } from "web3-utils"

const NewAppsToAuthorizeModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { stakes } = useStakingState()

  const [selectedAuthorizerAddress, setSelectedAuthorizerAddress] = useState("")

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
              onChange={setSelectedAuthorizerAddress}
              value={selectedAuthorizerAddress}
            >
              <Stack>
                {stakes.map((stake, i) => (
                  <Card
                    key={stake.stakingProvider}
                    boxShadow="none"
                    borderColor={
                      isAddress(selectedAuthorizerAddress) &&
                      isSameETHAddress(
                        stake.authorizer,
                        selectedAuthorizerAddress
                      )
                        ? "brand.500"
                        : undefined
                    }
                  >
                    <Radio value={stake.authorizer} size="lg">
                      <LabelMd ml={4}>
                        STAKE {i + 1} {getStakeType(stake)}
                      </LabelMd>
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
        <Button
          mr={2}
          as={RouterLink}
          to={`/staking/authorize/${selectedAuthorizerAddress}`}
          onClick={closeModal}
          disabled={!selectedAuthorizerAddress}
          style={{ pointerEvents: selectedAuthorizerAddress ? "auto" : "none" }}
        >
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(NewAppsToAuthorizeModal)
