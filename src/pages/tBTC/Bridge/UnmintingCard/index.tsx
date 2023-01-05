import { ComponentProps, FC } from "react"
import {
  Card,
  Image,
  useColorModeValue,
  BodyMd,
} from "@threshold-network/components"
import unmintingEmptyState from "../../../../static/images/unminting-empty-state.svg"
import unmintingEmptyStateDark from "../../../../static/images/unminting-empty-state-dark.svg"

export const UnmintingCard: FC<ComponentProps<typeof Card>> = ({
  ...props
}) => {
  const illustration = useColorModeValue(
    unmintingEmptyState,
    unmintingEmptyStateDark
  )
  return (
    <Card {...props}>
      <Image src={illustration} m="auto" />
      <BodyMd textAlign="center" mt="6">
        Unminting feature is under construction.
      </BodyMd>
    </Card>
  )
}
