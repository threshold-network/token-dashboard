import { Button, ButtonProps } from "@threshold-network/components"
import { FC } from "react"
import { useCapture } from "../../hooks/posthog"
import { PosthogEvent } from "../../types/posthog"

type TrackingButtonProps = {
  capturedButtonName: string
}

export const TrackingButton: FC<ButtonProps & TrackingButtonProps> = ({
  capturedButtonName,
  onClick,
  ...restProps
}) => {
  const captureOnButtonClick = useCapture(PosthogEvent.ButtonClicked)

  const _onClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    captureOnButtonClick({ buttonName: capturedButtonName })
    if (onClick) onClick(event)
  }

  return (
    <Button
      {...restProps}
      onClick={_onClick}
      data-ph-capture-attribute-button-name={capturedButtonName}
    />
  )
}
