import { FC } from "react"
import Card from "../../../components/Card"
import { Button, HStack, Image } from "@chakra-ui/react"
import overviewPeople from "../../../static/images/overview-people.png"
import { H4 } from "../../../components/Typography"

const UpgradeBanner: FC = () => {
  return (
    <Card w="100%">
      <HStack justify="space-between">
        <Image src={overviewPeople} />
        <H4 maxW="500px">
          Have KEEP or Nu tokens? Upgrade them to T and harness the power of
          Threshold.
        </H4>
        <Button size="lg">Upgrade Tokens</Button>
      </HStack>
    </Card>
  )
}

export default UpgradeBanner
