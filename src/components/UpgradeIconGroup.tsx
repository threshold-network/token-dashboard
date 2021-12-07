import { Token } from "../enums"
import { Box, HStack, Icon } from "@chakra-ui/react"
import Keep from "../static/icons/Keep"
import Nu from "../static/icons/Nu"
import { BsArrowRightShort } from "react-icons/all"
import T from "../static/icons/Ttoken"
import React, { FC } from "react"

const UpgradeIconGroup: FC<{ token: Token; boxSize?: number | string }> = ({
  token,
  boxSize = "32px",
}) => {
  return (
    <HStack>
      {token === Token.Keep && <Icon boxSize={boxSize} as={Keep} />}
      {token === Token.Nu && <Icon boxSize={boxSize} as={Nu} />}
      <Icon boxSize="32px" as={BsArrowRightShort} color="gray.400" />
      <Icon boxSize={boxSize} as={T} />
    </HStack>
  )
}

export default UpgradeIconGroup
