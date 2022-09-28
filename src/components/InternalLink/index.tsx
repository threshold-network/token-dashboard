import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Icon, Link, LinkProps, useColorModeValue } from "@chakra-ui/react"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  to: string
  withArrow?: boolean
  icon?: ReactElement
}

const InternalLink: FC<Props & LinkProps> = ({
  withArrow,
  icon,
  to,
  children,
  ...props
}) => {
  const defaultColor = useColorModeValue("brand.500", "white")
  const finalColor = props.color ? props.color : defaultColor

  return (
    <Link
      as={RouterLink}
      to={to}
      color={finalColor}
      textDecoration="underline"
      {...props}
    >
      {children}
      {withArrow ? (
        <Icon boxSize="12px" ml="1" as={FiArrowUpRight} color={finalColor} />
      ) : (
        icon
      )}
    </Link>
  )
}

export default InternalLink
