import { FC } from "react"
import {
  Alert,
  AlertIcon,
  BodyMd,
  BodyLg,
  Button,
  ModalBody,
  ModalFooter,
  H5,
} from "@threshold-network/components"
import InfoBox from "../../InfoBox"
import Link from "../../Link"
import { useModal } from "../../../hooks/useModal"

const AnalyticsAccepted: FC = () => {
  const { closeModal } = useModal()

  return (
    <>
      <ModalBody>
        <Alert status="success">
          <AlertIcon />
          <BodyMd>Analytics are turned on</BodyMd>
        </Alert>
        <InfoBox p={6}>
          <H5 mb={4}>Thanks for opting in!</H5>
          <BodyLg>
            This will help us to make the product even better. You can change
            the analytics setting at any time in{" "}
            <Link to="/feedback/settings">Feedback Settings</Link>.
          </BodyLg>
        </InfoBox>
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Dismiss</Button>
      </ModalFooter>
    </>
  )
}

export default AnalyticsAccepted
