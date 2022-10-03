import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  Icon,
  Link,
  LinkProps,
  useColorModeValue,
  forwardRef,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"

interface Props {
  // TODO conditional props
  href?: string
  icon?: ReactElement
  isExternal?: boolean
}

const ExternalLink: FC<Props & LinkProps> = forwardRef(
  ({ isExternal, href, to, icon, children, ...props }, ref) => {
    const defaultColor = useColorModeValue("brand.500", "white")
    const finalColor = props.color ? props.color : defaultColor

    return (
      <Link
        as={isExternal ? "a" : RouterLink}
        ref={isExternal ? ref : undefined}
        href={isExternal ? href : undefined}
        to={isExternal ? undefined : to}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        color={finalColor}
        textDecoration="underline"
        {...props}
      >
        {children}
        {icon || <Icon boxSize="12px" ml="1" as={FiArrowUpRight} />}
      </Link>
    )
  }
)

export * from "./SharedLinks"

export default ExternalLink
