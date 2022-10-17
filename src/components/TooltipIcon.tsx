import { IoInformationCircleOutline } from "react-icons/all"
import { Icon, IconProps, Tooltip, useColorModeValue } from "@chakra-ui/react"
import { FC } from "react"
import { ONE_SEC_IN_MILISECONDS } from "../utils/date"

const TooltipIcon: FC<{ label: string | JSX.Element } & IconProps> = ({
  label,
  css,
  ...iconProps
}) => {
  const bgColor = useColorModeValue("white", "gray.300")
  const textColor = useColorModeValue("gray.700", "gray.900")
  const iconColor = useColorModeValue("gray.500", "gray.300")

  return (
    <Tooltip
      label={label}
      fontSize="md"
      placement="top"
      hasArrow
      bg={bgColor}
      color={textColor}
      p="2"
      closeDelay={ONE_SEC_IN_MILISECONDS}
      borderRadius="1"
      shouldWrapChildren
    >
      <Icon color={iconColor} as={IoInformationCircleOutline} {...iconProps} />
    </Tooltip>
  )
}

export default TooltipIcon
