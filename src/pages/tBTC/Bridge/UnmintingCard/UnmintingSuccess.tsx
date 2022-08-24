import { FC } from "react"
import { Box, Button, Flex } from "@threshold-network/components"
import ViewInBlockExplorer from "../../../../components/ViewInBlockExplorer"
import { ExplorerDataType } from "../../../../utils/createEtherscanLink"

export const UnmintingSuccess: FC = () => {
  return (
    <Box>
      <Button onClick={() => {}} isFullWidth mb={6}>
        Dismiss
      </Button>
      <Flex justifyContent="center">
        <ViewInBlockExplorer
          id="NEED BRIDGE CONTRACT ADDRESS"
          type={ExplorerDataType.ADDRESS}
          text="Bridge Contract"
        />
      </Flex>
    </Box>
  )
}
