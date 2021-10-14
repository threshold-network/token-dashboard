import { FC, ReactElement } from "react"
import { Button, Circle, Icon, MenuButton } from "@chakra-ui/react"

const NetworkButton: FC<{ chainId?: number; networkIcon: any }> = ({
  chainId,
  networkIcon,
}) => {
  return (
    <MenuButton
      as={Button}
      display={{
        base: "none",
        md: "block",
      }}
      leftIcon={<Icon as={networkIcon} />}
    />
  )
}

export default NetworkButton
