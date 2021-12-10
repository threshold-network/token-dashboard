import { FC } from "react"
import CardTemplate from "./CardTemplate"
import { HStack } from "@chakra-ui/react"
import StatBox from "./StatBox"

const Nodes: FC = () => {
  const nodes = [
    { value: 800, text: "Total nodes" },
    { value: 800, text: "Active nodes" },
    { value: 800, text: "Down nodes" },
  ]

  return (
    <CardTemplate title="NODES">
      <HStack justifyContent="space-between" spacing={4}>
        {nodes.map((node) => (
          <StatBox {...node} />
        ))}
      </HStack>
    </CardTemplate>
  )
}

export default Nodes
