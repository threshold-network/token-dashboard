import { FC } from "react"
import Card from "../../../components/Card"
import { Label3 } from "../../../components/Typography"
import { Divider } from "../../../components/Divider"

const CardTemplate: FC<{ title: string | JSX.Element }> = ({
  title,
  children,
}) => {
  return (
    <Card h="100%" w="100%">
      {typeof title === "string" ? (
        <Label3 textDecoration="uppercase">{title}</Label3>
      ) : (
        title
      )}
      <Divider borderColor="gray.300" />
      {children}
    </Card>
  )
}

export default CardTemplate
