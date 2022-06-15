import { IoInformationCircleSharp } from "react-icons/all"
import { Icon, IconProps, Tooltip } from "@chakra-ui/react"
import { FC } from "react"

const TooltipIcon: FC<{ label: string } & IconProps> = ({
  label,
  css,
  ...iconProps
}) => {
  return (
    <Tooltip label={label} fontSize="md">
      <span>
        <Icon
          color="gray.500"
          boxSize="16px"
          as={IoInformationCircleSharp}
          {...iconProps}
        />
      </span>
    </Tooltip>
  )
}

export default TooltipIcon
