import { IoInformationCircleOutline } from "react-icons/all"
import {
  Icon,
  IconProps,
  Popover,
  useColorModeValue,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  BodySm,
} from "@threshold-network/components"
import { FC } from "react"

const TooltipIcon: FC<{ label: string | JSX.Element } & IconProps> = ({
  label,
  css,
  ...iconProps
}) => {
  const bgColor = useColorModeValue("white", "gray.300")
  const textColor = useColorModeValue("gray.700", "gray.900")
  const iconColor = useColorModeValue("gray.500", "gray.300")
  const boxShadow = useColorModeValue("md", "none")

  return (
    <Popover trigger="hover" placement="top">
      <PopoverTrigger>
        <span>
          <Icon
            color={iconColor}
            as={IoInformationCircleOutline}
            {...iconProps}
          />
        </span>
      </PopoverTrigger>
      <PopoverContent
        bg={bgColor}
        border="none"
        color={textColor}
        borderRadius="0.25rem"
        boxShadow={boxShadow}
      >
        <PopoverArrow bg={bgColor} />
        <BodySm as={PopoverBody} color={textColor}>
          {label}
        </BodySm>
      </PopoverContent>
    </Popover>
  )
}

export default TooltipIcon
