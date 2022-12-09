import { FC } from "react"
import DappSurveyModal from "../DappSurveyModal"
import { PosthogEvent } from "../../../types/posthog"
import { BaseModalProps } from "../../../types"

const StakingBounceSurveyModal: FC<BaseModalProps> = (props) => {
  return (
    <DappSurveyModal
      title="We've noticed you did not complete your staking. What happened?"
      captureEvent={PosthogEvent.StakingFlowBounce}
      surveyQuestions={[{ text: "I mis clicked", value: "MISCLICK" }]}
      {...props}
    />
  )
}

export default StakingBounceSurveyModal
