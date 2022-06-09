import { FC } from "react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"
import { BoxProps } from "@chakra-ui/react"

const CardTemplate: FC<{ title: string | JSX.Element } & BoxProps> = ({
  title,
  children,
  ...boxProps
}) => {
  return (
    <Card h="100%" w="100%" {...boxProps}>
      {typeof title === "string" ? <Label3 mb={4}>{title}</Label3> : title}
      {children}
    </Card>
  )
}

export default CardTemplate
