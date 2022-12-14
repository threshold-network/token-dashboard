import { FC } from "react"
import DappSurveyModal from "../DappSurveyModal"
import { PosthogEvent } from "../../../types/posthog"
import { BaseModalProps } from "../../../types"

const StakingBounceSurveyModal: FC<BaseModalProps> = (props) => {
  return (
    <DappSurveyModal
      title="We've noticed you did not complete your staking. What happened?"
      captureEvent={PosthogEvent.StakingFlowBounce}
      surveyQuestions={[
        { text: "I misclicked", value: "MISCLICK" },
        {
          text: "I have trouble with my hardware wallet",
          value: "HARDWARE_ISSUE",
        },
        {
          text: "I added one wrong address",
          value: "ADDED_WRONG_ADDRESS",
        },
        {
          text: "I just wanted to test the dApp",
          value: "TEST",
        },
        {
          text: "Other",
          value: "OTHER",
        },
      ]}
      {...props}
    />
  )
}

export default StakingBounceSurveyModal
