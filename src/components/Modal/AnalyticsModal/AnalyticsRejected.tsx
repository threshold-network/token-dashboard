import { FC } from "react"
import { Button, ModalBody, ModalFooter } from "@threshold-network/components"

const AnalyticsRejected: FC = () => {
  return (
    <>
      <ModalBody>Reject</ModalBody>
      <ModalFooter>
        <Button>Reject</Button>
      </ModalFooter>
    </>
  )
}

export default AnalyticsRejected
