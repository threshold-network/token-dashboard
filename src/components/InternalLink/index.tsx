import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import { Icon, Link, LinkProps, useColorModeValue } from "@chakra-ui/react"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  to: string
  icon?: ReactElement
}

const InternalLink: FC<Props & LinkProps> = ({
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
    </Link>
  )
}

export default InternalLink
