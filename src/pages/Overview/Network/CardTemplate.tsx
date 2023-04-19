import { FC } from "react"
import { LabelSm, Card, BoxProps } from "@threshold-network/components"

const CardTemplate: FC<{ title: string | JSX.Element } & BoxProps> = ({
  title,
  children,
  ...boxProps
}) => {
  return (
    <Card h="100%" w="100%" {...boxProps}>
      {typeof title === "string" ? <LabelSm>{title}</LabelSm> : title}
      {children}
    </Card>
  )
}

export default CardTemplate
