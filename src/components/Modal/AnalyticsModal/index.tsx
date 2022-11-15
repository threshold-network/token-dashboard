import { FC, useState } from "react"
import { ModalCloseButton, ModalHeader } from "@threshold-network/components"
import { BaseModalProps } from "../../../types"
import withBaseModal from "../withBaseModal"
import AnalyticsConfirmation from "./AnalyticsConfirmation"
import AnalyticsAccepted from "./AnalyticsAccepted"
import AnalyticsRejected from "./AnalyticsRejected"

const AnalyticsModalBase: FC<BaseModalProps> = ({ closeModal }) => {
  const [stage, setStage] = useState<"CONFIRM" | "ACCEPT" | "REJECT">("CONFIRM")

  return (
    <>
      <ModalHeader>Analytics</ModalHeader>
      <ModalCloseButton />
      {stage === "CONFIRM" && <AnalyticsConfirmation setStage={setStage} />}
      {stage === "ACCEPT" && <AnalyticsAccepted />}
      {stage === "REJECT" && <AnalyticsRejected />}
    </>
  )
}

export default withBaseModal(AnalyticsModalBase)
