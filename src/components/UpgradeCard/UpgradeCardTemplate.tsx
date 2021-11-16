import React, { FC, useMemo } from "react"
import numeral from "numeral"
import { Box, Button, HStack, Icon, Stack, Text } from "@chakra-ui/react"
import { Body3, H5 } from "../Typography"
import Card from "../Card"
import { TConversionRates, Token } from "../../enums"
import Keep from "../../static/icons/Keep"
import { BsArrowDownCircleFill, BsArrowRightShort } from "react-icons/all"
import T from "../../static/icons/Ttoken"
import Nu from "../../static/icons/Nu"
import { Divider, DividerIcon } from "../Divider"

export interface UpgradeCardTemplateProps {
  token: Token
  amountToConvert: number | string
  onSubmit: () => void
}

const UpgradeCardTemplate: FC<UpgradeCardTemplateProps> = ({
  token,
  children,
  amountToConvert,
  onSubmit,
}) => {
  const titleText = useMemo(() => {
    switch (token) {
      case Token.Nu:
        return "NU to T Upgrade"
      case Token.Keep:
        return "KEEP to T Upgrade"
      default:
        return ""
    }
  }, [token])

  const tConversionText = useMemo(() => {
    switch (token) {
      case Token.Nu:
        return `1 NU = ${TConversionRates[token]} T`
      case Token.Keep:
        return `1 KEEP = ${TConversionRates[token]} T`
      default:
        return ""
    }
  }, [token])

  const TConvertedAmount = useMemo(() => {
    if (amountToConvert === "") return 0

    const amountT = numeral(
      TConversionRates[token] * Number(amountToConvert)
    ).format("0,0.00")

    return amountT === "NaN" ? "--" : amountT
  }, [amountToConvert])

  return (
    <Card maxW="720px">
      <Stack direction="row" justify="space-between">
        <H5>{titleText}</H5>
        <Box>
          {token === Token.Keep && <Icon boxSize="32px" as={Keep} />}
          {token === Token.Nu && <Icon boxSize="32px" as={Nu} />}
          <Icon boxSize="32px" as={BsArrowRightShort} color="gray.400" />
          <Icon boxSize="32px" as={T} />
        </Box>
      </Stack>
      <Box mt={6}>
        {children}
        <Divider>
          <DividerIcon color="gray.600" as={BsArrowDownCircleFill} />
        </Divider>
        <HStack>
          <Body3 fontWeight="bold">T Amount</Body3>
          <Body3 ml={4} color="gray.500">
            {tConversionText}
          </Body3>
        </HStack>
        <Text mt={2}>{amountToConvert === "" ? "--" : TConvertedAmount}</Text>
        <Button mt={6} isFullWidth onClick={onSubmit}>
          Upgrade
        </Button>
      </Box>
    </Card>
  )
}

export default UpgradeCardTemplate
