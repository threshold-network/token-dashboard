import { ComponentProps, FC } from "react"
import Card from "../../../components/Card"
import { Button, HStack } from "@chakra-ui/react"

export const MintUnmintNav: FC<
  ComponentProps<typeof Card> & {
    selectedAction: "MINT" | "UNMINT"
    setSelectedAction: (action: "MINT" | "UNMINT") => void
  }
> = ({ selectedAction, setSelectedAction, ...props }) => {
  return (
    <Card {...props}>
      <HStack>
        <Button
          variant={selectedAction === "MINT" ? "solid" : "ghost"}
          onClick={() => setSelectedAction("MINT")}
        >
          Mint
        </Button>
        <Button
          variant={selectedAction === "UNMINT" ? "solid" : "ghost"}
          onClick={() => setSelectedAction("UNMINT")}
        >
          Unmint
        </Button>
      </HStack>
    </Card>
  )
}
