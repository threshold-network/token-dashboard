import { FC } from "react"
import { Button, HStack, Image } from "@chakra-ui/react"
import overviewPeople from "../../static/images/overview-people.png"
import Card from "../../components/Card"
import { H4 } from "../../components/Typography"

const Network: FC = () => {
  return (
    <Card>
      <HStack>
        <Image src={overviewPeople} />
        <H4 maxW="500px">
          Have KEEP or Nu tokens? Upgrade them to T and harness the power of
          Threshold.
        </H4>
        <Button>Upgrade Tokens</Button>
      </HStack>
    </Card>
  )
}
export default Network
