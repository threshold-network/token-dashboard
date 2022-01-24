import { Token } from "../enums"
import { Box, HStack, Icon, Stack } from "@chakra-ui/react"
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
    <Stack direction="row">
      {token === Token.Keep && (
        <Icon boxSize={boxSize} as={KeepCircleBrand} margin="0 !important" />
      )}
      {token === Token.Nu && (
        <Icon boxSize={boxSize} as={NuCircleBrand} margin="0 !important" />
      )}
      <Icon
        boxSize="32px"
        as={BsArrowRightShort}
        color="gray.400"
        margin="0 !important"
        alignSelf="center"
      />
      <Icon boxSize={boxSize} as={T} margin="0 !important" />
    </Stack>
  )
}

export default UpgradeIconGroup
