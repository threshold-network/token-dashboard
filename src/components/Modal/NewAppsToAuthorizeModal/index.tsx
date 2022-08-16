import { FC, useCallback, useState } from "react"
import { useNavigate } from "react-router-dom"
import InfoBox from "../../InfoBox"
import {
  BodyLg,
  Card,
  H5,
  Button,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  Stack,
  LabelMd,
} from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import { useStakingState } from "../../../hooks/useStakingState"
import { getStakeType } from "../../../utils/getStakeType"

const NewAppsToAuthorizeModal: FC<BaseModalProps> = ({ closeModal }) => {
  const { stakes } = useStakingState()

  const [selectedAuthorizeAddress, setSelectedAuthorizeAddress] = useState("")

  const navigate = useNavigate()

  const routeToStake = useCallback(() => {
    if (selectedAuthorizeAddress.length > 0) {
      navigate(`/authorize/${selectedAuthorizeAddress}`)
      closeModal()
    }
  }, [selectedAuthorizeAddress, closeModal, navigate])

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
        <BodyLg my={6}>Choose a stake to continue:</BodyLg>
        <RadioGroup
          onChange={setSelectedAuthorizeAddress}
          value={selectedAuthorizeAddress}
        >
          <Stack>
            {stakes.map((stake, i) => (
              <Card boxShadow="none">
                <Radio value={stake.authorizer} size="lg">
                  <LabelMd ml={4}>
                    STAKE {i + 1} - {getStakeType(stake)}
                  </LabelMd>
                </Radio>
              </Card>
            ))}
          </Stack>
        </RadioGroup>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal} variant="outline" mr={2}>
          Dismiss
        </Button>
        <Button onClick={routeToStake} variant="outline" mr={2}>
          Continue
        </Button>
      </ModalFooter>
    </>
  )
}

export default withBaseModal(NewAppsToAuthorizeModal)
