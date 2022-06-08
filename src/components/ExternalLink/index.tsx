import { FC, ReactElement } from "react"
import { Icon, Link, LinkProps, useColorModeValue } from "@chakra-ui/react"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  href: string
  text: string
  withArrow?: boolean
  icon?: ReactElement
}

const ExternalLink: FC<Props & LinkProps> = ({
  text,
  href,
  withArrow,
  icon,
  ...props
}) => {
  const defaultColor = useColorModeValue("brand.500", "white")
  const finalColor = props.color ? props.color : defaultColor

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      color={finalColor}
      textDecoration="underline"
      {...props}
    >
      {text}{" "}
      {withArrow && !icon && (
        <Icon boxSize="12px" as={FiArrowUpRight} color={finalColor} />
      )}
      {icon && icon}
    </Link>
  )
}

export * from "./SharedLinks"

export default ExternalLink
