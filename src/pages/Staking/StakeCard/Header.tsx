import { FC } from "react"
import { Flex } from "@chakra-ui/react"

export const StakeCardHeader: FC = ({ children }) => {
  return (
    <Flex as="header" alignItems="center">
      {children}
    </Flex>
  )
}
