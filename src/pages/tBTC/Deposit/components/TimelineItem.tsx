import { FC } from "react"
import {
  Step,
  StepBadge,
  StepDescription,
  StepImage,
  StepIndicator,
  StepProps,
  StepTitle,
} from "../../../../components/Step"

export type TimelineProps = {
  stepText: string
  helperLabelText: string
  isActive: boolean
  isComplete: boolean
  title: string | JSX.Element
  description: string | JSX.Element
  imageSrc?: any
  withBadge?: boolean
} & StepProps

const TimelineItem: FC<TimelineProps> = ({
  stepText,
  helperLabelText,
  isComplete,
  isActive,
  title,
  description,
  imageSrc,
  withBadge = true,
  ...restProps
}) => {
  return (
    <Step {...restProps} isActive={isActive} isComplete={isComplete}>
      <StepIndicator>{stepText}</StepIndicator>
      {withBadge && <StepBadge>{helperLabelText}</StepBadge>}
      <StepTitle>{title}</StepTitle>
      <StepDescription>{description}</StepDescription>
      <StepImage imageSrc={imageSrc} />
    </Step>
  )
}

export default TimelineItem
