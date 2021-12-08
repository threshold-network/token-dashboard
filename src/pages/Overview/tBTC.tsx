import { FC } from "react"
import { Button, HStack, Image } from "@chakra-ui/react"
import Card from "../../components/Card"
import { H4 } from "../../components/Typography"

const tBTC: FC = () => {
  return (
    <Card>
      <HStack>
        <H4 maxW="500px">tBTC Page</H4>
      </HStack>
    </Card>
  )
}
export default tBTC
