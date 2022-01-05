import { Token } from "../enums"
import { Box, HStack, Icon } from "@chakra-ui/react"
import KeepCircleBrand from "../static/icons/KeepCircleBrand"
import NuCircleBrand from "../static/icons/NuCircleBrand"
import { BsArrowRightShort } from "react-icons/all"
import T from "../static/icons/Ttoken"
import React, { FC } from "react"

const UpgradeIconGroup: FC<{ token: Token; boxSize?: number | string }> = ({
  token,
  boxSize = "32px",
}) => {
  return (
    <HStack>
      {token === Token.Keep && <Icon boxSize={boxSize} as={KeepCircleBrand} />}
      {token === Token.Nu && <Icon boxSize={boxSize} as={NuCircleBrand} />}
      <Icon boxSize="32px" as={BsArrowRightShort} color="gray.400" />
      <Icon boxSize={boxSize} as={T} />
    </HStack>
  )
}

export default UpgradeIconGroup
