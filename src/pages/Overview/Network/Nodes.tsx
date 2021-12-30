import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { HStack } from "@chakra-ui/react"
import StatBox from "./StatBox"

const Nodes: FC = () => {
  const nodes = [
    { value: 800, text: "Total" },
    { value: 800, text: "Active" },
    { value: 800, text: "Down" },
  ]

  return (
    <CardTemplate title="NODES">
      <HStack>
        {nodes.map((node) => (
          <StatBox key={node.text} {...node} />
        ))}
      </HStack>
    </CardTemplate>
  )
}

export default Nodes
