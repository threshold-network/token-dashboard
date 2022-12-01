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

const AnalyticsRejected: FC = () => {
  const { closeModal } = useModal()

  return (
    <>
      <ModalBody>
        <Alert status="success">
          <AlertIcon />
          <BodyMd>Analytics are turned off</BodyMd>
        </Alert>
        <InfoBox p={6}>
          <H5 mb={4}>You have opted out of analytics</H5>
          <BodyLg>
            If you change your mind, you can turn analytics on at any time in{" "}
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

export default AnalyticsRejected
