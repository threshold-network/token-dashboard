import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  forwardRef,
  Icon,
  Link,
  LinkProps,
  useColorModeValue,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"

interface CommonProps extends LinkProps {
  icon?: ReactElement
}

type LinkDestinationProps =
  | { isExternal?: false; href?: never; to?: string }
  | { isExternal?: true; href?: string; to?: never }

type Props = CommonProps & LinkDestinationProps

const ExternalLink: FC<Props> = forwardRef(
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
        {icon ? (
          icon
        ) : isExternal ? (
          <Icon boxSize="12px" ml="1" as={FiArrowUpRight} />
        ) : null}
      </Link>
    )
  }
)

export * from "./SharedLinks"

export default ExternalLink
