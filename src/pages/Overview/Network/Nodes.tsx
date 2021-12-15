import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { HStack, Stack, useMediaQuery } from "@chakra-ui/react"
import StatBox from "./StatBox"

const Nodes: FC = () => {
  const nodes = [
    { value: 800, text: "Total" },
    { value: 800, text: "Active" },
    { value: 800, text: "Down" },
  ]

  const [isLargerThan11400] = useMediaQuery("(min-width: 1140px)")

  console.log("ue ", isLargerThan11400)

  return (
    <CardTemplate title="NODES">
      <Stack
        justifyContent="space-between"
        spacing="17px"
        direction={isLargerThan11400 ? "row" : "column"}
      >
        {nodes.map((node) => (
          <StatBox key={node.text} {...node} />
        ))}
      </Stack>
    </CardTemplate>
  )
}

export default Nodes
