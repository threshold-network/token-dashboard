import { FC, ReactElement } from "react"
import { Link as RouterLink } from "react-router-dom"
import {
  forwardRef,
  Icon,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps,
  useColorModeValue,
} from "@threshold-network/components"
import { FiArrowUpRight } from "react-icons/all"

interface CommonLinkProps {
  icon?: ReactElement
}

type LinkHrefProps =
  | { isExternal?: false; href?: never }
  | { isExternal: true; href: string }

type LinkToProps =
  | { isExternal?: false; to: string }
  | { isExternal: true; to?: never }

type ConditionalLinkProps = LinkHrefProps & LinkToProps

export type LinkProps = CommonLinkProps & ConditionalLinkProps

const Link: FC<ChakraLinkProps & LinkProps> = forwardRef(
  ({ isExternal, href, to, icon, children, ...props }, ref) => {
    const defaultColor = useColorModeValue("brand.500", "white")
    const finalColor = props.color ? props.color : defaultColor

    return (
      <ChakraLink
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
      </ChakraLink>
    )
  }
)

export * from "./SharedLinks"

export default Link
